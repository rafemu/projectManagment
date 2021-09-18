const express = require("express");
const router = express.Router();
const upload = require("./../_helper/uploader");
const getValidationFunction = require("../validations/project.validation");

const {
  createProject,
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
      const createproje = await createProject(req.body);
      if (!createproje) throw new Error("Project was not created");
      // console.log(createproje)
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
      ? (result = await getProjects(pageSize, currentPage))
      : (result = await getProjects());
    if (!result) throw new Error("No Projects");
    const total = await getProjectsCount();
    if (!total) throw new Error("error occured");
    // console.log('projdfsects',result)
    res.json({ result, total: total });
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
      if (req.file.path !=undefined)
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
