import express from "express";
import pkg from "pg";
const {Client} = pkg
import { configDotenv } from "dotenv";
configDotenv();
import { locationTable } from "./models/location.model.js";
import { Route } from "./controller/distance.controller.js";
const app=express();

const client=new Client({
  user: process.env.pguser,
  host: process.env.pghost,
  database: process.env.pgdb,
  password: process.env.password,
  port: process.env.pgport
})
export {client}

app.get("/",(req,res)=>{
    res.send("hello")
})

app.get("/route",Route)

app.listen(6666,async()=>{
    console.log("server started on http://localhost:6666")
    try{
        await client.connect()
        console.log("db connected")
        await locationTable();
    }
    catch(err){
        console.log("Internal server error")
    }
    
})
