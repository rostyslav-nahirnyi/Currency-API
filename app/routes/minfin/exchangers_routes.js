const axios = require('axios');
const Jimp = require('jimp');



//function for printing text on image
function printTextOnImage(image, font, text, x, y) {
  return image.print(font, 0, y, {
    text: text, alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER
  }, image.bitmap.width, image.bitmap.height);
}

//for printing lines
function iterator(x, y, offset) {
    this.bitmap.data.writeUInt32BE(0x00000088, offset, true);
}



module.exports = function (app) {
  app.get("/exchangers", (req, res) => {
    //required data
    if (!Object.keys(req.query).length) {
        res.statusCode = 400;
        return res.send({ "error": "You didn't provide any data." });
    }
    if (!req.query.hasOwnProperty("action")) {
        res.statusCode = 400;
        return res.send({ "error": "You didn't provide action." });
    }
    if (!req.query.hasOwnProperty("city_id")) {
        res.statusCode = 400;
        return res.send({ "error": "You didn't provide city_id." });
    }
    if (!req.query.hasOwnProperty("currency")) {
        res.statusCode = 400;
        return res.send({ "error": "You didn't provide currency." });
    }

    //get info
    axios
      .get(`https://va-backend.treeum.net/api/search/applications_data?action=${req.query["action"]}&city=${req.query["city_id"]}&currency=${req.query["currency"]}&size=1000&type=exchanger`)
      .then((minfin_res) => {
        let exchangers = minfin_res.data._items;

        //removing empty elements
        exchangers = exchangers.filter(element => {
          return element.hasOwnProperty("data") && element.data.hasOwnProperty(["rate_" + req.query["action"]]);
        });



        //replace elements in array
        function replaceElem(j) {
          let temp = exchangers[j];
          exchangers[j] = exchangers[j + 1];
          exchangers[j + 1] = temp;
        }

        //sorting to get the most profitable
        for (let i = 0; i < exchangers.length; i++) {
          for (let j = 0; j < exchangers.length; j++) {
            if (req.query["action"] == "sell") {
              if (exchangers[j + 1] && (exchangers[j].data.rate_sell > exchangers[j + 1].data.rate_sell)) {
                replaceElem(j);
              }
            } else {
              if (exchangers[j + 1] && (exchangers[j].data.rate_buy < exchangers[j + 1].data.rate_buy)) {
                replaceElem(j);
              }
            }
          }
        }



        //slice array
        exchangers = exchangers.slice(0, 3);



        //create new image
        var image = new Jimp(1600, 1160, 'white', (err, image) => {
          if (err) throw err
        });

        //print text
        Jimp.loadFont('fonts/Lregular.fnt')
          .then(font => {
            let x = 600;
            let y = 0;

            //print top border
            image.scan(0, 0, 1600, 2, iterator);

            exchangers.forEach(element => {
              y += 10;

              //print price
              printTextOnImage(image, font, element.data["rate_" + req.query["action"]] + " " + element.data.currency, x, y);
              y += 94;

              //print amount
              printTextOnImage(image, font, element.data.min_count + " - " + element.data.max_count, x, y);
              y += 94;

              //print phone
              printTextOnImage(image, font, element.data.branch_id.phone, x, y);
              y += 94;

              //print address
              printTextOnImage(image, font, element.data.branch_id.address, x, y);
              y += 94;



              //print borders
              image.scan(0, (y-386), 2, 386, iterator);
              image.scan(0, y, 1600, 2, iterator);
              image.scan(1598, (y-386), 2, 386, iterator);
            });
          })
          .then(() => {
            //sending response
            image.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
              res.statusCode = 200;

              res.setHeader("Content-Disposition", "attachment;filename=top.png");
              res.setHeader('Content-Type', 'image/png');
              res.setHeader('Content-Length', buffer.length);

              return res.send(buffer);
            });
          });

      })
      .catch((error) => {
        res.statusCode = 500;
        res.send({ "AxiosError": error });
      });
  });
};
