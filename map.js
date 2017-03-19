var i = 1;
var pgons = {};

function showPatternTypes() {
  if(document.getElementById('patternType').style.visibility == 'hidden'){
    document.getElementById('patternType').style.visibility = 'visible';
  } else {
    document.getElementById('patternType').style.visibility = 'hidden';
  }
}

map = L.map('map', { //Create the map and choose a center point and zoom level
    center: [50.3755, -4.1387],
    zoom: 17
});

L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { //Create a tile layer using OpenStreetMap data
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>', //Give the copyright in the lower right of the map
}).addTo(map); //Place it on the map

// create a red polygon from an array of LatLng points
var latlngs = [[50.376429, -4.139996],[50.375889, -4.141241],[50.374989, -4.141680],[50.373850, -4.139950],[50.373800, -4.138550],[50.377089, -4.136150],[50.377089, -4.138673]];

var latlngs2 = [[50.376229, -4.134996],[50.374989, -4.135761],[50.374759, -4.134861],[50.374950, -4.134450],[50.37590, -4.133950]];

var lcontrol = L.control.layers(null, pgons).addTo(map);
var stripes = new L.StripePattern(); stripes.addTo(map);

function switchRender() {
    if(document.getElementById("polyName").value == "") {
        alert("Please enter a name!");
    } else {    
        switch (document.querySelector('input[name="renderOption"]:checked').value) {
        case 'red':
            var polygon1 = L.polygon(latlngs, {color: 'red'});
            var polyNumber = "Polygon" + i;
            pgons[polyNumber] = polygon1;
            //map.addLayer(polygon1);
            
            var pName = document.getElementById("polyName").value;
            lcontrol.addOverlay(polygon1, pName);
            i++;
            console.log(map._layers);
            break;
        case 'green':
            //clearMap();
            var polygon2 = L.polygon(latlngs2, {color: 'green'});
            var polyNumber = "Polygon" + i;
            pgons[polyNumber] = polygon2;
            //map.addLayer(polygon1);
            var pName = document.getElementById("polyName").value;
            lcontrol.addOverlay(polygon2, pName);
            i++;
            console.log(map._layers);
            break;
        case 'pattern':
            switch (document.querySelector('input[name="patternOption"]:checked').value) {
              case 'stripe':
                var polygon3 = L.polygon(latlngs, {fillPattern: stripes});
                var polyNumber = "Polygon" + i;
                pgons[polyNumber] = polygon3;
                //map.addLayer(polygon1);
            
                var pName = document.getElementById("polyName").value;
                lcontrol.addOverlay(polygon3, pName);
                i++;
                console.log(map._layers);
                break;
              case 'circle':
                var shape = new L.PatternCircle({x: 15, y: 15, radius: 15, fill: true});
                var pattern = new L.Pattern({width: 50, height: 50}); 
                pattern.addShape(shape); 
                pattern.addTo(map);
                var polygon3 = L.polygon(latlngs, {fillPattern: pattern});
                var polyNumber = "Polygon" + i;
                pgons[polyNumber] = polygon3;
                //map.addLayer(polygon1);
            
                var pName = document.getElementById("polyName").value;
                lcontrol.addOverlay(polygon3, pName);
                i++;
                console.log(map._layers);
                break;
            }
            break;
    }
        // zoom the map to the polygon
        map.fitBounds(polygon1.getBounds());
    }
    
}
