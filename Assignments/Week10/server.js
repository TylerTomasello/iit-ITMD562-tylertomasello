/*        GET /users/{userId}
            Must return a 200 with ONLY the relevant user information ( i.e. { "name" : "My Name", "email" : "my@email.com" } )
            Return 404 if not found
        GET /users/{userId}/reminders
            Must return a 200 with ONLY the relevant user's reminders as an array ( i.e. [{ "title" : "MyTItle", "description" : "My Desc", "created" : <<created_timestamp> }])
            Return 404 if not found
            GRAD STUDENTS MUST ALSO IMPLEMENT TITLE FILTERING
                If query param "title" is present, only return reminders which match that title exactly (i.e. GET /users/{userId}/reminders?title=My%20Title )
        GET /users/{userId}/reminders/{reminderId}
            Must return a 200 with ONLY the relevant user's reminder as a single object ( i.e. { "title" : "My TItle", "description" : "My Desc", "created" :< <created_timestamp> })
            Return 404 if not found
        POST /users
            Must create a user given the user input model defined below
            Content-Type must be application-json
            Return 200 along with ONLY the new user id upon success (i.e. { "id" : <someId> } )
        POST /users/{userId}/reminders
            Must create a reminder given the reminder input model defined below (i.e. user does not provide created timestamp on creation)
            Content-Type must be application-json
            Return 200 along with ONLY the new reminder id upon success (i.e. { "id" : <someId> } )
        DELETE /users/{userId}
            Must delete the user at the given id along with all of their reminders
            Return 204 No Content upon success
            Return 404 if user doesn't exist
        DELETE /users/{userId}/reminders
            Must delete all the reminders for the user at the given id
            Return 204 No Content upon success
            Return 404 if user doesn't exist
        DELETE /users/{userId}/reminders/{reminderId}

            Must delete the specified reminder for the user at the given id
            Return 204 No Content upon success
            Return 404 if user or reminder doesn't exist
*/

var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();

app.use(bodyParser.json());

//use mongoose to connect to a database
mongoose.connect('mongodb://localhost:27017/user');

var userSchema = mongoose.Schema({
  name : String,
  email : String,
  reminder : [{
    title : String,
    description : String,
    created : String
  }]
});

var user = mongoose.model('user', userSchema);


app.get('/users/:userId', function (req, res) {
  user.findById(req.params.userId, function (err, user){
    if (err){
      res.status(404).send(err);
    }
    else {
      res.status(200).send({
        'name' : user.name,
        'email' : user.email
      });
    }
  });
});

app.get('/users/:userId/reminders', function (req, res) {

});

app.get('/users/:userId/reminders/:reminderId', function (req, res) {
  user.findById(req.params.userId, function (err, user) {
    if (err){
      res.status(404).send(err);
    }
    else {
      res.status(200).send({
        'title' : reminder.title,
        'description' : reminder.description,
        'creeated' : reminder.created
      });
    }
  });
});

app.post('/users', function (req, res) {
  var new_user=new user({
    name : req.body.name,
    email : reeq.body.email
  });
  new_user.save(function (err, user) {
    if (err) {
      res.status(404).send(err);
    }
    else {
      res.status(200).send(user);
    }
  });
});

app.post('/users/:userId/reminders', function (req, res) {
  var current=new Date();
  //array of current month, date, and year
  var date=[current.getMonth() + 1, current.getDate(), current.getFullYear()];
  //array of current hour, minutes, and seconds
  var time=[current.getHours(), current.getMinutes(), current.getSeconds()];
  //if sec and min are less then 10 put a 0 in fron of it
  for (var i = 1; i < 3; i++) {
    if (time[i] < 10) {
      time[i]= "0" + time[i];
    }
  }
  // Return the formatted string
  var timestamp = date.join("-") + " " + time.join(":") ;

  var new_reminder={
    title : req.body.title,
    description : req.body.description,
    created : timestamp
  };

  user.findById(req.params.userId, function (err, user) {
    if (err) {
      res.status(404).send(err);
    }
    else {
      var reminder = user.reminder.create(new_reminder);
      user.reminder.push(reminder);
      user.save(function (err, user) {
        if (err) {
          res.status(404).send(err);
        }
        else {
          res.status(200).send(reminder);
        }
      });
    }
  });
});

app.delete('/users/:userId', function (req,res){
  user.remove({_id : req.params.userId}, function (err, user) {
    if (err) {
      res.status(404).send(err);
    }
    else {
      res.status(204).send({message : 'User deleted'});
    }
  });
});

app.delete('/users/:userId/reminders', function (req,res){
  user.findById(req.params.userId, function(err, user) {
    if (err) {
      res.status(404).send(err);
    }
    else {
      user.reminder.remove({_id : req.params.userId}, function (err, user) {
        if (err) {
          res.status(404).send(err);
        }
        else {
          res.status(204).send({message : 'Reminders deleted'});
        }
      });
    }
  });
});

app.delete('/users/:userId/reminders/reminderId', function (req,res){
  user.findById(req.params.userId, function(err, user) {
    if (err) {
      res.status(404).send(err);
    }
    else {
      user.reminder.pull(req.params.reminderId);
      user.save(function(err, user) {
        if (err) {
          res.status(404).send(err);
        }
        else {
          res.status(204).send({message : 'Reminder deleted'});
        }
      }
    }
  });
});

app.listen(3000, function (){
  console.log('User app listening on port 3000');
});
