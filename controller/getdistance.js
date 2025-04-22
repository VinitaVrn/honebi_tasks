import { configDotenv } from "dotenv";
configDotenv();
import axios from "axios";
export const findDistance=(lat1,long1,lat2,long2)=>{
    const toRad = deg => (deg * Math.PI) / 180;
  const R = 6371; 

  lat1 = toRad(lat1);
  long1 = toRad(long1);
  lat2 = toRad(lat2);
  long2 = toRad(long2);

  const dLat = lat2 - lat1;
  const dLon = long2 - long1;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) *
    Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance= (R * c);
  return Number(distance.toFixed(2))
}

export const getcoordinates=async(cordinates)=>{
  const apikey=process.env.googleapikey;
  const url=`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(cordinates)}&key=${apikey}`;
   try{
    const response = await axios.get(url);
        if (response.data.status === 'OK') {
            const location = response.data.results[ 0 ].geometry.location;
            return {
                lat: location.lat,
                lon: location.lng
            };
        } else {
            throw new Error('Unable to fetch coordinates');
        }
   }catch(err){
    console.error(err);
    throw(err)
   }
}
function deduplicateLocations(locations) {
  const uniqueMap = new Map();
  for (const loc of locations) {
    const key = loc.name.toLowerCase();
    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, loc);
    }
  }
  return Array.from(uniqueMap.values());
}
export {deduplicateLocations}