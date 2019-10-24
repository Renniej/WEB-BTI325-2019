/*
BTI325–Assignment1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy. 
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students

Name: Tai-Juan Rennie   Student ID: 101359172  Date: 2019-09-13

Heroku Link: https://radiant-inlet-66784.herokuapp.com/

*/
var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();


function onHTTPStart(){
    console.log("Listening on: " + HTTP_PORT);
}

app.get("/", function(req, res){


    res.send("Tai-Juan Rennie 101359172");

});



app.listen(HTTP_PORT);