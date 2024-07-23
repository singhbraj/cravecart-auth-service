import { checkSchema } from "express-validator"

export default checkSchema({
    email: {
        trim: true,
        errorMessage: "Email is required!",
        notEmpty: true,
    },
    firstName: {
        errorMessage: "First name is required!",
        notEmpty: true,
        trim: true,
    },
})

// export default [body("eamil").notEmpty().withMessage("Email is required!")]
