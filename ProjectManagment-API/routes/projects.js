const express = require("express");
const router = express.Router();
const upload = require("./../_helper/uploader");
const uploadCheck = require("./../_helper/uploaderCheck");
const getValidationFunction = require("../validations/project.validation");

const {
  createProject,
  insertQuotationForProject,
  insertPaidsForProject,
  insertCheckPhotoToDB,
  getProjectPaids,
  editProject,
  deleteProjectById,
  _deleteAgreementFromStorage,
  getProjects,
  getAgreementByProjectId,
  getProjectById,
  getProjectsCount,
  insertPhotoToDB,
  updatePhotoToDB,
} = require("../controllers/project");

// create project
router.post(
  "/",
  upload,
  getValidationFunction("project"),
  async (req, res, next) => {
    try {
      if (!req.file) res.send("No files !");
      console.log(req.body);
      const createproje = await createProject(req.body);
      if (!createproje) throw new Error("Project was not created");
      const insertQuotation = await insertQuotationForProject(
        createproje,
        req.body.quotation
      );
      if (!insertQuotation) throw new Error("Error with add Quotation");
      const insertPaids = await insertPaidsForProject(
        createproje,
        req.body.paid
      );
      if (!insertPaids) throw new Error("Error with add paids");
      const insertImages = await insertPhotoToDB(req.file.path, createproje);
      if (!insertImages) throw new Error("error on inserting image");
      res.json({
        fileUrl:
          `http://localhost:${process.env.PORT}/images/` + req.file.filename,
        createproje,
        message: "project  created",
      });
    } catch (ex) {
      return next({ message: ex.message, status: 400 });
    }
  }
);

router.get("/", async (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  try {
    currentPage
      ? (projects = await getProjects(pageSize, currentPage))
      : (projects = await getProjects());
    if (!projects) throw new Error("No Projects");
    const total = await getProjectsCount();
    if (!total) throw new Error("error occured");
    // console.log('projdfsects',result)
    res.json({ result: projects, total: total });
  } catch (error) {
    return next({ message: error.message, status: 400 });
  }
});

router.get("/:projectId", async (req, res, next) => {
  const { projectId } = req.params;
  try {
    const result = await getProjectById(projectId);
    res.json(result);
  } catch (ex) {
    return next({ message: "GENERAL ERROR", status: 400 });
  }
});

router.get("/getPaids/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await getProjectPaids(id);
    if (!result) throw new Error("something went wrong");
    res.json({ paids: result });
  } catch (ex) {
    return next({ message: ex.message, status: 400 });
  }
});

router.post("/paids", uploadCheck, async (req, res, next) => {
  const { projectId, paid, method } = req.body;
  try {
    const result = await insertPaidsForProject(projectId, paid, method);
    if (!result) throw new Error("some thing went wrong to add paids");
    if(req.file){
      const insertCheckImgToDb = await insertCheckPhotoToDB(req.file.path,result);
      if(!insertCheckImgToDb) throw new Error('some thing went wrong with insertImg Path');
    }
   res.json(result);
  } catch (ex) {
    next({ message: ex.message, status: 400 });
  }
});

router.put(
  "/:projectId",
  upload,
  getValidationFunction("project"),
  async (req, res, next) => {
    try {
      const projectId = req.params.projectId;
      const getOldImagePath = await getAgreementByProjectId(projectId);
      const result = await editProject(req.body, projectId);
      if (!result) throw new Error("some thing went wrong with editing");
      if (req.file.path != undefined)
        await _deleteAgreementFromStorage(getOldImagePath);
      const getImgPath =
        req.file.path === undefined ? getOldImagePath : req.file.path;
      const insertImages = await updatePhotoToDB(getImgPath, projectId);
      if (getOldImagePath === undefined)
        await insertPhotoToDB(req.file.path, projectId);
      res.json({
        result,
      });
    } catch (ex) {
      return next({ message: ex.message, status: 400 });
    }
  }
);

router.delete(
  "/:projectId",
  // getValidationFunction("deleteSchema"),
  async (req, res, next) => {
    const projectId = req.params.projectId;
    try {
      const checkIfProjectExist = await getProjectById(projectId);
      if (!checkIfProjectExist) throw new Error("Invalid Vacation");
      const result = await deleteProjectById(projectId);
      if (!result) throw new Error("error in deleteing vacation");
      console.log(checkIfProjectExist.agreement);
      const deleteImage = _deleteAgreementFromStorage(
        checkIfProjectExist.agreement
      );
      res.status(200).json(`you have deleted vacationId ${projectId}`);
      // logger.info(`${req.user.userName} has deleted vacationId ${vacationId}`);
    } catch (ex) {
      return next({ message: ex.message, status: 400 });
    }
  }
);

module.exports = router;
