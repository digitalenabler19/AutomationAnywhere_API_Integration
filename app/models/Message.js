const mongoose = require('mongoose');
var dbUrl = 'mongodb://localhost:27017/api-demo'
mongoose.connect(dbUrl , (err) => { 
   console.log('mongodb connected',err);
})

var Message = mongoose.model('Message',{ name:String, message : String});
module.exports=Message;