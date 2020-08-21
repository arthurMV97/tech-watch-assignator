const Express = require("express");
const Mongoose = require("mongoose");
const BodyParser = require("body-parser");

var app = Express();

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true } ));

Mongoose.connect("mongodb://localhost:27017/tech-watch-assignator", { useNewUrlParser: true , useUnifiedTopology: true });

const StudentModel = Mongoose.model("studentslist", {
  name: String
});

const GroupModel = Mongoose.model("groups", {
  groupsToAdd: String,
  date: String,
  number: String,
  names: [String],
});


app.post("/StudentsList", async (request, response) => {
  try {
    var student = new StudentModel(request.body)
    var result = await student.save();
    response.send(result)
  } catch (error) {
    response.status(500).send(error);
  }
});


app.get("/StudentsList", async (request, response) => {});




app.delete("/StudentsList", async (request, response) => {});



app.get("/TechWatch", async (request, response) => {});
app.post("/TechWatch", async (request, response) => {});


app.listen(8080, () => {
    console.log("http://localhost:8080/");
});