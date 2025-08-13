import { Router } from "express";
import { UpdateMetaDataSchema } from "../../types/types";
import db from "@repo/db/db";
import { userMiddleware } from "../../middlewares/user";

export const userRouter=Router();

userRouter.post("/metadata",userMiddleware,(req,res)=>{
    const parsedData =UpdateMetaDataSchema.safeParse(req.body);
    if(!parsedData.success){
        res.status(400).json({message:"Validation failed"});
        return;
    }
    db.user.update({
        where:{
            id:req.userId
        },
        data:{
            avatarId:parsedData.data.avatarId
        }
    })

    res.json({message:"Metadata Updated"})
})

userRouter.get("/metadata/bulk",async (req,res)=>{
    const useridstring=(req.query.ids ?? "[]") as string;
    const userIds=useridstring.slice(1,useridstring?.length-2).split(",")

    const metadata=await db.user.findMany({
        where:{
            id:{
                in:userIds
            }
        },select:{
            avatar: true
        }
    })

    res.json({
        avatars:metadata.map(m=>({
            userIds:m.avatar?.id,
            avatarId:m.avatar?.imageUrl
        }))
    })
})