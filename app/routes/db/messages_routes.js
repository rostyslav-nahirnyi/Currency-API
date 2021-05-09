module.exports = function (app, client) {
  app.post('/messages', (req, res) => {
    //required data
    if (!Object.keys(req.body).length) {
        res.statusCode = 400;
        return res.send({ "error": "You didn't provide any data." });
    }
    if (!req.body.hasOwnProperty("messenger_type")) {
        res.statusCode = 400;
        return res.send({ "error": "You didn't provide messenger_type." });
    }
    if (!req.body.hasOwnProperty("templateId")) {
        res.statusCode = 400;
        return res.send({ "error": "You didn't provide templateId." });
    }
    if (!req.body.hasOwnProperty("json")) {
        res.statusCode = 400;
        return res.send({ "error": "You didn't provide json." });
    }

    const db = client.db("messages_db");
    const messenger_type = req.body["messenger_type"];

    //remove property
    delete req.body["messenger_type"];

    //inserting data
    db.collection(messenger_type + '-messages').insertOne(req.body, (err, item) => {
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

  app.get('/messages', (req, res) => {
    //required data
    if (!Object.keys(req.query).length) {
        res.statusCode = 400;
        return res.send({ "error": "You didn't provide any data for identifying object." });
    }
    if (!req.query.hasOwnProperty("messenger_type")) {
        res.statusCode = 400;
        return res.send({ "error": "You didn't provide messenger_type for identifying object." });
    }
    if (!req.query.hasOwnProperty("templateId")) {
        res.statusCode = 400;
        return res.send({ "error": "You didn't provide templateId for identifying object." });
    }

    const db = client.db("messages_db");
    const messenger_type = req.query["messenger_type"];

    //remove property
    delete req.query["messenger_type"];

    //getting data
    db.collection(messenger_type + '-messages').findOne(req.query, (err, item) => {
      //if mongodb error
      if (err) {
        res.statusCode = 500;
        return res.send({ "MongoDBError": err });
      }
      //if item is empty
      if (!item) {
        res.statusCode = 404;
        return res.send({ "error": "Message not found." });
      }

      //send response
      res.statusCode = 200;
      return res.send(item);
    });
  });

  app.delete('/messages', (req, res) => {
    //required data
    if (!Object.keys(req.query).length) {
        res.statusCode = 400;
        return res.send({ "error": "You didn't provide any data for identifying object." });
    }
    if (!req.query.hasOwnProperty("messenger_type")) {
        res.statusCode = 400;
        return res.send({ "error": "You didn't provide messenger_type for identifying object." });
    }
    if (!req.query.hasOwnProperty("templateId")) {
        res.statusCode = 400;
        return res.send({ "error": "You didn't provide templateId for identifying object." });
    }

    const db = client.db("messages_db");
    const messenger_type = req.query["messenger_type"];

    //remove property
    delete req.query["messenger_type"];

    //removing data
    db.collection(messenger_type + '-messages').removeOne(req.query, (err, item) => {
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

  app.put('/messages', (req, res) => {
    //required data
    if (!Object.keys(req.query).length) {
        res.statusCode = 400;
        return res.send({ "error": "You didn't provide any data for identifying object." });
    }
    if (!req.query.hasOwnProperty("messenger_type")) {
        res.statusCode = 400;
        return res.send({ "error": "You didn't provide messenger_type for identifying object." });
    }
    if (!req.query.hasOwnProperty("templateId")) {
        res.statusCode = 400;
        return res.send({ "error": "You didn't provide templateId for identifying object." });
    }
    if (!Object.keys(req.body).length) {
        res.statusCode = 400;
        return res.send({ "error": "You didn't provide any data to update." });
    }

    const db = client.db("messages_db");
    const messenger_type = req.query["messenger_type"];

    //remove property
    delete req.query["messenger_type"];

    //updating data
    db.collection(messenger_type + '-messages').updateOne(req.query, { "$set" : req.body }, (err, db_response) => {
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
