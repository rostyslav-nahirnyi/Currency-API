const images_routes = require('./images_routes');

module.exports = function (app, verifyAccessToken) {
  images_routes(app, verifyAccessToken);
};
