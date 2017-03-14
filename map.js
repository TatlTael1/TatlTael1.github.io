var i = 1;

function clearMap() {
    for(i in map._layers) {
        if(map._layers[i]._path != undefined) {
            try {
                map.removeLayer(map._layers[i]);
                console.log(map._layers);
            }
            catch(e) {
                console.log("problem with " + e + map._layers[i]);
            }
        }
    }
}

map = L.map('map', { //Create the map and choose a center point and zoom level
    center: [50.3755, -4.1427],
    zoom: 17
});

L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { //Create a tile layer using OpenStreetMap data
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>', //Give the copyright in the lower right of the map
}).addTo(map); //Place it on the map

// create a red polygon from an array of LatLng points
var latlngs = [[50.376429, -4.139996],[50.375889, -4.141241],[50.374989, -4.141680],[50.373850, -4.139950],[50.373800, -4.138550],[50.377089, -4.136150],[50.377089, -4.138673]];

var latlngs2 = [[50.376729, -4.139996],[50.375889, -4.141241],[50.374989, -4.141680],[50.373850, -4.139950],[50.373800, -4.138550],[50.377089, -4.136150],[50.377089, -4.138673]];

function switchRender() {
    switch (document.querySelector('input[name="renderOption"]:checked').value) {
        case 'red':
            var polygon1 = L.polygon(latlngs, {color: 'red'});
            var polyNumber = "Polygon" + i;
            var pgons = {
                [polyNumber] : polygon1
            };
            //map.addLayer(polygon1);
            var lcontrol = L.control.layers(pgons).addTo(map);
            var pName = "Polygon " + i;
            lcontrol.addOverlay(polygon1, pName);
            i++;
            console.log(map._layers);
            break;
        case 'green':
            //clearMap();
            var polygon2 = L.polygon(latlngs2, {color: 'green'});
            var polyNumber = "Polygon" + i;
            var pgons = {
                [polyNumber] : polygon2
            };
            //map.addLayer(polygon1);
            var lcontrol = L.control.layers(pgons).addTo(map);
            var pName = "Polygon " + i;
            lcontrol.addOverlay(polygon2, pName);
            i++;
            console.log(map._layers);
            break;
        case 'blank':
            //clearMap();
            if(map.polygon1 != undefined){
                map.removeLayer(polygon1);
            }
            var polygon1 = L.polygon(latlngs, {color: '', opacity: 0, fillOpacity: 0}).addTo(map);
            break;
    }
    // zoom the map to the polygon
    map.fitBounds(polygon1.getBounds());
}
