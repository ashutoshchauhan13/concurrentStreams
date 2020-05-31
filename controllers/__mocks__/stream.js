module.exports = {

  addActiveStream: (req, res) => {
    return res.status(200).json({
      'message': 'Stream added successfull',
      'activeStreams': 0
    });
  },

  removeActiveStream: (req, res) => {
    return res.status(200).json({
      'message': 'Stream removed successfully',
      'activeStreams': 0
    });
  },

  checkActiveStreams: (req, res) => {
    return res.status(200).json({
      'message': 'You have 0 active streams available',
      'activeStreams': 0
    });
  }
}
