const express        = require('express');
//const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
const app            = express();
const router = express.Router();
const path = require('path');
const port = 8000;
const https = require('https');
const fs = require('fs');
  const session = require('express-session');
 /* var http = require('http').Server(app);
var io = require('socket.io')(http);*/

//----------------------------------------------------------

/*app.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true
}));
 
// Authentication and Authorization Middleware
var auth = function(req, res, next) {
  if (req.session && req.session.user === "amy" && req.session.admin)
    return next();
  else
    return res.sendStatus(401);
};
 
// Login endpoint
app.get('/login', function (req, res) {
	console.log(req.query);
  if (!req.query.username || !req.query.password) {
    res.send('login failed');    
  } else if(req.query.username === "amy" || req.query.password === "amyspassword") {
    req.session.user = "amy";
    req.session.admin = true;
    res.send("login success!");
  }
});

// Get content endpoint
app.get('/content', auth, function (req, res) {
    res.send("You can only see this after you've logged in.");
});*/

//---------------------------------------------------------
//app.use(bodyParser.urlencoded({ extended: true }));

// environment variables
process.env.NODE_ENV = 'development';

// uncomment below line to test this code against staging environment
// process.env.NODE_ENV = 'staging';

// config variables
const config = require('./config/config.js');


app.use(bodyParser.json());
//app.use(express.static('public'));
app.use("/public", express.static(__dirname + "/public"));
require('./app/routes')(app, {});
console.log(path.join(__dirname+'/index.html'));
router.get('/',function(req,res){
	console.log(path.join(__dirname+'/index.html'));
  res.sendFile(path.join(__dirname+'/index.html'));
  //__dirname : It will resolve to your project folder.
});

router.get('/login',function(req,res){
	console.log(global.gConfig);
  res.sendFile(path.join(__dirname+'/login.html'));
});
router.get('/htmlcontrols',function(req,res){
  res.sendFile(path.join(__dirname+'/view/divtable.html'));
});
router.get('/waitforwindow',function(req,res){
  res.sendFile(path.join(__dirname+'/view/waitforwindow.html'));
});
router.get('/metabot',function(req,res){
  res.sendFile(path.join(__dirname+'/view/metabot.html'));
});
router.get('/testAPI',function(req,res){
  res.sendFile(path.join(__dirname+'/API.html'));
});
router.get('/claimAI',function(req,res){
  res.sendFile(path.join(__dirname+'/view/Conversational-AI.html'));
});
router.get('/socketchat',function(req,res){
  res.sendFile(path.join(__dirname+'/view/socketchat.html'));
});
app.use('/', router);
app.listen(port, () => {
  console.log('We are live on ' + port);
});


/*http.listen(port, function(){
  console.log('listening on *:' + port);
});
*//*https.createServer({
    key: fs.readFileSync('./certificates/privateKey-acme.key'),
    cert: fs.readFileSync('./certificates/certificate-acme.crt'),
    passphrase: 'YOUR PASSPHRASE HERE'
}, app)
.listen(port);*/


//add the router
//app.use('/', router);
//app.listen(8001);