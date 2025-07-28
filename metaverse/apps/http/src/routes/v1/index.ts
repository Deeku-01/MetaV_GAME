import { Router } from "express";
import { userRouter } from "./user";
import { spaceRouter } from "./space";
import { adminRouter } from "./admin";
import { SignInSchema, SignUpSchema } from "../../types/types";
import bcrypt from 'bcrypt'
import { JWT_PASSWORD } from "../../config";
import db from "@repo/db/db";
import jwt from 'jsonwebtoken'

export const router=Router();

router.post("/signup", async (req, res) => {
    console.log("inside signup")
    // check the user
    const parsedData = SignUpSchema.safeParse(req.body)
    if (!parsedData.success) {
        console.log("parsed data incorrect")
        console.log(parsedData.error)
        res.status(400).json({message: "Validation failed"})
        return
    }

    const hashedPassword = await bcrypt.hash(parsedData.data.password,10)

    try {
         const user = await db.user.create({
            data: {
                username: parsedData.data.username,
                password: hashedPassword,
                role: parsedData.data.type === "admin" ? "Admin" : "User",
            }
        })
        res.json({
            userId: user.id
        })
    } catch(e) {
        console.log("erroer thrown")
        console.log(e)
        res.status(400).json({message: "User already exists"})
    }
})

router.post("/signin", async (req, res) => {
    const parsedData = SignInSchema.safeParse(req.body)
    if (!parsedData.success) {
        res.status(403).json({message: "Validation failed"})
        return
    }

    try {
        const user = await db.user.findUnique({
            where: {
                username: parsedData.data.username
            }
        })
        
        if (!user) {
            res.status(403).json({message: "User not found"})
            return
        }
        const isValid = await bcrypt.compare(parsedData.data.password, user.password)

        if (!isValid) {
            res.status(403).json({message: "Invalid password"})
            return
        }

        const token = jwt.sign({
            userId: user.id,
            role: user.role
        }, JWT_PASSWORD);

        res.json({
            token
        })
    } catch(e) {
        res.status(400).json({message: "Internal server error"})
    }
})

router.get("/elements",(req,res)=>{
    res.json({
        message:"elements"
    })
})

router.get("/avatars",(req,res)=>{
    res.json({
        message:"avatars"
    })
})

router.use("/user",userRouter)
router.use("/space",spaceRouter)
router.use("/admin",adminRouter);