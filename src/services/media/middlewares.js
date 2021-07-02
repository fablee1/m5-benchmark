import { getMedia, writeMedia } from "./../../utils/fs.js"
import { validateSchemaMiddleware, validateUpdateSchemaMiddleware } from "./validation.js"
import createError from "http-errors"
import filterBody from "./../../utils/filterBody.js"
import { mediaCloudinary } from "./../../configs/cloudinary.js"

const mediaFields = ["title", "year", "type"]

export const checkMediaExists = async (req, res, next) => {
  const media = await getMedia()
  const singleMediaIndex = media.findIndex((m) => m._id === req.params.id)
  if (singleMediaIndex !== -1) {
    res.locals.mediaJSON = media
    res.locals.foundMedia = media[singleMediaIndex]
    res.locals.foundMediaIndex = singleMediaIndex
    next()
  } else {
    next(createError(404, `Media with ${req.params.id} doesn't exist!`))
  }
}

const filterMediaBody = (req, res, next) => {
  req["body"] = filterBody(req["body"], mediaFields)
  next()
}

const checkMediaType = async (req, res, next) => {
  if (req.body.cover) {
    res.locals.mediaJSON[res.locals.foundMediaIndex] = {
      ...res.locals.foundMedia,
      cover: req.body.cover,
    }
    await writeMedia(res.locals.mediaJSON)
    res.status(200).send("Succesfully added picture")
  } else {
    next()
  }
}

export const postMediaMiddlewares = [filterMediaBody, ...validateSchemaMiddleware]
export const putMediaMiddlewares = [
  checkMediaExists,
  filterMediaBody,
  ...validateUpdateSchemaMiddleware,
]
export const postMediaCoverMiddlewares = [
  checkMediaExists,
  checkMediaType,
  mediaCloudinary,
]
