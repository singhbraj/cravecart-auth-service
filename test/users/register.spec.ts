import request from "supertest"
import app from "../../src/app"
import { User } from "../../src/entity/User"
import { AppDataSource } from "../../src/config/data-source"
import { DataSource } from "typeorm"
import { Roles } from "../../src/constants"

describe("POST /auth/register", () => {
    let connection: DataSource

    beforeAll(async () => {
        connection = await AppDataSource.initialize()
    })

    beforeEach(async () => {
        // Database truncate
        await connection.dropDatabase()
        await connection.synchronize()
        // await truncateTables(connection)
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

        it("should return an id of the created user", async () => {
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
            expect(response.body).toHaveProperty("id")
            const repository = connection.getRepository(User)
            const users = await repository.find()
            expect((response.body as Record<string, string>).id).toBe(
                users[0].id,
            )
        })

        it("should assign a customer role", async () => {
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
            expect(users[0]).toHaveProperty("role")
            expect(users[0].role).toBe(Roles.CUSTOMER)
        })

        it("it should store the hashed password in the database", async () => {
            //   Arrange
            const userData = {
                firstName: "Braj",
                lastName: "Singh",
                email: "braj333singh@gmail.com",
                password: "secret",
            }
            //   ACT

            await request(app).post("/auth/register").send(userData)

            //  Assert
            const userRepository = connection.getRepository(User)
            const users = await userRepository.find()
            expect(users[0].password).not.toBe(userData.password)
            expect(users[0].password).toHaveLength(60)
            expect(users[0].password).toMatch(/^\$2[a|b]\$\d+\$/)
        })

        it("should return 400 status code if email is already exists", async () => {
            //   Arrange
            const userData = {
                firstName: "Braj",
                lastName: "Singh",
                email: "braj333singh@gmail.com",
                password: "secret",
            }

            const userRepository = connection.getRepository(User)
            await userRepository.save({ ...userData, role: Roles.CUSTOMER })

            //   ACT
            const response = await request(app)
                .post("/auth/register")
                .send(userData)

            const users = await userRepository.find()
            //    Assert
            expect(response.statusCode).toBe(400)
            expect(users).toHaveLength(1)
        })
    })

    describe("Fields are missing", () => {
        it("should return 400 status code if email filed missing", async () => {
            //   Arrange
            const userData = {
                firstName: "Braj",
                lastName: "Singh",
                email: "",
                password: "secret",
            }

            // const userRepository = connection.getRepository(User)
            // await userRepository.save({ ...userData, role: Roles.CUSTOMER })

            //   ACT
            const response = await request(app)
                .post("/auth/register")
                .send(userData)

            // Assert

            expect(response.statusCode).toBe(400)
            const userRepository = connection.getRepository(User)
            const users = await userRepository.find()
            expect(users).toHaveLength(0)
        })
    })

    describe("Fileds are not in proper in proper format", () => {
        it("should trim the email field", async () => {
            // Arrange
            const userData = {
                firstName: "Braj",
                lastName: "Singh",
                email: " braj333singh@gmail.com",
                password: "secret",
            }
            // Act
            await request(app).post("/auth/register").send(userData)

            // Assert
            const userRepository = connection.getRepository(User)
            const users = await userRepository.find()
            const user = users[0]
            expect(user.email).toBe("braj333singh@gmail.com")
        })
    })
})
