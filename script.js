// INISIALISASI PETA
const map = L.map('map').setView([-6.2, 106.8], 12);

// BASEMAP OSM
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 20,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// MARKER START & END
let startMarker = null;
let endMarker = null;
let routeLayer = null;

// CLICK UNTUK BUAT START & END ROUTE
map.on("click", function (e) {
    if (!startMarker) {
        startMarker = L.marker(e.latlng).addTo(map);
    } else if (!endMarker) {
        endMarker = L.marker(e.latlng).addTo(map);
        getRoute(startMarker.getLatLng(), endMarker.getLatLng());
    } else {
        map.removeLayer(startMarker);
        map.removeLayer(endMarker);
        if (routeLayer) map.removeLayer(routeLayer);
        startMarker = L.marker(e.latlng).addTo(map);
        endMarker = null;
    }
});

// FUNGSI ROUTING OSRM
function getRoute(start, end) {
    const url = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            const coords = data.routes[0].geometry.coordinates;
            const latlngs = coords.map(([lng, lat]) => [lat, lng]);

            if (routeLayer) map.removeLayer(routeLayer);
            routeLayer = L.polyline(latlngs, { color: "blue", weight: 5 }).addTo(map);

            map.fitBounds(routeLayer.getBounds());
        })
        .catch(err => alert("Gagal memuat rute!"));
}

// SEARCH FUNCTION (Nominatim)
function searchLocation() {
    const q = document.getElementById("search").value;
    if (!q) return;

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data.length === 0) return alert("Lokasi tidak ditemukan!");

            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);

            map.setView([lat, lon], 16);
            L.marker([lat, lon]).addTo(map);
        });
}
