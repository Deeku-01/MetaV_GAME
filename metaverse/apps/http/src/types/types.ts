import z from "zod";

export const SignUpSchema =z.object({
    username:z.string().email(),
    password:z.string().min(8),
    type:z.enum(["user","admin"]),
})

export const SignInSchema =z.object({
    username:z.string().email(),
    password:z.string().min(8),
})

export const UpdateMetaDataSchema=z.object({
    avatarId:z.string()
})

export const DeleteElementSchema = z.object({
    id: z.string(),
})

export const CreateSpaceSchema=z.object({
    name:z.string(),
    dimensions:z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/),
    mapId:z.string()
})

export const AddanElementSchema=z.object({
    spaceId:z.string(),
    elementId:z.string(),
    x:z.number(),
    y:z.number(),
})

export const CreateElementSchema =z.object({
    imageUrl:z.string(),
    width:z.number(),
    height:z.number(),
    static:z.boolean()
})

export const UpdateElementSchema=z.object({
    imageUrl:z.string()
})

export const CreatAvatarSchema=z.object({
    name:z.string(),
    imageUrl:z.string()
})

export const CreateMapSchema=z.object({
    thumbnail:z.string(),
    dimensions:z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/),
    defaultElements:z.array(z.object({
        elementId:z.string(),
        x:z.number(),
        y:z.number()
    }))
})


declare global
{
    namespace Express{
        export interface Request{
            roel?:"Admin" | "User",
            userId?:string
        }
    }
}



