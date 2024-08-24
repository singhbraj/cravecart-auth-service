import "reflect-metadata"
import express, { NextFunction, Request, Response } from "express"
import cors from "cors"
import logger from "./config/logger"
import { HttpError } from "http-errors"
import authRouter from "./routes/auth"
import tenantRouter from "./routes/tenants"
import userRouter from "./routes/user"
import cookieParser from "cookie-parser"

const app = express()

app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    }),
)
app.use(express.static("public"))
app.use(express.json())
app.use(cookieParser())

app.get("/", (req, res) => {
    res.send("Welcome to auth service")
})

app.use("/auth", authRouter)
app.use("/tenants", tenantRouter)
app.use("/users", userRouter)

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
