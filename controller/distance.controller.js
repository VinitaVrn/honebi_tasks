import {prisma} from "../index.js";
import { findDistance,getcoordinates,deduplicateLocations} from "./getdistance.js";

export const savelocations=async(req,res)=>{
    const { destination1, destinations } = req.body;

    if (!destination1 || !Array.isArray(destinations) || destinations.length === 0) {
      return res.status(400).json({ msg: "Start point and destinations are required." });
    }
  
    try {
      const allNames = [destination1, ...destinations];
      const locationdetails = [];
  
      for (const name of allNames) {
        const coords = await getcoordinates(name);
        const { lat: lat, lon: lon } = coords;
  
        // const existing = await client.query("select * from locations where name = $1", [name]);
        // if (existing.rows.length === 0) {
        //   await client.query(
        //     "insert into locations(name, lat, long) values($1, $2, $3)",
        //     [name, lat, lon]
        //   );
        // }
        const existing=await prisma.location.findFirst({
            where:{name}
        })
        if(!existing){
            await prisma.location.create({
                data:{
                    name,
                    lat,
                    lon
                }
            });
        }
        locationdetails.push({ name, lat, lon });
      }
  
      res.status(200).json({ msg: "Locations saved", locationdetails });
  
    } catch (err) {
      console.error("Error saving locations:", err);
      res.status(500).json({ error: "Failed to save locations" });
    }
  };





export const Routes=async(req,res)=>{
    const startpoint=req.query.start.toLowerCase();
    const destinations=req.query.destinations;

    if(!startpoint||!destinations){
        return res.status(400).json({msg:"Bad request"})
    }
    try{
        const destinationsname=destinations.split(",").map(name => name.trim().toLowerCase());
        console.log("Requested destinations:", destinationsname);
        let  allLocations=await prisma.location.findMany()
        allLocations = deduplicateLocations(allLocations);

        let current=allLocations.find(ele =>ele.name.toLowerCase()===startpoint)
        if (!current) {
            return res.status(404).json({ error: "Start location not found in DB" });
        }
        const targetedlocations=allLocations.filter(loc =>
            destinationsname.includes(loc.name.toLowerCase())
          );
          console.log("Matched in DB:", targetedlocations.map(l => l.name));
        const visited = [current.id];
        const route = [current];

        while(route.length < targetedlocations.length + 1){
            const rem=targetedlocations.filter(loc =>!visited.includes(loc.id));

            let nearestlocation=null;
            let nearestDistance=Infinity;

            for (const loc of rem) {
                const dist = findDistance(current.lat, current.lon, loc.lat, loc.lon);
                if (dist < nearestDistance) {
                  nearestDistance = dist;
                  nearestlocation = loc;
                }
              }
              
              if (!nearestlocation) {
                break; 
              }
            console.log(nearestDistance,nearestlocation)
            visited.push(nearestlocation.id)
            route.push(nearestlocation)
            current=nearestlocation;
        }
       
        const routecordinates=route.map(loc => ({name:loc.name,lat:loc.lat,lon:loc.lon}));
        res.status(200).json({result:routecordinates})
        
    }catch(err){
        console.error(err);
        res.status(500).json({ error: "Server error" ,message:err.message});
    }
    
}