import { UserService } from "./../services/UserService"
import { JwtPayload } from "jsonwebtoken"
import { NextFunction, Response } from "express"
import { RegisterUserRequest } from "../types"
import { Logger } from "winston"
import { validationResult } from "express-validator"
import { TokenService } from "../services/TokenService"

export class AuthController {
    constructor(
        private userService: UserService,
        private logger: Logger,
        private tokenService: TokenService,
    ) {
        this.userService = userService
    }
    async register(
        req: RegisterUserRequest,
        res: Response,
        next: NextFunction,
    ) {
        // validation

        const result = validationResult(req)

        if (!result.isEmpty()) {
            return res.status(400).json({ erros: result.array() })
        }

        const { firstName, lastName, email, password } = req.body

        this.logger.debug("New request to register a user", {
            firstName,
            lastName,
            email,
            password: "*******",
        })
        try {
            const user = await this.userService.create({
                firstName,
                lastName,
                email,
                password,
            })

            this.logger.info("User has been registered", { id: user.id })

            const payload: JwtPayload = {
                sub: String(user.id),
                role: user.role,
            }

            const accessToken = this.tokenService.generateAccessToken(payload)

            const newRefreshToken =
                await this.tokenService.persistRefreshToken(user)

            const refreshToken = this.tokenService.generateRefreshToken({
                ...payload,
                id: String(newRefreshToken.id),
            })

            res.cookie("accessToken", accessToken, {
                domain: "localhost",
                sameSite: "strict",
                maxAge: 1000 * 60 * 60,
            })

            res.cookie("refreshToken", refreshToken, {
                domain: "localhost",
                sameSite: "strict",
                maxAge: 1000 * 60 * 60,
            })

            res.status(201).json({ id: user.id })
        } catch (err) {
            next(err)
            return
        }
    }
}
