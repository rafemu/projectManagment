const express = require("express");
const {
  getProjectWithEmoloyeeTimeSheet,
  addEmployeeRecord,
} = require("../controllers/timeSheets");
const { getEmployeeById } = require("../controllers/employee");
const { calc } = require("../_helper/timesheetCalc");
const router = express.Router();
const moment = require("moment");

router.get("/:projectId", async (req, res, next) => {
  const { projectId } = req.params;
  try {
    const result = await getProjectWithEmoloyeeTimeSheet(projectId);
    res.json(result);
  } catch (ex) {
    return next({ message: "GENERAL ERROR", status: 400 });
  }
});

router.get("/employee/:employeeId", async (req, res, next) => {
  const { employeeId } = req.params;

  // const result = await calc(employeeId);
  try {
    const employeeDetails = await getEmployeeById(employeeId);
    console.log(employeeDetails);
    res.json(employeeDetails);
  } catch (ex) {
    return next({ message: ex.message, status: 401 });
  }
});

router.post("/addRecords", async (req, res, next) => {
  const { employeeId, projectId } = req.body;
  try {
    if (!Array.isArray(employeeId)) throw new Error("something went wrong");
    const getEmployeeObj = await getEmployeesDataFromClient(req.body);
    if (!getEmployeeObj) throw new Error("something went wrong");
    const result = addEmployeeRecord(getEmployeeObj);
    if (!result) throw new Error("some thing went worng on add records");
    res.json({ msg: "hr report has been added" });
  } catch (ex) {
    return next({ message: ex.message, status: 400 });
  }
});

async function getEmployeesDataFromClient(record) {
  // Extract all of keys which have array values
  let arrayKeys = Object.entries(record).filter(
    ([key, value]) => typeof value === "object" && Array.isArray(value)
  );

  //Create your default object with default keys:
  let defaultObj = Object.entries(record).reduce((obj, [key, value]) => {
    if (!typeof value === "object" || !Array.isArray(value)) {
      obj[key] = value;
    }
    return obj;
  }, {});
  // Create a function which fill an array with your final objects recursively:
  function addKeys(array, obj, keys) {
    if (!keys.length) {
      array.push(obj);
      return;
    }
    let [key, values] = keys.pop();
    values.forEach((val) => {
      obj[key] = val;
      addKeys(array, { ...obj }, [...keys]);
    });
  }

  let output = [];
  
  addKeys(output, defaultObj, arrayKeys);
  return output;
}

module.exports = router;
