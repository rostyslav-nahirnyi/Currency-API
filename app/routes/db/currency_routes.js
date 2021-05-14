module.exports = function (app, verifyAccessToken, client) {
  app.post('/currency', verifyAccessToken, (req, res) => {
    //required data
    if (!Object.keys(req.body).length) {
        res.statusCode = 400;
        return res.send({ "error": "You didn't provide any data." });
    }
    if (!req.body.hasOwnProperty("currency_code")) {
        res.statusCode = 400;
        return res.send({ "error": "You didn't provide currency_code." });
    }
    if (!req.body.hasOwnProperty("currency_name")) {
        res.statusCode = 400;
        return res.send({ "error": "You didn't provide currency_name." });
    }

    const db = client.db("minfin_properties_db");

    //inserting data
    db.collection('currency').insertOne(req.body, (err, item) => {
      //if mongodb error
      if (err) {
        res.statusCode = 500;
        return res.send({ "MongoDBError": err });
      }

      //send response
      res.statusCode = 200;
      return res.send(item.ops[0]);
    });
  });

  app.get('/currency', verifyAccessToken, (req, res) => {
    //required data
    if (!Object.keys(req.query).length) {
        res.statusCode = 400;
        return res.send({ "error": "You didn't provide any data for identifying object." });
    }

    const db = client.db("minfin_properties_db");

    //getting data
    db.collection('currency').findOne(req.query, (err, item) => {
      //if mongodb error
      if (err) {
        res.statusCode = 500;
        return res.send({ "MongoDBError": err });
      }
      //if item is empty
      if (!item) {
        res.statusCode = 404;
        return res.send({ "error": "Currency not found." });
      }

      //send response
      res.statusCode = 200;
      return res.send(item);
    });
  });

  app.get('/currency/all', verifyAccessToken, (req, res) => {
    const db = client.db("minfin_properties_db");

    //getting data
    db.collection('currency').find({}).toArray((err, items) => {
      //if mongodb error
      if (err) {
        res.statusCode = 500;
        return res.send({ "MongoDBError": err });
      }

      //send response
      res.statusCode = 200;
      return res.send(items);
    });
  });

  app.delete('/currency', verifyAccessToken, (req, res) => {
    //required data
    if (!Object.keys(req.query).length) {
        res.statusCode = 400;
        return res.send({ "error": "You didn't provide any data for identifying object." });
    }

    const db = client.db("minfin_properties_db");

    //removing data
    db.collection('currency').removeOne(req.query, (err, item) => {
      //if mongodb error
      if (err) {
        res.statusCode = 500;
        return res.send({ "MongoDBError": err });
      }

      //send response
      res.statusCode = 200;
      return res.send({ "success": true });
    });
  });

  app.put('/currency', verifyAccessToken, (req, res) => {
    //required data
    if (!Object.keys(req.query).length) {
        res.statusCode = 400;
        return res.send({ "error": "You didn't provide any data for identifying object." });
    }
    if (!Object.keys(req.body).length) {
        res.statusCode = 400;
        return res.send({ "error": "You didn't provide any data to update." });
    }

    const db = client.db("minfin_properties_db");

    //updating data
    db.collection('currency').updateOne(req.query, { "$set" : req.body }, (err, db_response) => {
      //if mongodb error
      if (err) {
        res.statusCode = 500;
        return res.send({ "MongoDBError": err });
      }

      //send response
      res.statusCode = 200;
      return res.send(db_response);
    });
  });
};
