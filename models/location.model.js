import {client} from "../index.js";

export const locationTable= async()=>{
    try{
        await client.query(`create table  if not exists locations(
      id SERIAL primary key,
      name text NOT NULL,
      lat double precision NOT NULL,
      long double precision NOT NULL
    );`)
        console.log("Table created")
    }
    catch(err){
        console.log("err creating table",err.message)
    }
}