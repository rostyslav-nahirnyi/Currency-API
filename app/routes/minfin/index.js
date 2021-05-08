const exchangers_routes = require('./exchangers_routes');

module.exports = function (app) {
  exchangers_routes(app);
};
