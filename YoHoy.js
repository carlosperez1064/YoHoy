var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var url= 'mongodb://localhost:27017/YoHoy';
app.use(express.bodyParser());

app.post('/signup', function(req,res){
  var date= new Date();
  MongoClient.connect(url, function(err, db) {
    if(err) throw err;
    else console.log("We are connected");
    db.collection('client', function(err, collection){
      var client= req.body;
      collection.find({"username":client.username}).toArray(function(err, result) {
         if (!err){
           console.log(result);
           if (result[0]!=null){
             res.send("Username already exists")
           }else{
             res.send("Client successfully registered");
             insertClientToDb(client)
             console.log("Someone just signed up")
           }
         }else throw err;
       });
     });
  });
});

app.get('/signin/:username/:password', function(req,res){
  MongoClient.connect(url, function(err, db) {
    if(err) throw err;
    else console.log("We are connected");
    var parameters=req.params;
    db.collection('client', function(err, collection){
       collection.find({"username":parameters.username}).toArray(function(err, result) {
         if (!err){
           if (result[0]!=null){
             if (result[0].password==parameters.password){
               res.send("Welcome, "+result[0].name+"!");
             }else{
               res.send("Invalid password!")
             }
           }else{
             res.send("Username does not exist");
           }
         }else throw err;
       });
    });
  });
});

function insertClientToDb(doc){
MongoClient.connect(url, function(err, db) {
  if(err) throw err;
  else console.log("We are connected");

  db.collection('client', function(err, collection) {
  if (!err){
    console.log("All good");
    }
  });
  db.collection('client').insert(doc, function(err, records) {
  		if (err) throw err;
      else console.log("Insertion saved to bot db");
  	});
  });
};


app.listen(3000);
