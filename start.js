const app = require('./server.js')
const { logger } = require('./utils/logger');

app.listen(3000, function () {
    logger.error('App is listening on port 3000!');
});
