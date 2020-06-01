const redis = require('redis');
const {
  promisify
} = require('util');

const client = redis.createClient({
  retry_strategy: function(options) {
    if (options.error && options.error.code === "ECONNREFUSED") {
      // End reconnecting on a specific error and flush all commands with
      // a individual error
      return new Error("The server refused the connection");
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      // End reconnecting after a specific timeout and flush all commands
      // with a individual error
      return new Error("Retry time exhausted");
    }
    if (options.attempt > 10) {
      // End reconnecting with built in error
      return undefined;
    }
    // reconnect after
    return Math.min(options.attempt * 100, 3000);
  },
});

const getAsync = promisify(client.get).bind(client);
const watchAsync = promisify(client.watch).bind(client);


function clear() {
  client.flushall((err, success) => {
    if (err) {
      throw new Error(err);
    }
    console.log(success);
  })
}

function increment(userId, maxAllowed) {
  let promise = new Promise((resolve, reject) => {
    watchAsync(userId).
    then(function(value) {
      return getAsync(userId);
    }).
    then(function(result) {
        if (result > maxAllowed - 1) {
          return reject('Quota of max ' + maxAllowed + ' per user exceeded');
        }
        client
          .multi()
          .incr(userId)
          .exec(function(execError, results) {
            if (execError) {
              reject('Operation rejected by redis');
            } else {
              if (results === null) {
                console.log("transaction aborted because results were null");
                reject('Operation rejected by redis');
              }
              resolve(results);
            }
          });

      })
      .catch(function(error) {
        console.log(error);
        reject('Unable to update the value this time');
      })
  })
  return promise;
}


function decrement(userId) {
  let promise = new Promise((resolve, reject) => {
    watchAsync(userId).
    then(function(value) {
      return getAsync(userId);
    }).
    then(function(result) {
        if (result < 1) {
          return reject('Operation failed! - You have 0 stream active');
        }
        client
          .multi()
          .decr(userId)
          .exec(function(execError, results) {
            if (execError) {
              reject('Operation rejected by redis');
            } else {
              if (results === null) {
                console.log("transaction aborted because results were null");
                reject('Operation rejected by redis');
              }
              resolve(results);
            }
          });

      })
      .catch(function(error) {
        console.log(error);
        reject('Unable to update the value this time');
      })
  })
  return promise;
}

function fetch(userId, maxAllowed) {
  let promise = new Promise((resolve, reject) => {
    getAsync(userId)
      .then(function(result) {
        console.log('result= ' + result);
        if (result > maxAllowed - 1) {
          return reject('Quota of max ' + maxAllowed + ' per user exceeded');
        } else {
          return resolve(result)
        }
      });
  });
  return promise;
}

function closeInstance(callback) {
  client.quit(callback)
}


module.exports = {
  increment,
  decrement,
  fetch,
  closeInstance
}
