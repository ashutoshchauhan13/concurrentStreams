
var express = require('express');
var router = express.Router();

router.get('/user/stream', function (req, res) {
  return res.status(200).json({
    'message': 'You have 0 active streams available',
    'activeStreams': 0
  });
});

router.post('/user/stream', function (req, res) {
  res.status(200).json({
    'message': 'Stream added successfull',
    'activeStreams': 0
  });
});

router.delete('/user/stream', function (req, res) {
  res.status(200).json({
    'message': 'Stream deleted successfull',
    'activeStreams': 0
  });
});

module.exports = router
