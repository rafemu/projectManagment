const Joi = require("@hapi/joi");

const projectSchema = Joi.object().keys({
  projectName: Joi.string().required(),
  clientFullName: Joi.string().required(),
  clientPhone: Joi.string().required(),
  location: Joi.string().required(),
  quotation: Joi.number().required(),
  paid: Joi.number().required(),
  createdAt: Joi.date().required(),
  agreement: Joi.optional(),
});

const validationsObj = {
  project: (req, res, next) => {
    const { error } = projectSchema.validate(req.body);
    if (error) {
      console.log(error.details);
      return next(error.details);
    }
    return next();
  },
};

function getValidationFunction(path) {
  return validationsObj[path];
}

module.exports = getValidationFunction;
