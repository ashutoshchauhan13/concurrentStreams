const {
  increment,
  decrement,
  fetch,
  closeInstance
} = require("../storage/redisCache");

const {
  logger
} = require('../utils/logger');

const maxAllowedStreams = 3;

module.exports = {

  addActiveStream: (req, res) => {
    logger.info('addActiveStream')
    increment(req.body.userId, maxAllowedStreams)
      .then(function(results) {
        return res.status(200).json({
          'message': 'Stream added successfully',
          'activeStreams': results[0]
        });
      })
      .catch(function(error) {
        logger.error(error);
        return res.status(403).json({
          'message': error === 'Operation rejected by redis' ? 'Please try again' : error
        });
      });
  },

  removeActiveStream: (req, res) => {
    logger.info('removeActiveStream')
    decrement(req.body.userId)
      .then(function(results) {
        return res.status(200).json({
          'message': 'Stream removed successfully',
          'activeStreams': results[0]
        });
      })
      .catch(function(error) {
        logger.error(error);
        return res.status(403).json({
          'message': error === 'Operation rejected by redis' ? 'Please try again' : error
        });
      });
  },

  checkActiveStreams: (req, res) => {
    logger.info('addActiveStream')
    fetch(req.query.userId, maxAllowedStreams)
      .then(function(result) {
        return res.status(200).json({
          'message': 'You have ' + result + ' active streams available',
          'activeStreams': result
        });
      })
      .catch(function(error) {
        logger.error(error);
        return res.status(403).json({
          'message': error
        });
      });

  }
}
