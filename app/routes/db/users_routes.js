module.exports = function (app, verifyAccessToken, client) {
  app.post('/users', verifyAccessToken, (req, res) => {
    //required data
    if (!Object.keys(req.body).length) {
        res.statusCode = 400;
        return res.send({ "error": "You didn't provide any data." });
    }
    if (!req.body.hasOwnProperty("messenger_type")) {
        res.statusCode = 400;
        return res.send({ "error": "You didn't provide messenger_type." });
    }
    if (!req.body.hasOwnProperty("user_id")) {
        res.statusCode = 400;
        return res.send({ "error": "You didn't provide user_id." });
    }
    if (!req.body.hasOwnProperty("language")) {
        res.statusCode = 400;
        return res.send({ "error": "You didn't provide language." });
    }

    const db = client.db("users_db");

    //getting data
    db.collection('users').findOne({ user_id: req.body.user_id, messenger_type: req.body.messenger_type }, (err, item) => {
      //if mongodb error
      if (err) {
        res.statusCode = 500;
        return res.send({ "MongoDBError": err });
      }

      //if item is empty
      if (!item) {
        //inserting data
        return db.collection('users').insertOne(req.body, (err, inserted_item) => {
          //if mongodb error
          if (err) {
            res.statusCode = 500;
            return res.send({ "MongoDBError": err });
          }

          //send response
          res.statusCode = 200;
          return res.send(inserted_item.ops[0]);
        });
      }

      //send response
      res.statusCode = 200;
      return res.send(item);
    });
  });

  app.get('/users', verifyAccessToken, (req, res) => {
    //required data
    if (!Object.keys(req.query).length) {
        res.statusCode = 400;
        return res.send({ "error": "You didn't provide any data for identifying object." });
    }

    const db = client.db("users_db");

    //getting data
    db.collection('users').findOne(req.query, (err, item) => {
      //if mongodb error
      if (err) {
        res.statusCode = 500;
        return res.send({ "MongoDBError": err });
      }
      //if item is empty
      if (!item) {
        res.statusCode = 404;
        return res.send({ "error": "User not found." });
      }

      //send response
      res.statusCode = 200;
      return res.send(item);
    });
  });

  app.delete('/users', verifyAccessToken, (req, res) => {
    //required data
    if (!Object.keys(req.query).length) {
        res.statusCode = 400;
        return res.send({ "error": "You didn't provide any data for identifying object." });
    }

    const db = client.db("users_db");

    //removing data
    db.collection('users').removeOne(req.query, (err, item) => {
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

  app.put('/users', verifyAccessToken, (req, res) => {
    //required data
    if (!Object.keys(req.query).length) {
        res.statusCode = 400;
        return res.send({ "error": "You didn't provide any data for identifying object." });
    }
    if (!Object.keys(req.body).length) {
        res.statusCode = 400;
        return res.send({ "error": "You didn't provide any data to update." });
    }

    const db = client.db("users_db");

    console.log(req.query.user_id);

    //updating data
    db.collection('users').updateOne(req.query, { "$set" : req.body }, (err, db_response) => {
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
