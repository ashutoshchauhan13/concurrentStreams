# Concurrent Streams (using redis cache)
Node.js app to provide account of active stream for a streaming service

## A Node.js service that exposes an API which can be consumed from any client.
This service checks how many video streams a given user is watching and prevent a user
from watching more than 3 video streams concurrently.

## Approach
Since this service (microservice) can scale into multiple services - It's important that we keep the caching out of the control of local machine (even if a service dies - caching remains intact). For this purpose we have choosen Redis cache.
Hence using a shared cache, serving as a common source that can be accessed by multiple processes and machines.

Shared caching ensures that different application instances see the same view of cached data. An important benefit of the shared caching approach is the scalability it provides. 

Caching in distributed system poses it's own challange - In a situation where an application needs to modify data that's held in the cache, we might need to ensure that updates made by one instance of the application do not overwrite the changes made by another instance.

For this purpose, redis provides watch function which allows us to marks the given keys to be watched for conditional execution of a transaction. Ref: https://redis.io/commands/watch

Every time we will update (add or delete a new stream) we will add a watch so that we can ensure no one else is stepping on our toe's.

## Code structure

### routes/index.js
Expose the required end points for this service.

1. GET /user/stream
To get how many streams are active for a particular user, API returns a warning if user's quota is exhausted
example call: http://localhost:3000/user/stream?userId=test124

2. GET /user/stream
To add a new active stream to the user, API returns an error if user's quota is exhausted
example call: http://localhost:3000/user/stream
with body 
```javascript
  {
      "userId": "test124"
  }
  ```

3. DELETE /user/stream

To remove an active stream to the user, API returns an error if user's active stream is already 0 
example call: http://localhost:3000/user/stream
with body 

```javascript
  {
      "userId": "test124"
  }
  ```

### controllers/stream.js

This knows how to communicate to redis client and what message to be returned to the user.


### storage/redisCache.js

This is a chaching wrapper around redis.

## Tests

There are 3 main tests

1. index.spec.js and stream.spec.js representing unit tests for index and stream respectively. Tests are written using
jest testing library. Please note - both redisCache and stream are mocked out using jest and their mock implementation is under __mocks__ folder.

2. Postman scripts also have few tests (API' testing from automation QA perspective (i.e Black box testing))

## Commands to run the app

1. Check out the code - install the required packages
```javascript 
node install
```

2. To run the app - It will start the server on 3000 port
```javascript 
node start.js
```
3. To run the tests 
```javascript 
npm test
```

## Test results

<p align="center">
  <img src="https://github.com/ashutoshchauhan13/concurrentStreams/blob/master/screen-shot/tests.png?raw=true">
</p>







