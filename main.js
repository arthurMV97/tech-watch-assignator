// var bodyParser = require("body-parser");
const fetch = require("node-fetch");
const express = require("express"); //Imports the express module
const app = express(); //Creates an instance of the express module
const ejs = require("ejs");

const PORT = 3000;

// middleware
app.use(express.urlencoded({ extended: true })); // allow us to receive data from formulaire
app.use(express.json()); // allow us to work with json format

app.set("view engine", "ejs"); // the view engine in type of ejs
app.use(express.static("public")); // mention the public directory from which you are serving the static files. Like css/js/image

// ROUTE
app.get("/", function (req, res) {
  res.render("home.ejs");
});

// STUDENTS
var allStudents = [];
app.get("/StudentsList", async function (req, res) {
  let studentData = await fetch("http://localhost:8080/StudentsList");
  allStudents = await studentData.json();
  res.render("StudentsList.ejs", { studentArray: allStudents });
});

app.post("/StudentsList", async function (req, res) {
  fetch("http://localhost:8080/Students", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: req.body.name,
      group: "",
    }),
  })
    .then(function (response) {
      return response.json();
    })
    .then(async function (sucess) {
      console.log("This student be add to the collection: ", sucess.name);
    })
    .catch(function (error) {
      console.log("Request failure: ", error);
    });
  res.redirect("StudentsList");
});

//Starts the Express server with a callback
app.listen(PORT, function (err) {
  if (!err) {
    console.log("http://localhost:3000/");
  } else {
    console.log(JSON.stringify(err));
  }
});
