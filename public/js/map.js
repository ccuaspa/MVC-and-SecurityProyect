/*document.addEventListener('DOMContentLoaded', function () {
    // Verifica si el contenedor existe en el DOM
    var mapContainer = document.getElementById('main_map');

    if (mapContainer) {
        // Centra el mapa en Bogotá
        var map = L.map('main_map').setView([4.61044, -74.08175], 13);  // Coordenadas de Bogotá

        // Capa del mapa con OpenStreetMap
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        // Marcadores en tres ubicaciones diferentes de Colombia
        var locations = [
            { coords: [4.61044, -74.08175], label: 'Bogotá' },          // Bogotá
            { coords: [4.61044, -74.07000], label: '' },     
            { coords: [4.51044, -74.08175], label: '' }   
        ];

        // Agregar los marcadores al mapa
        locations.forEach(function(location) {
            L.marker(location.coords).addTo(map)
              .bindPopup(location.label);  // Muestra el nombre de la ciudad al hacer clic
        });
    } else {
        console.error("El contenedor del mapa no se encuentra en el DOM.");
    }

    L.marker([4.61044, -74.08175]).addTo(map)
    L.marker([4.61044, -74.07500]).addTo(map)
    L.marker([4.59044, -74.08175]).addTo(map)
*/
document.addEventListener("DOMContentLoaded", function(){
    var map = L.map("main_map").setView([4.61044, -74.08175],13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    L.marker([4.61044, -74.08175]).addTo(map)

    $.ajax({
        dataType: "json",
        url: "api/bicicletas",
        success: function(result){
            console.log(result);
            result.bicicletas.forEach(function(bici){
                L.marker(bici.ubicacion, {title: bici.code}).addTo(map);
    
            });
        }
    })  
});

