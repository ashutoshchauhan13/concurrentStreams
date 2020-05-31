var value = 0;

function increment(userId, maxAllowed) {
  let promise = new Promise((resolve, reject) => {
        if (value > maxAllowed - 1) {
          return reject('Quota of max ' + maxAllowed + ' per user exceeded');
        }
        value++;
        console.log('value');
        var result = [];
        result.push(value)
        resolve(result);
  })
  return promise;
}


function decrement(userId) {
  let promise = new Promise((resolve, reject) => {
        if (value < 1) {
          return reject('Operation failed! - You have 0 stream active');
        }
        value--;
        var result = [];
        result.push(value)
        resolve(result);
      });
  return promise;
}

function fetch(userId, maxAllowed) {
  let promise = new Promise((resolve, reject) => {
    resolve(value);
  })
  return promise;
}

module.exports = {
  increment,
  decrement,
  fetch
}
