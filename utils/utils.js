/*---------------------------------------------------------
------------------------- FUNCTION PART -------------------
---------------------------------------------------------*/
class Utils {



/**
 * @summary catch the "Student "to add and push him into an array, then insert him into the collection Students
 * @param {*} dataBase
 * @param {*} req
 * @returns the student to add (input)
 */
static addToStudentsCollection = async (dataBase, req) => {
    let studentToAdd = req.body; 
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
  static deleteStudentsToCollection = async (dataBase, req) => {
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
  static showStudent = async (dataBase) => {
    const nameOfStudent = await dataBase.collection("StudentsList").find().toArray();
    return nameOfStudent;
  };
  
  
  
  
  
  /**
   * @summary read the Groups collection and assign  the content to nameOfGroup
   * @param {*} dataBase
   * @returns an array of groups stock in the collection Groups (nameOfGroup)
   */
 static showGroup = async (dataBase) => {
    const nameOfGroup = await dataBase.collection("Groups").find().toArray();
    return nameOfGroup;
  };
  
  /**
   * @summary add in the collection Groups a new group
   * @returns the name of the group we want to add
   * @param {*} dataBase
   * @param {*} req
   */
 static addToGroupsCollection = async (dataBase, req) => {
    let myObject = {
      groupsToAdd: req.body.tech,
      date: req.body.date,
      number: req.body.number,
      names: req.body.names
    }
    try {
      await dataBase.collection("Groups").insertOne(myObject);
    } catch (error) {
      console.log(error);
    }
    return myObject;
  };
  
}

module.exports = Utils;