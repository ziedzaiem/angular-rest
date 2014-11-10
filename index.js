var express = require('express');
var format = require('util').format;
var bodyParser = require('body-parser');
var cool = require('cool-ascii-faces');

var app = express();

app.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies
app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(express.static(__dirname + '/public'));

app.set('port', (process.env.PORT || 8888))

//CORS
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");

  next();
});

//Data
var users = []

/**
* Get All Users
*/
app.get('/api/users', function(req,res) {
   console.log("GET\t/api/users"+
      "\tparams = " + JSON.stringify(req.params)+"\tbody = " + JSON.stringify(req.body) + "\tquery = " + JSON.stringify(req.query));
   //Send everything
   res.send(users).end();
});

/**
* Get User by Id
*/
app.get('/api/user/:id', function(req,res) {
   console.log("GET\t/api/user/"+req.params.id+
      "\tparams = " + JSON.stringify(req.params)+"\tbody = " + JSON.stringify(req.body) + "\tquery = " + JSON.stringify(req.query));

    for(var i=0;i<users.length;i++){
      if(users[i].id == req.params.id)
        res.send(users[i]).end();
    }

});


/**
* Create new User
*/
app.post('/api/users', function(req,res) {
  console.log("POST\t/api/users"+
     "\tparams = " + JSON.stringify(req.params)+"\tbody = " + JSON.stringify(req.body) + "\tquery = " + JSON.stringify(req.query));
  var user = req.body;

  if(users.length == 0)
    user.id= users.length;
  else
    user.id= users[users.length-1].id + 1;

  users.push(user);

  res.setHeader('Location', '/api/user/' + user.id);
  res.status(201).end();
});

/**
* Update User
*/
app.put('/api/user/:id', function(req,res) {
  console.log("PUT\t/api/user/"+req.params.id+
     "\tparams = " + JSON.stringify(req.params)+"\tbody = " + JSON.stringify(req.body) + "\tquery = " + JSON.stringify(req.query));

  for(var i=0;i<users.length;i++){
    if(users[i].id == req.params.id){
      users[i].name = req.body.name;
      users[i].age = req.body.age;
    }

  }

  res.status(200).end();
});

/*
* Delete User
*/
app.delete('/api/user/:id', function(req,res) {
  console.log("DELETE\t/api/user/"+req.params.id+
     "\tparams = " + JSON.stringify(req.params)+"\tbody = " + JSON.stringify(req.body) + "\tquery = " + JSON.stringify(req.query));

  //We search for the id
  var id = undefined;
  for(var i=0;i<users.length;i++){
    if(users[i].id == req.params.id)
      id = i;
  }

  users.splice(id,1);
  res.status(200).end();
});

var server = require('http').createServer(app);

server.listen((process.env.PORT || 8888), function(){
  console.log('listening on *:' + app.get('port'));
});
