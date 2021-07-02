import { checkSchema, validationResult } from "express-validator"

const mediaSchema = {
  title: {
    in: ["body"],
    exists: {
      errorMessage: "Title is mandatory!",
    },
    isString: { errorMessage: "Title must be a string!" },
  },
  year: {
    in: ["body"],
    exists: {
      errorMessage: "Year is mandatory",
    },
    isInt: true,
    toInt: true,
  },
  type: {
    in: ["body"],
    exists: {
      errorMessage: "Type is mandatory!",
    },
    isString: { errorMessage: "Type must be a string!" },
  },
}
const checkMediaSchema = checkSchema(mediaSchema)

const mediaUpdateSchema = {
  title: {
    in: ["body"],
    optional: { options: { nullable: true } },
    isString: { errorMessage: "Title must be a string!" },
  },
  year: {
    in: ["body"],
    optional: { options: { nullable: true } },
    isInt: true,
    toInt: true,
  },
  type: {
    in: ["body"],
    optional: { options: { nullable: true } },
    isString: { errorMessage: "Type must be a string!" },
  },
}
const checkMediaUpdateSchema = checkSchema(mediaUpdateSchema)

const validateMediaSchema = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Error with media!",
      errors: errors.array(),
    })
  } else {
    next()
  }
}

export const validateSchemaMiddleware = [checkMediaSchema, validateMediaSchema]
export const validateUpdateSchemaMiddleware = [
  checkMediaUpdateSchema,
  validateMediaSchema,
]
