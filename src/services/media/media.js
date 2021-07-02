import { Router } from "express"
import { getMedia, getReviews, writeMedia } from "./../../utils/fs.js"
import {
  checkMediaExists,
  postMediaCoverMiddlewares,
  postMediaMiddlewares,
  putMediaMiddlewares,
} from "./middlewares.js"
import uniqid from "uniqid"
import { generatePDFReadableStream } from "../../utils/pdf.js"
import { pipeline } from "stream"

const mediaRouter = Router()

// Get All Media
mediaRouter.get("/", async (req, res, next) => {
  try {
    const media = await getMedia()
    const reviews = await getReviews()
    media.forEach((m) => (m.reviews = reviews.filter((r) => r.mediaId === m._id)))
    res.status(200).send(media)
  } catch (error) {
    next(error)
  }
})

// Get single Media
mediaRouter.get("/:id", checkMediaExists, async (req, res, next) => {
  try {
    const reviews = await getReviews()
    res.locals.foundMedia.reviews = reviews.filter((r) => r.mediaId === req.params.id)
    res.status(200).send(res.locals.foundMedia)
  } catch (error) {
    next(error)
  }
})

// Post single Media
mediaRouter.post("/", postMediaMiddlewares, async (req, res, next) => {
  try {
    const newMedia = {
      ...req.body,
      _id: uniqid(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    const media = await getMedia()
    media.push(newMedia)
    await writeMedia(media)
    res.status(201).send({ _id: newMedia._id })
  } catch (error) {
    next(error)
  }
})

// Update single media
mediaRouter.put("/:id", putMediaMiddlewares, async (req, res, next) => {
  try {
    const updatedMedia = {
      ...res.locals.foundMedia,
      ...req.body,
      updatedAt: new Date(),
    }
    res.locals.mediaJSON[res.locals.foundMediaIndex] = updatedMedia
    await writeMedia(res.locals.mediaJSON)
    res.status(200).send(updatedMedia)
  } catch (error) {
    next(error)
  }
})

// Delete single media
mediaRouter.delete("/:id", checkMediaExists, async (req, res, next) => {
  try {
    const deletedMedia = res.locals.mediaJSON.splice(res.locals.foundMediaIndex, 1)
    await writeMedia(res.locals.mediaJSON)
    res.status(200).send(deletedMedia)
  } catch (error) {
    next(error)
  }
})

// Upload media cover
mediaRouter.post("/:id/upload", postMediaCoverMiddlewares, async (req, res, next) => {
  try {
    res.locals.mediaJSON[res.locals.foundMediaIndex] = {
      ...res.locals.foundMedia,
      cover: req.file.path,
    }
    await writeMedia(res.locals.mediaJSON)
    res.status(200).send("Succesfully uploaded picture")
  } catch (error) {
    next(error)
  }
})

// Get single media as PDF
mediaRouter.get("/:id/pdf", checkMediaExists, async (req, res, next) => {
  try {
    const reviews = await getReviews()
    res.locals.foundMedia.reviews = reviews.filter((r) => r.mediaId === req.params.id)
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${res.locals.foundMedia.title}.pdf`
    )
    const pdfStream = await generatePDFReadableStream(res.locals.foundMedia)
    pipeline(pdfStream, res, (err) => {
      if (err) next(err)
    })
  } catch (error) {
    next(error)
  }
})

export default mediaRouter
