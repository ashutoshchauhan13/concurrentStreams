const maxAllowedStreams = 3;

module.exports = {

  addActiveStream: (req, res) => {
    return res.status(200).json({
      'message': 'You have 0 active streams available',
      'activeStreams': 0
    });
  },

  removeActiveStream: (req, res) => {
    res.status(200).json({
      'message': 'Stream added successfull',
      'activeStreams': 0
    });
  },

  checkActiveStreams: (req, res) => {
    res.status(200).json({
      'message': 'Stream deleted successfull',
      'activeStreams': 0
    });

  }
}
