import request from "supertest"
import app from "../../src/app"
import { User } from "../../src/entity/User"
import { AppDataSource } from "../../src/config/data-source"
import { DataSource } from "typeorm"
import { truncateTables } from "../utils"

describe("POST /auth/register", () => {
    let connection: DataSource

    beforeAll(async () => {
        connection = await AppDataSource.initialize()
    })

    beforeEach(async () => {
        // Database truncate
        await truncateTables(connection)
    })

    afterAll(async () => {
        await connection.destroy()
    })

    describe("Given all fields", () => {
        it("should return the 201 status code", async () => {
            //   Arrange
            const userData = {
                firstName: "Braj",
                lastName: "Singh",
                email: "braj333singh@gmail.com",
                password: "secret",
            }
            //   ACT

            const response = await request(app)
                .post("/auth/register")
                .send(userData)

            //   Assert

            expect(response.statusCode).toBe(201)
        })

        it("should return valid json response", async () => {
            //   Arrange
            const userData = {
                firstName: "Braj",
                lastName: "Singh",
                email: "braj333singh@gmail.com",
                password: "secret",
            }
            //   ACT

            const response = await request(app)
                .post("/auth/register")
                .send(userData)

            //   Assert  application/json/utf-8

            expect(response.headers["content-type"]).toEqual(
                expect.stringContaining("json"),
            )
        })

        it("should persist the user in database", async () => {
            //   Arrange
            const userData = {
                firstName: "Braj",
                lastName: "Singh",
                email: "braj333singh@gmail.com",
                password: "secret",
            }
            //   ACT

            await request(app).post("/auth/register").send(userData)

            //   Assert

            const userRepository = connection.getRepository(User)
            const users = await userRepository.find()
            expect(users).toHaveLength(1)
            expect(users[0].firstName).toBe(userData.firstName)
            expect(users[0].lastName).toBe(userData.lastName)
            expect(users[0].email).toBe(userData.email)
        })
    })

    describe("Fields are missing", () => {})
})
