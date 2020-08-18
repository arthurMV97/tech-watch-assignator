const MongoCLient = require("mongodb").MongoClient;
const express = require("express");
const bodyParser = require("body-parser"); // use to parse the body in Json Format
const colors = require("colors")
const url = "mongodb://localhost:27017";
const app = express();

const main = async () => {
  /* MONGO conection and DataBase création*/
  const client = await MongoCLient.connect(url, { useUnifiedTopology: true });
  const dataBase = client.db("tech-watch-assignator");

  try {


    /* ROUTES */
    app.listen(8080);

    // middlewear allows  us to support different format
    app.use(bodyParser.json()); // use by req.body property (to have key value)
    app.use(express.urlencoded({ extended: true })); // allow us to read thebody

    /* Accueil */
    app.get("/home", function (req, res) {
      res.status(200).send("Vous êtes à laccueil");
    });
    console.log("http://localhost:8080/home");

    /*---------------------------------------------------------
    ------------------------- STUDENTS PART -------------------
    ---------------------------------------------------------*/

    /* Students */
    app.get("/StudentsList", async function (req, res) {
      res.status(200).send(await showStudent(dataBase));
    });

    console.log("http://localhost:8080/StudentsList");

    /* Students POST - Add a student */
    app.post("/StudentsList", async function (req, res) {
      res.status(200).send(await addToStudentsCollection(dataBase, req));
    });

    /* Students Delete */
    app.delete("/StudentsList", async function (req, res) {
      res.status(200).send(await deleteStudentsToCollection(dataBase, req));
    });

    /*---------------------------------------------------------
    ------------------------- GROUPS PART ---------------------
    ---------------------------------------------------------*/

    /* Groups */
    app.get("/Groups", async function (req, res) {
      res.status(200).send(await showGroup(dataBase));
    });
    console.log("http://localhost:8080/Groups");

    /* Groups name  must be completed */
    app.get("/Groups/:name", async function (req, res) {
      res.status(200).send(await searchByGroupTech(dataBase, req));
    });

    /* Groups Post */
    app.post("/Groups", async function (req, res) {
      res.status(200).send(await addToGroupsCollection(dataBase, req));
    });

  } catch (error) {
    console.log(error);
  } finally {
    console.log("!==> Success <==! all is good".magenta);
  }
};
main();

/*---------------------------------------------------------
------------------------- FUNCTION PART -------------------
---------------------------------------------------------*/

/**
 * @summary find in the Groups collection the input, then create an array, if the input does not exist return an error message else return the Groups find
 * @param {*} dataBase
 * @param {*} req
 * @returns the group we were looking for
 */
let searchByGroupTech= async (dataBase, req) => {
  const nameOfGroup = await dataBase
    .collection("Groups")
    .find({ name: req.params.name })
    .toArray();

  if (nameOfGroup.length != 0) {
    return nameOfGroup;
  } else {
    return "this group does not exist";
  }
};

/**
 * @summary catch the "Student "to add and push him into an array, then insert him into the collection Students
 * @param {*} dataBase
 * @param {*} req
 * @returns the student to add (input)
 */
let addToStudentsCollection = async (dataBase, req) => {
  let studentToAdd = req.body; //name: "Coco"
  try {
    await dataBase.collection("StudentsList").insertOne(studentToAdd);
  } catch (error) {
    console.log(error);
  }
  return studentToAdd;
};

/**
 * @summary delete in the Student collection the student name input
 * @param {*} dataBase
 * @param {*} req
 * @returns the student name to delete
 */
let deleteStudentsToCollection = async (dataBase, req) => {
  let studentName = req.body.nameToDelete;
  // console.log(studentName);

    try {
      await dataBase.collection("StudentsList").deleteOne({ name: studentName });
    } catch (error) {
      console.log(error);
    }
    return studentName;
};

/**
 * @summary read the Students collection and assign the content to nameOfStudent
 * @returns an array of students stock in the collection Students (nameOfStudent)
 * @param {*} dataBase
 */
let showStudent = async (dataBase) => {
  const nameOfStudent = await dataBase.collection("StudentsList").find().toArray();
  return nameOfStudent;
};

/**
 * @summary read the Groups collection and assign  the content to nameOfGroup
 * @param {*} dataBase
 * @returns an array of groups stock in the collection Groups (nameOfGroup)
 */
let showGroup = async (dataBase) => {
  const nameOfGroup = await dataBase.collection("Groups").find().toArray();
  return nameOfGroup;
};

/**
 * @summary add in the collection Groups a new group
 * @returns the name of the group we want to add
 * @param {*} dataBase
 * @param {*} req
 */
let addToGroupsCollection = async (dataBase, req) => {
  let groupsToAdd = req.body;
  try {
    await dataBase.collection("Groups").insertOne(groupsToAdd);
  } catch (error) {
    console.log(error);
  }
  return groupsToAdd;
};

