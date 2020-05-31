const {
  increment,
  decrement,
  fetch,
  closeInstance
} = require("../storage/redisCache");

const maxAllowedStreams = 3;

module.exports = {

  addActiveStream: (req, res) => {
    increment(req.body.userId, maxAllowedStreams)
      .then(function(results) {
        return res.status(200).json({
          'message': 'Stream added successfull',
          'activeStreams': results[0]
        });
      })
      .catch(function(error) {

        return res.status(403).json({
          'message': error === 'Operation rejected by redis' ? 'Please try again' : error
        });
      });
  },

  removeActiveStream: (req, res) => {
    decrement(req.body.userId)
      .then(function(results) {
        return res.status(200).json({
          'message': 'Stream removed successfully',
          'activeStreams': results[0]
        });
      })
      .catch(function(error) {
        return res.status(403).json({
          'message': error === 'Operation rejected by redis' ? 'Please try again' : error
        });
      });
  },

  checkActiveStreams: (req, res) => {
    console.log('req.query.userId=' + req.query.userId)
    fetch(req.query.userId, maxAllowedStreams)
      .then(function(result) {
        return res.status(200).json({
          'message': 'You have ' + result + ' active streams available',
          'activeStreams': result
        });
      })
      .catch(function(error) {
        return res.status(403).json({
          'message': error
        });
      });

  }
}
