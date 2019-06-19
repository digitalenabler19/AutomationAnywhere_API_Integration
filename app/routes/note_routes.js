module.exports = function(app, db) {
	var request = require('request');
	const session = require('express-session');
	app.use(session({secret: 'automationRPA#sample',saveUninitialized: true,resave: true}));
	var thisSession;//global variable



app.post('/countries', (req, res) => {
    // You'll create your note here.
      //console.log(req.body);
    //res.send("hello")
    console.log("inside countries");
   // console.log(req.body);
   console.log(req.body.outputVariables.State.string);
   res.send({"countries":"United States"});
  });


  app.post('/notes', (req, res) => {
    // You'll create your note here.
      //console.log(req.body);
    //res.send("hello")

    console.log(req.body);
   res.send(req.body.title);
  });



//DEPLOYMENT OF BOT
  app.post('/deployBot', (req, res) => {
  	
//app.get("https://aablr0195.aaspl-brd.com:8000/login?username=amy&password=amyspassword",function(){
  	//console.log("about to deploy bot");
  	//console.log(thisSession.token);

  	//var botDetails={"taskRelativePath":"My Tasks\\Sample_API.atmx","BotRunners":{"client":"localhost","user":"botrunner"}};
    //var botDetails={"taskRelativePath":req.body.botPath,"BotRunners":{"client":"localhost","user":"botrunner"}};
    //var botDetails={"taskRelativePath":req.body.botPath,"BotRunners":{"client":req.body.deployDevice,"user":req.body.delpoyUser}};
    

var botDetails={
  "fileId": "9",
  "deviceIds": [
    "2"
  ],
  "runWithRdp": false,
  "callbackInfo": {
   "url": "http://aablr0195.aaspl-brd.com:8000/countries",
   //"url":"https://httpbin.org/get",
  /*  "headers": {
      "X-Authorization":"mnb"
    }*/
  },
   "botVariables": {
    "Country": {
      "string": "India"
    }
   }
};

    console.log(botDetails);
   request(
   // 'http://aablr0195.aaspl-brd.com:81/v1/authentication',
   // { json: { Username:req.body.loginID, Password:req.body.password } },
    {headers: {
      //'Content-Length': contentLength,
      'Content-Type': 'application/json',
      'X-Authorization':thisSession.token
    },
   // url: global.gConfig.controlRoom_URL+'/v1/schedule/automations/deploy',
    url: global.gConfig.controlRoom_URL+'/v2/automations/deploy',
    body: JSON.stringify(botDetails),
    method: 'POST'},
    function (error, response, body) {
    	//body: Response body
    	//console.log(response);
        if (!error && response.statusCode == 200) {
        	//console.log("inside loop")
            //console.log(body);
            res.send({status:"Deployment success"});
           /* if(body.token)
             res.send({status:"Login success"});
           else
           	res.send({status:"Login Failed"});*/
        }
        else if(response.statusCode == 404 )
        	res.send({status:"Device not found"});
         else if(response.statusCode == 401 )
        	res.send({status:"Token Expired.Login again before deploying the bot"});
        else  if (body.code=="UM1110" && response.statusCode != 200 )
        	res.send({status:"Deployment Failed"});
        else
        	console.log(error);
    }
    )
  },function(){

   console.log("after deployment");

 //});//after call back of login
    
  });


//AUTHENTICATION
  app.post('/loginToControlRooom', (req, res) => {
   console.log(req.body);
   var userCred={ Username:req.body.loginID, Password:req.body.password};
   request(
   // 'http://aablr0195.aaspl-brd.com:81/v1/authentication',
   // { json: { Username:req.body.loginID, Password:req.body.password } },
    {headers: {
      //'Content-Length': contentLength,
      'Content-Type': 'application/json'
    },
    url: global.gConfig.controlRoom_URL+'/v1/authentication',
    //url: 'localhost:8000/v1/authentication',
    body: JSON.stringify(userCred),
    method: 'POST'},
    function (error, response, body) {
    	/*console.log("inside res")
    	console.log(response);
    	//body: Response body
    	console.log(body.code +"  "+response.statusCode )*/;
        if (!error && response.statusCode == 200) {
        	//console.log("inside loop")
            //console.log(body);
            res.send({status:"Login success", token:body.token});
            thisSession = req.session;
            console.log("results");
            var parsedBody=JSON.parse(body);
            console.log(parsedBody);
    		thisSession.token = parsedBody.token;
    		console.log(thisSession.token)
            
           /* if(body.token)
             res.send({status:"Login success"});
           else
           	res.send({status:"Login Failed"});*/
        }
        else  if (body.code=="UM1110" && response.statusCode != 200 )
        	res.send({status:"Login Failed"});
    }
);
  })


// Talk to Dialogflow Conversational AI
//Run the bot in attended mode and return results

  app.post('/getClaim', (req, res) => {
    

    console.log("Get Claim URL");
    console.log(req.body.userName);
    console.log(req.body.policyNumber);
    

   // console.log(thisSession.token);
res.send({
         "fulfillmentText": "response text",
         "fulfillmentMessages": [{"simpleResponses": {"simpleResponses": [   {
            "textToSpeech": "Love is that condition in which the happiness of another person is essential to your own",
            "displayText": "Love is that condition in which the happiness of another person is essential to your own"
         }]}}]
         }
       )

   
  });





};