const express        = require('express');
//const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
const app            = express();
const router = express.Router();
const path = require('path');
const port = 8000;
//app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());
require('./app/routes')(app, {});
console.log(path.join(__dirname+'/index.html'));
router.get('/',function(req,res){
	console.log(path.join(__dirname+'/index.html'));
  res.sendFile(path.join(__dirname+'/index.html'));
  //__dirname : It will resolve to your project folder.
});

router.get('/login',function(req,res){
  res.sendFile(path.join(__dirname+'/login.html'));
});
router.get('/testAPI',function(req,res){
  res.sendFile(path.join(__dirname+'/API.html'));
});
app.use('/', router);
app.listen(port, () => {
  console.log('We are live on ' + port);
});



//add the router
//app.use('/', router);
//app.listen(8001);