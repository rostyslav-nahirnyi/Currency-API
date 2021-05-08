const users_routes = require('./users_routes');
const cities_routes = require('./cities_routes');
const currency_routes = require('./currency_routes');
const messages_routes = require('./messages_routes');

module.exports = function (app, client) {
  users_routes(app, client);
  cities_routes(app, client);
  currency_routes(app, client);
  messages_routes(app, client);
};
