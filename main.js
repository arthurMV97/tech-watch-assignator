// var bodyParser = require("body-parser");
const fetch = require("node-fetch");
const request = require("request");
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

app.get("/index", function (req, res) {
  res.render("index.ejs");
});

app.get("/about", function (req, res) {
  res.render("about.ejs");
});

app.get("/contact", function (req, res) {
  res.render("contact.ejs");
});
// STUDENTS
var allStudents = [];
app.get("/StudentsList", async function (req, res) {
  let studentData = await fetch("http://localhost:8080/StudentsList");
  allStudents = await studentData.json();
  res.render("StudentsList.ejs", { studentArray: allStudents });
});

// ADD A STUDENT
app.post("/StudentsList", async function (req, res) {
  fetch("http://localhost:8080/StudentsList", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: req.body.name,
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

// DELETE A STUDENT
app.post("/StudentsListDelete", async (req, res) => {
  fetch("http://localhost:8080/StudentsList", {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nameToDelete: req.body.nameToDelete,
    }),
  })
    .then(function (response) {
      return response.text();
    })
    .then(async function (sucess) {
      console.log("This student be deleted of the collection: ", sucess.name);
    })
    .catch(function (error) {
      console.log("Request failure: ", error);
    });
  res.redirect("StudentsList");
});

//TECH WATCH
allTech = [];
app.get("/TechWatch", async function (req, res) {
  let techData = await fetch("http://localhost:8080/TechWatch");
  allTech = await techData.json();
  res.render("tech_watch", { techArray: allTech });
});

// POST TECH WATCH (GROUP)
app.post("/TechWatch", async function (req, res) {
  // create array who contains all student name
  let studentData = await fetch("http://localhost:8080/StudentsList");
  let studentJson = await studentData.json();
  let allStudents = await studentJson.map((element) => element.name);

  


  fetch("http://localhost:8080/TechWatch", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tech: req.body.tech,
      date: req.body.date,
      number: req.body.number,
    }),
  })
    .then(function (response) {
      return response.json();
    })
    .then(async function (sucess) {
      console.log(
        "This Tech be add to the collection: ",
        sucess.name,
        sucess.date,
        sucess.number
      );
    })
    .catch(function (error) {
      console.log("Request failure: ", error);
    });
  res.redirect("TechWatch");
});

//Starts the Express server with a callback
app.listen(PORT, function (err) {
  if (!err) {
    console.log("http://localhost:3000/");
  } else {
    console.log(JSON.stringify(err));
  }
});
