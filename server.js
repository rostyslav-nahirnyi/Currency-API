const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');

const db = require('./config/db');
const PORT = 8000;

const app = express();
app.use(bodyParser.json());

const mongoClient = new MongoClient(db.url, { useUnifiedTopology: true });



mongoClient.connect((err, client) => {
  //if mongodb error
  if (err) return node.error("MongoDBError: " + err);

  //routes that using db
  require('./app/routes/db') (app, client);
});

//minfin routes
require('./app/routes/minfin') (app);



app.listen(PORT, () => {
  console.log('PORT: ' + PORT);
});
