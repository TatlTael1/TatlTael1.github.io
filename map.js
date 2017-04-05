var i = 1;
var pgons = {};

function showPatternTypes() {
  if(document.getElementById('patternType').style.visibility == 'hidden'){
    document.getElementById('patternType').style.visibility = 'visible';
  } else {
    document.getElementById('patternType').style.visibility = 'hidden';
  }
}


//27700

// Define a Proj4Leaflet crs instance configured for British National Grid
// (EPSG:27700) and the resolutions of our base map
var crs = new L.Proj.CRS(
    'EPSG:27700',
    '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +datum=OSGB36 +units=m +no_defs',
    {
        resolutions: [1600,800,400,200,100,50,25,10,5,2.5,1,0.5,0.25,0.125,0.0625]
    }
);

var projection = L.tileLayer.wms('http://t0.ads.astuntechnology.com/open/osopen/service', {
            layers: 'osopen',
            format: 'image/png',
            maxZoom: 14,
            minZoom: 0,
            continuousWorld: true,
            attribution: 'Astun Data Service &copy; Ordnance Survey.'
        });


// Define a standard Leaflet map specifying our crs instance and define a WMS
// base map
var map = new L.Map('map', {
    crs: crs,
    continuousWorld: true,
    worldCopyJump: false,
    layers: [projection]
});


// Centre on Plymouth zoom to the maximum extent
map.setView([50.3755, -4.1387], 8);
var stripes = new L.StripePattern(); stripes.addTo(map);
//Initialize the StyleEditor
var styleEditor = L.control.styleEditor({
    position: "topleft",
    colorRamp: ["#1abc9c","#2ecc71","#3498db","#9b59b6","#34495e","#16a085","#27ae60","#2980b9","#8e44ad","#2c3e50","#f1c40f","#e67e22","#e74c3c","#ecf0f1","#95a5a6","#f39c12","#d35400","#c0392b","#bdc3c7","#7f8c8d"],
    markers: ['circle-stroked', 'circle', 'square-stroked', 'square']
});
map.addControl(styleEditor);

var baseMap = {
  "Projection" : projection,
}

// create a red polygon from an array of LatLng points
var latlngs = [[50.376429, -4.139996],[50.375889, -4.141241],[50.374989, -4.141680],[50.373850, -4.139950],[50.373800, -4.138550],[50.377089, -4.136150],[50.377089, -4.138673]];

var latlngs2 = [[50.376229, -4.134996],[50.374989, -4.135761],[50.374759, -4.134861],[50.374950, -4.134450],[50.37590, -4.133950]];

var lcontrol = L.control.layers(baseMap, pgons).addTo(map);


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
            polygon1.addTo(map);
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
    }
    
}
