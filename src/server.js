import express from "express"
import morgan from "morgan"
import corsOptions from "./configs/cors.js"
import cors from "cors"
import listEndpoints from "express-list-endpoints"
import mediaRouter from "./services/media/media.js"
import reviewsRouter from "./services/reviews/reviews.js"

const port = process.env.PORT || 3001
const server = express()

server.use(cors(corsOptions))
server.use(express.json())
server.use(morgan("dev"))

server.use("/media", mediaRouter)
server.use("/reviews", reviewsRouter)

console.table(listEndpoints(server))

server.listen(port, () => console.log("Server is running on port " + port))
