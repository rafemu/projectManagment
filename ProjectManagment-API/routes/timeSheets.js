const express = require("express");
const {
  getProjectWithEmoloyeeTimeSheet,
  addEmployeeRecord,
  getEmployeeMothRecords,
  getAllRecordsByMonth,
  getRecordsCount,
  addWorkedProject,
} = require("../controllers/timeSheets");
const { getEmployeeById } = require("../controllers/employee");
const { calc } = require("../_helper/timesheetCalc");
const router = express.Router();
const moment = require("moment");

router.get("/", async (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const currentMonth = req.query.currentMonth;
  const employeeId = req.query.employeeId
  try {
    // currentPage
    // ? (projects = await getProjects(pageSize, currentPage))
    // : (projects = await getProjects());
    const records = await getAllRecordsByMonth(
      currentMonth,
      pageSize,
      currentPage,
      employeeId
    );
    console.log(currentMonth)
    if (!records)
      throw new Error("something wen wrong when get Records by month");
    const totalOfRecords = await getRecordsCount(currentMonth);
    console.log(totalOfRecords)
    if ((totalOfRecords == null) | undefined)
      throw new Error("somthing went wrong get records count ");
    res.json({ result: records, total: totalOfRecords });
  } catch (ex) {
    return next({ message: ex.message, status: 400 });
  }
});

router.get("/:projectId", async (req, res, next) => {
  console.log("gett");
  const { projectId } = req.params;

  try {
    const result = await getProjectWithEmoloyeeTimeSheet(projectId);
    res.json(result);
  } catch (ex) {
    return next({ message: ex.message, status: 400 });
  }
});

router.get("/employee/:employeeId", async (req, res, next) => {
  const { employeeId } = req.params;
  try {
    const employeeDetails = await getEmployeeById(employeeId);
    res.json(employeeDetails);
  } catch (ex) {
    return next({ message: ex.message, status: 401 });
  }
});

router.post("/addRecords", async (req, res, next) => {
  const { employeeId, projectId } = req.body;
  try {
    console.log(req.body)
    if (!Array.isArray(employeeId)) throw new Error("something went wrong");
    const getEmployeeObj = await getEmployeesDataFromClient(req.body);
    console.log('getEmployeeObj',getEmployeeObj)
    if (!getEmployeeObj) throw new Error("something went wrong");
    const resultOfAddEmployeeRecords = await addEmployeeRecord(getEmployeeObj);
    if (!resultOfAddEmployeeRecords) throw new Error("some thing went worng on add records");
    res.json({ msg: "hr report has been added" });
  } catch (ex) {
    return next({ message: ex.message, status: 400 });
  }
});

async function getEmployeesDataFromClient(record) {
  console.log("getEmployeesDataFromClient", record);
  // if (record.employeeId.length == 1) return record.flat();
  const records = record.employeeId
    .map((employeeId) => ({
      ...record,
      employeeId: employeeId,
    }))
    .flat();
  return records;
}

async function getProjectsFromDataClient(record) {

  const records = record.projectId
    .map((projectId) => ({
      // ...record,
      projectId: projectId,
    }))
    .flat();
  return records;
}

router.post("/calculateDailyWage", async (req, res, next) => {
  const { employeeId, month } = req.body;
  console.log(employeeId, month);
  try {
    const getEmployeeMothRecord = await getEmployeeMothRecords(
      employeeId,
      month
    );
    const getDailyWage = await getEmployeeById(employeeId);

    const calculateDailyWagePerMonth = await calc(
      getEmployeeMothRecord,
      getDailyWage
    );
    res.json({
      result: getEmployeeMothRecord,
      msg: "hr report has been added",
    });
  } catch (ex) {
    return next({ message: ex.message, status: 400 });
  }
});

module.exports = router;
