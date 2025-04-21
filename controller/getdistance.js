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

export const getlatlon=()=>{
    
}