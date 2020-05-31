jest.mock('../storage/redisCache');
const redisCache  = require('../storage/redisCache');
const stream = require('../controllers/stream');

const mockRequest = () => {
  const req = {};
  req.body = jest.fn().mockReturnValue(req);
  req.body.userId = "test123";
  return req;
};

const mockQueryRequest = () => {
  const req = {};
  req.query = jest.fn().mockReturnValue(req);
  req.query.userId = "test123";
  return req;
};

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('stream', () => {
  test('adding a stream should call increment', async () => {
    const req = mockRequest();
    const res = mockResponse();
    await stream.addActiveStream(req, res)
    expect(res.status).toHaveBeenCalledWith(200);
     expect(res.json).toHaveBeenCalledWith({
       'message': 'Stream added successfull',
       'activeStreams': 1
     });
  });

  test('removing a stream should call decrement', async () => {
    const req = mockRequest();
    const res = mockResponse();
    await stream.removeActiveStream(req, res)
    expect(res.status).toHaveBeenCalledWith(200);
     expect(res.json).toHaveBeenCalledWith({
       'message': 'Stream removed successfully',
       'activeStreams': 0
     });
  });

  test('removing a stream below 0 should give 403 response', async () => {
    const req = mockRequest();
    const res = mockResponse();
    await stream.removeActiveStream(req, res)
    await stream.removeActiveStream(req, res)
    expect(res.status).toHaveBeenCalledWith(403);
     expect(res.json).toHaveBeenCalledWith({
       'message':'Operation failed! - You have 0 stream active'
     });
  });

  test('checking a stream should return 200', async () => {
    const req = mockQueryRequest()
    const res = mockResponse()
    await stream.checkActiveStreams(req, res)
    expect(res.status).toHaveBeenCalledWith(200);
     expect(res.json).toHaveBeenCalledWith({
       'message': 'You have 0 active streams available',
       'activeStreams': 0
     });
  });

  // test('checking a stream after the limit should return 403', async () => {
  //   const req = mockQueryRequest()
  //   const res = mockResponse()
  //   await stream.addActiveStream(mockRequest(), res)
  //   await stream.addActiveStream(mockRequest(), res)
  //   await stream.addActiveStream(mockRequest(), res)
  //   await stream.addActiveStream(mockRequest(), res)
  //   await stream.addActiveStream(mockRequest(), res)
  //   await stream.checkActiveStreams(req, res)
  //   expect(res.status).toHaveBeenCalledWith(403);
  //    expect(res.json).toHaveBeenCalledWith({
  //      'message':'Operation failed! - You have 0 stream active'
  //    });
  // });
});
