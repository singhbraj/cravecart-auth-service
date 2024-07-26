import "reflect-metadata"
import express, { NextFunction, Request, Response } from "express"
import logger from "./config/logger"
import { HttpError } from "http-errors"
import authRouter from "./routes/auth"
import cookieParser from "cookie-parser"

const app = express()

app.use(express.static("public"))

app.use(express.json())
app.use(cookieParser())

app.get("/", (req, res) => {
    res.send("Welcome to auth service")
})

app.use("/auth", authRouter)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    //  if(err instanceof Error){
    logger.error(err.message)
    const statusCode = err.statusCode || err.status || 500
    res.status(statusCode).json({
        errors: [
            {
                type: err.name,
                msg: err.message,
                path: "",
                location: "",
            },
        ],
    })
    //  }
})

export default app
