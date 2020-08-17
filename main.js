// var bodyParser = require("body-parser");
const fetch = require("node-fetch");
const express = require("express"); //Imports the express module
const app = express(); //Creates an instance of the express module
const ejs = require("ejs")

const PORT = 3000;

// middleware
app.use(express.urlencoded({ extended: true })); // allow us to receive data from formulaire
app.use(express.json()); // allow us to work with json format

app.set("view engine", "ejs"); // the view engine in type of ejs
app.use(express.static("public")); // mention the public directory from which you are serving the static files. Like css/js/image

app.get("/", function(req, res){
    res.render("home.ejs")
})

//Starts the Express server with a callback
app.listen(PORT, function (err) {
    if (!err) {
      console.log("http://localhost:3000/");
    } else {
      console.log(JSON.stringify(err));
    }
  });
  