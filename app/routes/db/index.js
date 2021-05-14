const users_routes = require('./users_routes');
const cities_routes = require('./cities_routes');
const currency_routes = require('./currency_routes');
const messages_routes = require('./messages_routes');

module.exports = function (app, verifyAccessToken, client) {
  users_routes(app, verifyAccessToken, client);
  cities_routes(app, verifyAccessToken, client);
  currency_routes(app, verifyAccessToken, client);
  messages_routes(app, verifyAccessToken, client);
};
