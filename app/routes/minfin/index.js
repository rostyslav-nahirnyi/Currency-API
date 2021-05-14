const exchangers_routes = require('./exchangers_routes');

module.exports = function (app, verifyAccessToken) {
  exchangers_routes(app, verifyAccessToken);
};
