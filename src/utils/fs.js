import fs from "fs-extra"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const { readJSON, writeJSON } = fs

const currentDirPath = (filePath) => dirname(fileURLToPath(filePath))
const dataFolderPath = join(currentDirPath(import.meta.url), "../data/")
const mediaJSONPath = join(dataFolderPath, "media.json")
const reviewsJSONPath = join(dataFolderPath, "reviews.json")

// Media read and write
export const getMedia = async () => await readJSON(mediaJSONPath)
export const writeMedia = async (content) => await writeJSON(mediaJSONPath, content)

// Reviews read and write
export const getReviews = async () => await readJSON(reviewsJSONPath)
export const writeReviews = async (content) => await writeJSON(reviewsJSONPath, content)
