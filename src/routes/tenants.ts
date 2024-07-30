import express from "express"

const router = express.Router()

router.post("/", (req, res) => {
    console.log(req)
    res.status(201).json({})
})

export default router
