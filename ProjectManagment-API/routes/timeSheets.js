const express = require("express");
const {
  getProjectWithEmoloyeeTimeSheet,
  addEmployeeRecord,
  getSalaries,
  getDuration,
  getSalaryByMonth,
  getAllRecordsByMonth,
  getRecordsCount,
  addOrUpdateSalary,
} = require("../controllers/timeSheets");
const { checkIfProjectExist } = require("../controllers/project");

const {
  getRecordById,
  checkProjectsIfChanged,
  updateRecord,
  deleteRecordById,
} = require("../controllers/records");
const getValidationFunctionTimeSheet = require("../validations/timeSheets.validation");
const getValidationFunction = require("../validations/project.validation");
const getValidationFunctionEmployee = require("../validations//employee.validation");
const getValidationFunctionRecords = require("../validations/records.validation");

const { getEmployeeById } = require("../controllers/employee");
const { calc } = require("../_helper/timesheetCalc");
const router = express.Router();
const logger = require("../logger");
const moment = require("moment");
const currentTime = moment().utc();

router.get(
  "/",
  getValidationFunctionTimeSheet("getTimeSheetRecorda"),
  async (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const currentMonth = req.query.currentMonth;
    const employeeId = req.query.employeeId;
    try {
      const records = await getAllRecordsByMonth(
        currentMonth,
        pageSize,
        currentPage,
        Number(employeeId)
      );
      if (!records)
        throw new Error("something wen wrong when get Records by month");
      const totalOfRecords = await getRecordsCount(currentMonth);
      if ((totalOfRecords == null) | undefined)
        throw new Error("somthing went wrong get records count ");
      logger.info(
        `currentTime: ${currentTime} ###### Get records done - pageSize:${pageSize} - currentMonth: ${currentMonth} - employeeId:${employeeId}`
      );
      res.json({ result: records, total: totalOfRecords });
    } catch (ex) {
      logger.error(
        `${currentTime} -  Get records for - pageSize:${pageSize} - currentMonth: ${currentMonth} - employeeId:${employeeId} Failed - ${ex.message} `
      );
      return next({ message: ex.message, status: 400 });
    }
  }
);

router.get(
  "/:projectId",
  getValidationFunction("getProjectById"),
  async (req, res, next) => {
    const { projectId } = req.params;
    try {
      const checkIfExist = await checkIfProjectExist(projectId);
      if (!checkIfExist) throw new Error('Invalid Project!"');
      const result = await getProjectWithEmoloyeeTimeSheet(projectId);
      logger.info(
        `currentTime: ${currentTime} ###### Get Project with time sheet done - projectId: ${projectId}`
      );
      res.json(result);
    } catch (ex) {
      logger.error(
        `${currentTime} - Get Project with time sheet - projectId: ${projectId} Failed - ${ex.message} `
      );
      return next({ message: ex.message, status: 400 });
    }
  }
);

router.get(
  "/get/allSalaries",
  getValidationFunctionTimeSheet("getTimeSheetRecorda"),
  async (req, res, next) => {
    try {
      const result = await getSalaries(req.query.currentMonth);
      logger.info(
        `currentTime: ${currentTime} ###### Get All Salary done - currentMonth: ${req.query.currentMonth}`
      );
      if (!result) throw new Error("no salary");
      res.json({
        result: result,
        msg: `salary `,
      });
    } catch (ex) {
      logger.error(
        `${currentTime} - Get All Salary - currentMonth: ${req.query.currentMonth} - Failed - ${ex.message} `
      );
      return next({ message: ex.message, status: 400 });
    }
  }
);

router.get(
  "/getlast/Salary",
  getValidationFunctionTimeSheet("getTimeSheetRecorda"),
  async (req, res, next) => {
    try {
      const result = await getSalaryByMonth(req.query.currentMonth);
      if (!result) throw new Error("something went Error");
      const duration = await getDuration(req.query.currentMonth);
      if (!duration) throw new Error("no salary");

      const resultWithDuration = result.map((salary) => ({
        ...salary,
        ...duration.find((dura) => dura.employeeId === salary.employeeId),
      }));

      logger.info(
        `currentTime: ${currentTime} ###### Get  Salary by month done - currentMonth: ${req.query.currentMonth}`
      );
      res.json({
        result: resultWithDuration,
        msg: `salary `,
      });
    } catch (ex) {
      logger.error(
        `${currentTime} -  Get  Salary by month - currentMonth: ${req.query.currentMonth} - Failed - ${ex.message} `
      );
      return next({ message: ex.message, status: 400 });
    }
  }
);

