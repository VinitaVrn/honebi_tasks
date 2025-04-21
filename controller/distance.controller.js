import {client} from "../index.js";
import { findDistance } from "./getdistance.js";

export const Route=async(req,res)=>{
    const startpoint=req.query.start.toLowerCase();

    if(!startpoint){
        return res.status(400).json({msg:"Bad request"})
    }
    try{
        const dbres=await client.query(`select * from locations`)
        const locations=dbres.rows

        let current=locations.find(ele =>ele.name.toLowerCase()===startpoint)
        if (!current) {
            return res.status(404).json({ error: "Start location not found in DB" });
        }

        const visited = [current.id];
        const route = [current];

        while(visited.length<locations.length){
            const rem=locations.filter(loc =>!visited.includes(loc.id));

            let nearestlocation=null;
            let nearestDistance=Infinity;

            for (const loc of rem) {
                const dist = findDistance(current.lat, current.long, loc.lat, loc.long);
                if (dist < nearestDistance) {
                  nearestDistance = dist;
                  nearestlocation = loc;
                }
              }
              
            
              console.log(nearestDistance,nearestlocation)
            visited.push(nearestlocation.id)
            route.push(nearestlocation)
            current=nearestlocation;
        }
       
        const routeNames=route.map(loc => (loc.name));
        res.status(200).json({result:routeNames})
        
    }catch(err){
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
    
}