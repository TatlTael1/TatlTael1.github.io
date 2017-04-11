var i = 1;
var pgons = {};
var geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

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

var projection = L.tileLayer.wms('https://t0.ads.astuntechnology.com/open/osopen/service', {
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
map.setView([50.3755, -4.1387], 10);
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

var lineLatlngs = [[50.376429, -4.139996], [50.378029, -4.139996]];

var lcontrol = L.control.layers(baseMap, pgons).addTo(map);

var polyline = L.polyline(lineLatlngs, {color: 'red'}).addTo(map);

omnivore.csv('csv/CMPT.csv').addTo(map);

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


document.getElementById("fileUpload").onclick = function(e){ //When you click the submit button...
	var files = document.getElementById('file').files; //...It takes the file you give it
	if (files.length == 0) { //But if you don't provide a file...
	  return; //...Do nothing
  }
  
  var file = files[0]; //Take the file provided and select the first in the array it gives
  
  if (file.name.slice(-3) != 'zip'){ //Test for .zip. All others, return.
		document.getElementById('warning').innerHTML = 'Select .zip file';  //If a .zip isn't given, push a message to the user	
    return;
  } else {
  	document.getElementById('warning').innerHTML = ''; //Clear the warning message if any was given
    handleZipFile(file); //Call the handleZipFile function and pass it the file we submitted
  }
};

//More info: https://developer.mozilla.org/en-US/docs/Web/API/FileReader <-- HTML5 FileReader 
function handleZipFile(file){
	var reader = new FileReader(); //Create a new instance of the FileReader
  reader.onload = function(){ //When the reader loads up...
	  if (reader.readyState != 2 || reader.error){ //...Check if it is ready, if not, throw an error
		  return;
	  } else { //...But if it is ready, call the convert to layer function and pass the result to it
		  convertToLayer(reader.result);
  	}
  }
  reader.readAsArrayBuffer(file); //Buffer the .zip file into an array
}

function convertToLayer(buffer){ //Take the buffered file and convert it into a GeoJSON format, then add it to the map (Uses shapefile-js and leaflet.shapefile by calvinmetcalf)
	shp(buffer).then(function(geojson){	//More info: https://github.com/calvinmetcalf/shapefile-js
    var layer = L.shapefile(geojson, { //Pass the shapefile to the new layer as a geoJSON file, and use the onEachFeature setting to bind the properties from the .dbf file to each marker, then place them on the map
        pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, geojsonMarkerOptions);
    },
      onEachFeature: function(feature, layer) {
        if (feature.properties) {
          layer.bindPopup(Object.keys(feature.properties).map(function(k) {
            return k + ": " + feature.properties[k] ;
          }).join("<br />"),{maxHeight:200});
        }
      }}).addTo(map);//More info: https://github.com/calvinmetcalf/leaflet.shapefile
    console.log(layer); //Log the layer details in the console to check it works correctly
  });
  
}