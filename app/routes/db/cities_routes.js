module.exports = function (app, verifyAccessToken, client) {
  app.post('/cities', verifyAccessToken, (req, res) => {
    //required data
    if (!Object.keys(req.body).length) {
        res.statusCode = 400;
        return res.send({ "error": "You didn't provide any data." });
    }
    if (!req.body.hasOwnProperty("city_id")) {
        res.statusCode = 400;
        return res.send({ "error": "You didn't provide city_id." });
    }
    if (!req.body.hasOwnProperty("city_name")) {
        res.statusCode = 400;
        return res.send({ "error": "You didn't provide city_name." });
    }

    const db = client.db("minfin_properties_db");

    //inserting data
    db.collection('cities').insertOne(req.body, (err, item) => {
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

  app.get('/cities', verifyAccessToken, (req, res) => {
    //required data
    if (!Object.keys(req.query).length) {
        res.statusCode = 400;
        return res.send({ "error": "You didn't provide any data for identifying object." })
    }

    const db = client.db("minfin_properties_db");

    //getting data
    db.collection('cities').findOne(req.query, (err, item) => {
      //if mongodb error
      if (err) {
        res.statusCode = 500;
        return res.send({ "MongoDBError": err });
      }
      //if item is empty
      if (!item) {
        res.statusCode = 404;
        return res.send({ "error": "City not found." });
      }

      //send response
      res.statusCode = 200;
      return res.send(item);
    });
  });

  app.get('/cities/all', verifyAccessToken, (req, res) => {
    const db = client.db("minfin_properties_db");

    //getting data
    db.collection('cities').find({}).toArray((err, items) => {
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

  app.delete('/cities', verifyAccessToken, (req, res) => {
    //required data
    if (!Object.keys(req.query).length) {
        res.statusCode = 400;
        return res.send({ "error": "You didn't provide any data for identifying object." });
    }

    const db = client.db("minfin_properties_db");

    //removing data
    db.collection('cities').removeOne(req.query, (err, item) => {
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

  app.put('/cities', verifyAccessToken, (req, res) => {
    //required data
    if (!Object.keys(req.query).length) {
        res.statusCode = 400;
        return res.send({ "error": "You didn't provide any data for identifying object." });
    }
    if (!Object.keys(req.body).length) {
        res.statusCode = 400;
        return res.send({ "error": "You didn't provide any data to update." })
    }

    const db = client.db("minfin_properties_db");

    //updating data
    db.collection('cities').updateOne(req.query, { "$set" : req.body }, (err, db_response) => {
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
