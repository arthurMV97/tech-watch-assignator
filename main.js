
const fetch = require("node-fetch");
const request = require("request");
const express = require("express"); //Imports the express module
const app = express(); //Creates an instance of the express module
const ejs = require("ejs");
const PORT = 3000;

/*---------------------------------------------------------
------------------------- MIDDLEWARE ----------------------
---------------------------------------------------------*/
app.use(express.urlencoded({ extended: true })); // allow us to receive data from formulaire
app.use(express.json()); // allow us to work with json format
app.set("view engine", "ejs"); // the view engine in type of ejs
app.use(express.static("public")); // mention the public directory from which you are serving the static files. Like css/js/image

/*---------------------------------------------------------
------------------------- ROUTE ---------------------------
---------------------------------------------------------*/

// HOME
app.get("/", async function (req, res) {
  obj = await sortDates();
  list = await changedList();
  res.render("home.ejs", { newTab: obj.newTab, list: list });
});

// ABOUT
app.get("/about", function (req, res) {
  res.render("about.ejs");
});

/*---------------------------------------------------------
------------------------- STUDENT PART --------------------
---------------------------------------------------------*/

// ADD STUDENTLIST
var allStudents = [];
app.get("/StudentsList", async function (req, res) {
  let studentData = await fetch("http://localhost:8080/StudentsList");
  allStudents = await studentData.json();
  res.render("StudentsList.ejs", { studentArray: allStudents });
});

// POST STUDENT
app.post("/StudentsList", async function (req, res) {
  fetch("http://localhost:8080/StudentsList", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: req.body.name,
      assign: false,
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


/*---------------------------------------------------------
------------------------- TECH WATCH ----------------------
---------------------------------------------------------*/

//TECH WATCH
app.get("/TechWatch", async function (req, res) {
  let obj = await sortDates();
  res.render("tech_watch", { newTab: obj.newTab });
});

//GET HISTORY TECH
app.get("/History", async function (req, res) {
  let obj = await sortDates();
  console.log(obj);

  await res.render("history", { newTab: obj.newTab, oldTab: obj.oldTab });
});

// POST TECH WATCH (GROUP)
app.post("/TechWatch", async function (req, res) {
  const num = req.body.number;
  const list = await fetch("http://localhost:8080/StudentsList");
  const studentList = await list.json();
  let names = [];
  for (let i = 0; i < num; i++) {
    let random = Math.floor(Math.random() * studentList.length);
    names.push(studentList[random].name);
    studentList.splice(random, 1);
  }

  await fetch("http://localhost:8080/TechWatch", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tech: req.body.tech,
      date: req.body.date,
      number: req.body.number,
      names: names,
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

/*---------------------------------------------------------
------------------------- FUNCTION PART -------------------
---------------------------------------------------------*/

/**
 * @returns object containing two array of date (old and new)
 */
async function sortDates() {
  let techData = await fetch("http://localhost:8080/TechWatch");
  let allTech = await techData.json();
  //---SORT DATES
  let tab = [];
  let oldTab = [];
  let newTab = [];
  const todayDate = new Date();
  for (let i = 0; i < allTech.length; i++) {
    let date = new Date(allTech[i].date);
    tab.push({ date: date, index: i });
  }

  tab.sort((a, b) => {
    return a.date - b.date;
  });

  for (let i = 0; i < tab.length; i++) {
    if (todayDate > tab[i].date) {
      oldTab.push(allTech[tab[i].index]);
    }
  }
  for (let i = 0; i < tab.length; i++) {
    if (todayDate < tab[i].date) {
      newTab.push(allTech[tab[i].index]);
    }
  }
  let obj = {
    oldTab: oldTab,
    newTab: newTab,
  };

  return obj;
}


/**
 * @return a list of student available
 */
async function changedList() {
  let newListGroup = [];
  let newListStudents = [];
  let techData = await fetch("http://localhost:8080/TechWatch");
  let allTech = await techData.json();
  const list = await fetch("http://localhost:8080/StudentsList");
  const studentList = await list.json();

  allTech.forEach((e) => {
    e.names.forEach((el) => {
      newListGroup.push(el);
    });
  });
  studentList.forEach((e) => {
    newListStudents.push(e.name);
  });
  let finalList = newListStudents.filter((e) => !newListGroup.includes(e));
  return finalList;
}
