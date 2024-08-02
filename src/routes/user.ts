import { UserService } from "./../services/UserService"
import express, { NextFunction, Request, Response } from "express"

import authenticate from "../middleware/authenticate"
import { canAccess } from "../middleware/canAccess"
import { Roles } from "../constants"
import { UserController } from "../controllers/UserController"
import { AppDataSource } from "../config/data-source"
import { User } from "../entity/User"

const router = express.Router()

const userRepository = AppDataSource.getRepository(User)
const userService = new UserService(userRepository)
const userController = new UserController(userService)

router.post(
    "/",
    authenticate,
    canAccess([Roles.ADMIN]),
    (req: Request, res: Response, next: NextFunction) =>
        userController.create(req, res, next),
)

export default router
