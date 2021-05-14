const axios = require('axios');
const Jimp = require('jimp');



//functionі for printing text on image
function printСenteredTextOnImage(image, font, text, x, y) {
  return image.print(font, 0, y, {
    text: text,
    alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER
  }, image.bitmap.width, image.bitmap.height);
}

function printTextOnImage(image, font, text, x, y) {
  return image.print(font, x, y, text, image.bitmap.width, image.bitmap.height);
}

//for printing lines
function iterator(x, y, offset) {
    this.bitmap.data.writeUInt32BE(0x00000088, offset, true);
}



module.exports = function (app, verifyAccessToken) {
  app.get("/exchangers", verifyAccessToken, (req, res) => {
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



        //create new image
        var image = new Jimp(1600, 1160, 'white', (err, image) => {
          if (err) throw err
        });

        if (!exchangers.length) {
          //print text
          return Jimp.loadFont('fonts/Lregular.fnt')
            .then(font => {
              printTextOnImage(image, font, "Не знайдено жодних обмінників", 355, 548);
            })
            .then(() => {
              //save image
              let file_name = req.query["action"] + "_" + req.query["city_id"] + "_" + req.query["currency"] + "." + image.getExtension();
              image.write("images/" + file_name);

              res.statusCode = 200;
              return res.send({ "file_name": file_name });
            });
        }



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



        //print text
        return Jimp.loadFont('fonts/Lregular.fnt')
          .then(font => {
            let x = 600;
            let y = 0;

            //print top border
            image.scan(0, 0, 1600, 2, iterator);

            exchangers.forEach(element => {
              y += 10;

              //print price
              printСenteredTextOnImage(image, font, element.data["rate_" + req.query["action"]] + " " + element.data.currency, x, y);
              y += 94;

              //print amount
              printСenteredTextOnImage(image, font, element.data.min_count + " - " + element.data.max_count, x, y);
              y += 94;

              //print phone
              printСenteredTextOnImage(image, font, element.data.branch_id.phone, x, y);
              y += 94;

              //print address
              printСenteredTextOnImage(image, font, element.data.branch_id.address, x, y);
              y += 94;



              //print borders
              image.scan(0, (y-386), 2, 386, iterator);
              image.scan(0, y, 1600, 2, iterator);
              image.scan(1598, (y-386), 2, 386, iterator);
            });
          })
          .then(() => {
            //save image
            let file_name = req.query["action"] + "_" + req.query["city_id"] + "_" + req.query["currency"] + "." + image.getExtension();
            image.write("images/" + file_name);

            res.statusCode = 200;
            return res.send({ "file_name": file_name });
          });


      })
      .catch((error) => {
        res.statusCode = 500;
        res.send({ "AxiosError": error });
      });
  });

  app.get("/exchangers/interbank", verifyAccessToken, (req, res) => {

    //get info
    axios
      .get("https://minfin.com.ua/data/currency/ib/usd.ib.today.json")
      .then((minfin_usd_res) => {

        axios
          .get("https://minfin.com.ua/data/currency/ib/eur.ib.today.json")
          .then((minfin_eur_res) => {

            axios
              .get("https://minfin.com.ua/data/currency/ib/rub.ib.today.json")
              .then((minfin_rub_res) => {
                let rows_text = ["КУРС ДО ГРИВНІ", "Покупка", "Продажа"];
                let cols = {
                  "ДОЛЛАР": minfin_usd_res.data[minfin_usd_res.data.length-1],
                  "ЄВРО": minfin_eur_res.data[minfin_eur_res.data.length-1],
                  "РУБЛЬ": minfin_rub_res.data[minfin_rub_res.data.length-1]
                };

                //create new image
                var image = new Jimp(1770, 450, 'white', (err, image) => {
                  if (err) throw err
                });

                //print text
                Jimp.loadFont('fonts/Lregular.fnt')
                  .then(font => {
                    let x = 30;
                    let y = 43;

                    //print borders
                    image.scan(0, 0, 1770, 2, iterator);
                    image.scan(1768, 0, 2, 450, iterator);
                    image.scan(0, 448, 1770, 2, iterator);
                    image.scan(0, 0, 2, 450, iterator);

                    //print text for rows
                    rows_text.forEach((text) => {
                      printTextOnImage(image, font, text, x, y);
                      y += 107;
                      if (y != 450) {
                        image.scan(0, y, 1770, 2, iterator);
                        y += 43;
                      }
                    });

                    x = 690;

                    for (key in cols) {

                      //print rate
                      printTextOnImage(image, font, key, (x + ((300 - Jimp.measureText(font, key)) / 2)), 43);
                      printTextOnImage(image, font, cols[key].bid, (x + ((300 - Jimp.measureText(font, key)) / 2)), 193);
                      printTextOnImage(image, font, cols[key].ask, (x + ((300 - Jimp.measureText(font, key)) / 2)), 343);

                      x += 360

                    }
                  })
                  .then(() => {
                    //save image
                    let file_name = "mb." + image.getExtension();
                    image.write("images/" + file_name);

                    res.statusCode = 200;
                    return res.send({ "file_name": file_name});
                  });
              })
              .catch((error) => {
                res.statusCode = 500;
                res.send({ "AxiosError (get rub)": error });
              });

          })
          .catch((error) => {
            res.statusCode = 500;
            res.send({ "AxiosError (get eur)": error });
          });

      })
      .catch((error) => {
        res.statusCode = 500;
        res.send({ "AxiosError (get usd)": error });
      });
  });
};
