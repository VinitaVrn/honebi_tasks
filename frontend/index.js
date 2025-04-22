document.addEventListener("DOMContentLoaded", () => {
    let map;

    function initMap() {
    const center = { lat: 12.9716, lng: 77.5946 }; 
    map = new google.maps.Map(document.getElementById("map"), {
      zoom: 12,
      center: center,
    });

    
    new google.maps.Marker({
      position: center,
      map: map,
      title: "Banglore"
    });
    }

    async function fetchRoute() {
        const destInputs = document.querySelectorAll(".destination");
  const allDestinations = Array.from(destInputs)
    .map(input => input.value.trim())
    .filter(val => val !== "");

  const destination1 = allDestinations[0];
  const destinations = allDestinations.slice(1);

  if (!destination1) {
    alert("Destination 1 is required.");
    return;
  }

  const destinationsParam = destinations.join(",");
  const response = await fetch(
    `http://localhost:4444/route?start=${encodeURIComponent(destination1)}&destinations=${encodeURIComponent(destinationsParam)}`
  );
  const result = await response.json();

  if (!result.result) {
    alert("Could not fetch route.");
    return;
  }

  const routeCoords = result.result;
  const path = routeCoords.map(p => ({ lat: p.lat, lng: p.lon }));

  const routeLine = new google.maps.Polyline({
    path: path,
    geodesic: true,
    strokeColor: "#FF0000",
    strokeOpacity: 1.0,
    strokeWeight: 2,
  });

  routeLine.setMap(map);

  // Clear old markers if needed (optional)
  if (window.routeMarkers) {
    window.routeMarkers.forEach(marker => marker.setMap(null));
  }
  window.routeMarkers = [];

  let labelIndex = 1; // Start from 1 for non-start markers

for (let i = 0; i < routeCoords.length; i++) {
  const point = { lat: routeCoords[i].lat, lng: routeCoords[i].lon };
  const placeName = routeCoords[i].name;

  const marker = new google.maps.Marker({
    position: point,
    map: map,
    label: i === 0 ? "S" : `${labelIndex++}`,
    title: i === 0 ? `Start: ${placeName}` : `Stop ${labelIndex - 1}: ${placeName}`
  });

  const infoWindow = new google.maps.InfoWindow({
    content: `<strong>${i === 0 ? "Start: " : `Stop ${labelIndex - 1}: `}${placeName}</strong>`
  });

  marker.addListener("click", () => {
    infoWindow.open(map, marker);
  });

  window.routeMarkers.push(marker);
}

   map.setCenter(path[0]);
        
    }

        let destinationCount = 1;

        function addDestination() {
        destinationCount++;
        const div = document.createElement("div");
        div.className = "input-group";
        div.innerHTML = `
        <label>Destination ${destinationCount}:</label>
        <input type="text" class="destination" placeholder="Enter destination" />
        `;
        document.getElementById("destinations").appendChild(div);
        }

    async function submitLocations() {
        const destInputs = document.querySelectorAll(".destination");
        const allDestinations = Array.from(destInputs)
    .map(input => input.value.trim())
    .filter(val => val !== "");

    const destination1 = allDestinations[0]; 
    const destinations = allDestinations.slice(1); 

  if (!destination1 || destinations.length === 0) {
    alert("Please enter atleat two destination.");
    return;
  }

  const response = await fetch("http://localhost:4444/locations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ destination1, destinations })
  });

  const result = await response.json();
  console.log(result);
  alert("Locations submitted and saved!");
}
window.initMap = initMap;
  window.addDestination = addDestination;
  window.submitLocations = submitLocations;
  window.fetchRoute = fetchRoute;
});