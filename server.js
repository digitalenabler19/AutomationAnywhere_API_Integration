const express        = require('express');
//const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
const app            = express();
//const app            = express.createServer();
const router = express.Router();
const path = require('path');
const port = 8000;
const https = require('https');
const fs = require('fs');
/*var http = require('http').Server(app);
var io = require('socket.io')(http);*/
/*var http = require('http').Server(app);
var io = require('socket.io')(http);*/

const session = require('express-session');

/*var nameSchema = new mongoose.Schema({
 name: String,
 message: String
});
const User = mongoose.model("UserMod", nameSchema);*/

//var Message = mongoose.model('Message',{ name:String, message : String});

//var Message = { "name" : "String", "message" : "String"}
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
//var io;
/*var server    = app.listen(port, () => {
  console.log('We are live on ' + port);

});*/
//var server    = app.listen(port);
//var io=require('socket.io').listen(server);
  //var io = require("socket.io").listen(app);
// app.listen(3033);

var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(port);
/*http.listen(port, function(){
  console.log('listening on *:' + port);
});*/


io.on('connection', function(socket){
  socket.on('message',function(data){
  console.log(socket);
console.log("msg recd");
console.log(data);
   io.emit('message', "recd1 message1");
 socket.emit('message', "recd message");
 });
  socket.on('chat message',function(data){
   io.emit('chat message', data);
   //-----------------------------------------------------------------------------
    //SPLIT MESSAGE TO RETRIEVE THE PLACE HOLDER VALUE
 var inputVariable="No input variable recieved"
 var valuesFromChatStart=data.split("<");
 if(valuesFromChatStart.length>1){
 var valuesFromChatEnd=valuesFromChatStart[1].split(">");
 console.log(valuesFromChatStart[1]);
 console.log(valuesFromChatEnd[0]);
 inputVariable=valuesFromChatEnd[0];
}
    var botVariables={"Policyholder_Name": {
      "string": inputVariable
    }};
//console.log("inputVariable"+inputVariable);
//console.log(botVariables);
   //----------------------------------------------------------------------------
   //var status=require('./app/lib/controlRoomAPIs').deployBot("9",["2"]);

   if(inputVariable!="No input variable recieved"){
   var status=require('./app/lib/controlRoomAPIs').deployBot( global.searchedBotID,[ global.searchedDeviceID],botVariables,io);
  
  
   console.log(status);
   io.emit('chat message', status);
 }
 });
})

 //app = express.createServer(),
  
/*http.listen(port, function(){
  console.log('listening on *:' + port);
});*/

//module.exports.io=io;
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
app.post('/srchPolicyDetails', (req, res) => {
    
    console.log("srchPolicyDetails");

    console.log(req.body.outputVariables);
    console.log(req.body.outputVariables.PolicyDetails.list);
    io.emit('chat message', req.body.outputVariables.PolicyDetails.list[0]);
     io.emit('chat message', req.body.outputVariables.PolicyDetails.list[1]);
      io.emit('chat message', req.body.outputVariables.PolicyDetails.list[2]);
       io.emit('chat message', req.body.outputVariables.PolicyDetails.list[3]);
        io.emit('chat message', req.body.outputVariables.PolicyDetails.list[4]);
         io.emit('chat message', req.body.outputVariables.PolicyDetails.list[5]);
   res.send({"status":"success"});
   //return true;
  });

app.get('/filestr', (req, res) => {

	console.log(__dirname);

	 var filePath = path.join(__dirname, 'JT.pdf');

    //var stat = fileSystem.statSync(filePath);

    res.writeHead(200, {
        //'Content-Type': 'audio/mpeg',
        //'Content-Length': stat.size
        /*   "Content-Type": "application/octet-stream",
          "Content-Disposition": "attachment; filename=ArchitectureOverview.pptx" */
        "Content-Type": "multipart/form-data;boundary=boundary",
		"Content-Disposition": "form-data;name=field1"
    });

   // var readStream = fileSystem.createReadStream(filePath);
    // We replaced all the event handlers with a simple call to readStream.pipe()
    //readStream.pipe(res);
      fs.createReadStream(filePath).pipe(res);
});
module.exports.io=io;