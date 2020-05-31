
var express = require('express');
var router = express.Router();
var stream = require('../controllers/stream');

router.get('/user/stream', function (req, res) {
  return stream.addActiveStream(req,res);
});

router.post('/user/stream', function (req, res) {
  return stream.removeActiveStream(req,res);
});

router.delete('/user/stream', function (req, res) {
  return stream.checkActiveStreams(req,res);
});

module.exports = router
