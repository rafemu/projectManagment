const express = require("express");
const {
  addEmployeeHr,
  getProjectWithEmoloyeeTimeSheet,
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
  const result = await calc(employeeId);
  // try {
  //   const result = await calc(employeeId);
  //   // res.json(result);
  // } catch (ex) {
  //   return next({ message: "GENERAL ERROR", status: 400 });
  // }
});

router.post("/employee/:employeeId", async (req, res, next) => {
  const { employeeId } = req.params;
  console.log(employeeId);
  const employeeDetails = await getEmployeeById(employeeId);
  console.log(employeeDetails.id);
  if (!employeeDetails) throw new Error("no employee found");
  const result = await addEmployeeHr(employeeDetails, req.body);
  if (!result) throw new Error("something went wrong");
  try {
    res.json({ msg: "hr report has been added" });
  } catch (ex) {
    return next({ message: "GENERAL ERROR", status: 400 });
  }
});

module.exports = router;
