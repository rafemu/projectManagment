const express = require("express");
const router = express.Router();

const {
  createEmployee,
  getEmployees,
  getEmployeeById,
  getEmployeesCount,
  editEmployee,
  deleteEmployeeById,
} = require("../controllers/employee");

// create employee
router.post("/", async (req, res, next) => {
  console.log(req.body);
  try {
    const createEmployeeResult = await createEmployee(req.body);
    console.log("createEmployee", createEmployeeResult);
    // const { type } = req.body;
    // const result = await isUserExist(req.body.users[0]);
    // if (!result) throw new Error("Invalid User");
    // console.log("createAccount");
    // const generatedAccountId = _generateAccountId();
    // const caResult = await createAccount({ type, id: generatedAccountId });
    // if (!caResult.affectedRows) throw new Error("Account was not created");
    // const cauResult = await createAccountUser(
    //   generatedAccountId,
    //   req.body.users[0],
    //   "Owner"
    // );
    // if (!cauResult.affectedRows)
    //   throw new Error("User Account was not created");
    res.json({ message: "employee created" });
  } catch (ex) {
    return next({ message: "global error", status: 500 });
  }

  function _generateAccountId() {
    return Math.floor(Math.random() * 99999);
  }
});

router.get("/", async (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  // console.log('employee')
  try {
    currentPage
      ? (employees = await getEmployees(pageSize, currentPage))
      : (employees = await getEmployees());
    if (!employees) throw new Error("no employees");
    const total = await getEmployeesCount();
    if (!total) throw new Error("error occured");
    // console.log('employee',result)
    res.json({ result: employees, total: total });
  } catch (error) {
    return next({ message: error.message, status: 400 });
  }
});

router.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const result = await getEmployeeById(id);
    if (!result) throw new Error("no employees");
    res.json(result);
  } catch (ex) {
    return next({ message: "global error", status: 401 });
  }
});

router.put(
  "/:employeeId",
  async (req, res, next) => {
    try {
      const employeeId = req.params.employeeId;
      const result = await editEmployee(req.body, employeeId);
      if (!result) throw new Error("some thing went wrong with editing");
      res.json({
        result,
      });
    } catch (ex) {
      return next({ message: ex.message, status: 400 });
    }
  }
);

router.delete(
  "/:employeeId",
  // getValidationFunction("deleteSchema"),
  async (req, res, next) => {
    const employeeId = req.params.employeeId;
    try {
      const checkIfEmployeeExist = await getEmployeeById(employeeId);
      if (!checkIfEmployeeExist) throw new Error("Invalid employee");
      const result = await deleteEmployeeById(employeeId);
      if (!result) throw new Error("error in deleteing employee");
      res.status(200).json(`you have deleted employeeId ${employeeId}`);
      // logger.info(`${req.user.userName} has deleted vacationId ${vacationId}`);
    } catch (ex) {
      return next({ message: ex.message, status: 400 });
    }
  }
);

module.exports = router;
