import { Repository } from "typeorm"
import bcrypt from "bcrypt"
import { AppDataSource } from "../config/data-source"
import { User } from "../entity/User"
import { UserData } from "../types"
import createHttpError from "http-errors"

export class UserService {
    constructor(private userRepository: Repository<User>) {}

    async create({
        firstName,
        lastName,
        email,
        password,
        role,
        tenantId,
    }: UserData) {
        const user = await this.userRepository.findOne({
            where: { email: email },
        })

        if (user) {
            const err = createHttpError(400, "email is already exists!")
            throw err
        }

        //  Hash the password
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        try {
            const userRepository = AppDataSource.getRepository(User)
            return await userRepository.save({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                role,
                tenant: tenantId ? { id: tenantId } : undefined,
            })
        } catch (err) {
            const error = createHttpError(
                500,
                "Failed to store the data in the database",
            )
            throw error
        }
    }

    async findByEmail(email: string) {
        return await this.userRepository.findOne({
            where: {
                email,
            },
        })
    }

    async findById(id: number) {
        return await this.userRepository.findOne({
            where: {
                id,
            },
        })
    }
}
