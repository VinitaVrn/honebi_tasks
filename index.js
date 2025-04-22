import express from "express";
import { PrismaClient } from "./generated/prisma/index.js";
import { configDotenv } from "dotenv";
configDotenv();
import cors from "cors"

import { Routes,savelocations } from "./controller/distance.controller.js";
const app=express();
app.use(express.json());
app.use(cors());

const prisma=new PrismaClient();

export {prisma}

// const client=new Client({
//   user: process.env.pguser,
//   host: process.env.pghost,
//   database: process.env.pgdb,
//   password: process.env.pgpassword,
//   port: process.env.pgport
// })
// export {client}

app.get("/",(req,res)=>{
    res.send("hello")
})
app.post("/locations",savelocations)
app.get("/route",Routes)

app.listen(4444,async()=>{
    try{
        console.log("server started on http://localhost:4444")
        await prisma.$connect();
        console.log("db connected")
        
    }
    catch(err){
        console.error("DB connection error:", err); 
    }
    
})
