import express from 'express';
import { router as v1Router } from './routes/v1'

const app=express();

app.use(express.json())
app.use("/api/v1",v1Router)

const PORT=process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log("Now listening on http://localhost:"+PORT)
})