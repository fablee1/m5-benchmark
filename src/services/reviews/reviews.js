import { Router } from "express"
import uniqid from "uniqid"
import { getReviews, writeReviews } from "../../utils/fs.js"

const reviewsRouter = Router()

reviewsRouter.post("/:id", async (req, res, next) => {
  try {
    const newComment = {
      ...req.body,
      _id: uniqid(),
      mediaId: req.params.id,
      createdAt: new Date(),
    }
    const comments = await getReviews()
    comments.push(newComment)
    await writeReviews(comments)
    res.status(201).send(newComment)
  } catch (error) {
    next(error)
  }
})

reviewsRouter.delete("/:id", async (req, res, next) => {
  try {
    const comments = await getReviews()
    const commentsNew = comments.filter((c) => c._id !== req.params.id)
    await writeReviews(commentsNew)
    res.status(200).send("Deleted comment")
  } catch (error) {
    next(error)
  }
})

export default reviewsRouter
