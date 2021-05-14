const fs = require('fs')
const stream = require('stream')

module.exports = function (app, verifyAccessToken) {
  app.get('/images/:file_name', verifyAccessToken, (req, res) => {
    const r = fs.createReadStream("images/" + req.params.file_name) // or any other way to get a readable stream
    const ps = new stream.PassThrough() // <---- this makes a trick with stream error handling
    stream.pipeline(
     r,
     ps, // <---- this makes a trick with stream error handling
     (err) => {
      if (err) {
        console.log(err) // No such file or any other kind of error
        return res.sendStatus(400);
      }
    })
    ps.pipe(res) // <---- this makes a trick with stream error handling
  });
}
