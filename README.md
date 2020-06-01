# Concurrent Streams (using redis cache)
Node.js app to provide an account of the active stream for a streaming service

## A Node.js service that exposes an API which can be consumed from any client.
This service checks how many video streams a given user is watching and prevent a user
from watching more than 3 video streams concurrently.

## Approach
Since this service (microservice) can scale into multiple services - It's important that we keep the caching out of the control of the local machine (even if a service dies - caching remains intact). For this purpose, we have choosen Redis cache.
Hence using a shared cache, serving as a common source that can be accessed by multiple processes and machines.

Shared caching ensures that different application instances see the same view of cached data. An important benefit of the shared caching approach is the scalability it provides. 

Caching in distributed system poses its own challenge - In a situation where an application needs to modify data that are held in the cache, we might need to ensure that updates made by one instance of the application do not overwrite the changes made by another instance.

For this purpose, Redis provides watch function which allows us to marks the given keys to be watched for conditional execution of a transaction. Ref: https://redis.io/commands/watch

Every time we will update (add or delete a new stream) we will add a watch so that we can ensure no one else is stepping on our toe's.

## Code structure

### routes/index.js
Expose the required end-points for this service.

1. GET /user/stream
To get how many streams are active for a particular user, API returns a warning if a user's quota is exhausted
example call: http://localhost:3000/user/stream?userId=test124

2. GET /user/stream
To add a new active stream to the user, API returns an error if a user's quota is exhausted
example call: http://localhost:3000/user/stream
with body 

```javascript
  {
      "userId": "test124"
  }
```

3. DELETE /user/stream

To remove an active stream to the user, API returns an error if a user's active stream is already 0 
example call: http://localhost:3000/user/stream
with body 

```javascript
  {
      "userId": "test124"
  }
```

### controllers/stream.js

This knows how to communicate to Redis client and what message to be returned to the user.


### storage/redisCache.js

This is a caching wrapper around Redis.

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
2. This solutions uses redis - please start the redis server locally (It expects redis to be started on default port)

3. To run the app - It will start the server on 3000 port

```javascript 
  node start.js
```
4. To run the tests 

```javascript 
  npm test
```

## Test results

<p align="center">
  <img src="https://github.com/ashutoshchauhan13/concurrentStreams/blob/master/screen-shot/tests.png?raw=true">
</p>

## Pushing it to the production environment

Following steps would be required for it to be production grade ready:

1. Configuring PORT and Redis configuration separately for DEV and PROD environment
2. Adding further tests and code review
3. Adding concurrency specific tests where the same user is updating the value from different devices at the same time
4. Adding security around end -points
5. Cloud deployment configuration



