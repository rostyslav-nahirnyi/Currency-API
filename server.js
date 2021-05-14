const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 80;

const mongoClient = new MongoClient(process.env.DB_URL, { useUnifiedTopology: true });

function verifyAccessToken(req, res, next) {
  if(!req.headers['authorization']) {
    res.statusCode = 401;
    return res.send({"description": "Please specify access token!"});
  }
  const token = req.headers['authorization'].split(' ')[1];
  if (token !== process.env.ACCESS_TOKEN) {
    res.statusCode = 401;
    return res.send({"description": "Invalid access token!"});
  } else {
    next();
  }
}



mongoClient.connect((err, client) => {
  //if mongodb error
  if (err) return node.error("MongoDBError: " + err);

  //routes that using db
  require('./app/routes/db') (app, verifyAccessToken, client);
});

//minfin routes
require('./app/routes/minfin') (app, verifyAccessToken);

//images routes
require('./app/routes/images') (app, verifyAccessToken);



app.listen(PORT, () => {
  console.log('PORT: ' + PORT);
});