// router.get("/employee/:employeeId",getValidationFunctionEmployee('getEmployeeById'), async (req, res, next) => {
//   const { employeeId } = req.params;
//   console.log('######################')
//   try {
//     const employeeDetails = await getEmployeeById(employeeId);
//     if(!employeeDetails) throw new Error('no employee found')
//     res.json(employeeDetails);
//   } catch (ex) {
//     return next({ message: ex.message, status: 401 });
//   }
// });

router.post(
  "/addRecords",
  getValidationFunctionRecords("postRecords"),
  async (req, res, next) => {
    const { employeeId } = req.body;
    try {
      if (!Array.isArray(employeeId)) throw new Error("something went wrong");
      const getEmployeeObj = await getEmployeesDataFromClient(req.body);
      if (!getEmployeeObj) throw new Error("something went wrong");
      const resultOfAddEmployeeRecords = await addEmployeeRecord(
        getEmployeeObj
      );
      if (!resultOfAddEmployeeRecords)
        throw new Error("some thing went worng on add records");
      logger.info(
        `currentTime: ${currentTime} ###### Add new record done for employees - ${employeeId} - currentMonth: ${req.body.date}`
      );
      res.json({ msg: "record  has been added" });
    } catch (ex) {
      logger.error(
        `${currentTime} -  Add new record done for employees - ${employeeId} - currentMonth: ${req.body.date} - Failed - ${ex.message} `
      );
      return next({ message: ex.message, status: 400 });
    }
  }
);

router.put(
  "/editRecord/",
  getValidationFunctionRecords("postRecords"),
  async (req, res, next) => {
    try {
      const { id } = req.body;
      console.log(req.body);
      const checkIfRecordExAndGetOldRecords = await getRecordById(id);
      if (!checkIfRecordExAndGetOldRecords)
        throw new Error("record dose not found");
      const editRecordResult = await updateRecord(req.body);
      const updateWorkPlace = await checkProjectsIfChanged(
        checkIfRecordExAndGetOldRecords,
        req.body
      );
      res.json({ msg: `hr report id - ${id} has been added` });
      logger.info(
        `currentTime: ${currentTime} ###### update record done for employees - ${req.body.employeeId[0]} - currentMonth: ${req.body.date}`
      );
    } catch (ex) {
      logger.error(
        `${currentTime} -  update record for employees - ${req.body.employeeId[0]} - currentMonth: ${req.body.date} - Failed - ${ex.message} `
      );
      next({ message: ex.message, status: 400 });
    }
  }
);

router.delete(
  "/deleteRecord/:recordId",
  getValidationFunctionRecords("recordId"),
  async (req, res, next) => {
    const recordId = req.params.recordId;
    try {
      const checkIfRecordExAndGetOldRecords = await getRecordById(recordId);
      if (!checkIfRecordExAndGetOldRecords) throw new Error("Invalid record");
      const result = await deleteRecordById(recordId);
      if (!result) throw new Error("error in deleteing employee");
      res.status(200).json(`you have deleted record ${recordId}`);
      logger.info(
        `currentTime: ${currentTime} ###### deleted record done  - ${recordId}`
      );
    } catch (ex) {
      logger.error(
        `${currentTime} -  delete record  - ${recordId} - Failed - ${ex.message} `
      );
      return next({ message: ex.message, status: 400 });
    }
  }
);

async function getEmployeesDataFromClient(record) {
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

router.post(
  "/calculateSalary",
  getValidationFunctionRecords("currentMonth"),
  async (req, res, next) => {
    try {
      const getEmployeeMothRecord = await getAllRecordsByMonth(
        req.body.currentMonth
      );
      if (!getEmployeeMothRecord) throw new Error("No records");
      const calculateDailyWagePerMonth = await calc(getEmployeeMothRecord);
      if (!calculateDailyWagePerMonth) throw new Error("something went wrong");
      const addOrUpdateSalaryResult = await addOrUpdateSalary(
        req.body.currentMonth
      );
      if (!addOrUpdateSalaryResult)
        throw new Error("something went wrong addOrUpdateSalaryResult");
      logger.info(
        `currentTime: ${currentTime} ###### Calculate Salary for month - ${req.body.currentMonth} done  `
      );
      res.json({
        result: getEmployeeMothRecord,
        msg: "Calculate Salary Done",
      });
    } catch (ex) {
      logger.error(
        `${currentTime} -  Calculate Salary for month - ${req.body.currentMonth}  - Failed - ${ex.message} `
      );
      return next({ message: ex.message, status: 400 });
    }
  }
);

module.exports = router;
