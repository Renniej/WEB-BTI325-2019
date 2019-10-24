/**********************************************************************************  BTI325–Assignment2* 
 *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy. 
 *  No part *  of this assignment has been copied manually or electronically from any other source *  
 * (including 3rd party web sites) or distributed to other students.*
 *  
 * *  Name: Tai-Juan Rennie Student ID: 101359172 Date: 2019-10-07*
 * 
 * *  Online (Heroku) Link: https://shrouded-taiga-29354.herokuapp.com/
 * *********************************************************************************/ 

const HTTP_PORT = process.env.PORT || 8080;
const  express = require("express");
const  app = express();
const path = require('path');

const data_services =  require("./data-services.js")


const views = '/views/';

app.use(express.static('public')); //idk know what this is used for q.q


function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
  }

app.get("/", (req, res) =>{

    res.sendFile(path.join(__dirname + views + "home.html"));
})

app.get("/about", (req, res) =>{

  res.sendFile(path.join(__dirname + views + "about.html"));
})


app.get("/employees", function(req,res){

  data_services.getAllEmployees().then(function(data){
      res.json(data);
  })
  .catch(function(err){
    res.json({"message" : err});
  })

})


app.get("/managers", function(req, res){

    data_services.getManagers().then(function(data){
      res.json(data);
  })
  .catch(function(err){
    res.json({"message" : err});
  })


})

app.get("/departments", function(req, res){

    data_services.getDepartments().then(function(data){
      res.json(data);
  })
  .catch(function(err){
    res.json({"message" : err});
  })

})



app.use((req, res) => {
    res.status(404).send("Your princess is in another castle brother...");
  });


data_services.initialize().then(function(data){
  app.listen(HTTP_PORT, onHttpStart);

}).catch(function(err){
  console.log(err);
})