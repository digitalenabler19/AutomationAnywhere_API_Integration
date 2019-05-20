module.exports = function(app, db) {
  app.post('/notes', (req, res) => {
    // You'll create your note here.
      console.log(req.body);
    //res.send("hello")
   res.send(req.body.title);
  });
};