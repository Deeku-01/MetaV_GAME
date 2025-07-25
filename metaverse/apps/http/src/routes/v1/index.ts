import { Router } from "express";
import { userRouter } from "./user";
import { spaceRouter } from "./space";
import { adminRouter } from "./admin";

export const router=Router();


router.post("/signup",(req,res)=>{
    res.json({
        message:"SignUp"
    })
})

router.post("/signin",(req,res)=>{
    res.json({
        message:"SignIn"
    })
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