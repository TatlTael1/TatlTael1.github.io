var i = 1; //Variable used by the Switch Case I had set up to show polygon creation and the ability to change its colours, which isn't really needed
var pgons = {}; //Same as above

var data; //Variable that gets used by the loadCSV() function which holds the values of the loaded CSV file

var geojsonMarkerOptions = { //This is used by the SHP file code to change the look of the markers
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

function showPatternTypes() { //Used with some of the inputs to show/hide the pattern example buttons, not really needed
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
//Configure the tileLayer for the map using a projected map source
var projection = L.tileLayer.wms('https://t0.ads.astuntechnology.com/open/osopen/service', {
            layers: 'osopen',
            format: 'image/png',
            maxZoom: 14,
            minZoom: 0,
            continuousWorld: true,
            attribution: 'Astun Data Service &copy; Ordnance Survey.'
        });


// Define a standard Leaflet map specifying our crs instance and define a WMS base map
var map = new L.Map('map', {
    crs: crs,
    continuousWorld: true,
    worldCopyJump: false,
    layers: [projection]
});


// Centre on Plymouth 
map.setView([50.3755, -4.1387], 10);
var stripes = new L.StripePattern(); stripes.addTo(map);
//Initialize the StyleEditor, not really needed
/*var styleEditor = L.control.styleEditor({
    position: "topleft",
    colorRamp: ["#1abc9c","#2ecc71","#3498db","#9b59b6","#34495e","#16a085","#27ae60","#2980b9","#8e44ad","#2c3e50","#f1c40f","#e67e22","#e74c3c","#ecf0f1","#95a5a6","#f39c12","#d35400","#c0392b","#bdc3c7","#7f8c8d"],
    markers: ['circle-stroked', 'circle', 'square-stroked', 'square']
});
map.addControl(styleEditor);*/

L.control.locate().addTo(map); //Add the location service to the map

var baseMap = {
  "Projection" : projection, //Define the projection tileLayer as a baseMap for use in the map control
}

// Latlng points for use with the hardcoded Polygons I created, not really needed except for demo purposes
var latlngs = [[50.376429, -4.139996],[50.375889, -4.141241],[50.374989, -4.141680],[50.373850, -4.139950],[50.373800, -4.138550],[50.377089, -4.136150],[50.377089, -4.138673]];

var latlngs2 = [[50.376229, -4.134996],[50.374989, -4.135761],[50.374759, -4.134861],[50.374950, -4.134450],[50.37590, -4.133950]];

var lineLatlngs = [[50.376429, -4.139996], [50.378029, -4.139996]];

var polyline = L.polyline(lineLatlngs, {color: 'red'}); //Creates a line to use as an example of line creation

var lcontrol = L.control.layers(baseMap, pgons).addTo(map); //Creates the layer control and adds the basemap and and polygons stored in the pgons varible to the map

//This was used to put the line on the map but wasn't needed
//lcontrol.addOverlay(polyline, "Line");
//polyline.addTo(map);

//This was used by the original setup I had, which allowed creation of polygons by selecting different button options, isn't needed with the CSV now in place
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

/* This all works with inserting a SHP file, it's commented out as I commented out the input it worked with in the index.html file since I didn't need it right away and it errored so this got commented as a result
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
      lcontrol.addOverlay(layer, "Markers");
    console.log(layer); //Log the layer details in the console to check it works correctly
  });
  
}
*/

//Code to deal with loading and using CSV Files
function loadCSV(evt) { //Function that is called when a file is loaded into the File button
 
    var file = evt.target.files[0]; //Gets the file
 
    Papa.parse(file, { //Uses the Papa.Parse library (open source and included) to parse the file given in to an array of objects to be used
      header: true, //Makes the first line of the CSV file into the headers, allowing for columns and rows (each object is a new row)
      dynamicTyping: true, //Makes numbers become Ints rather than strings
      complete: function(results) { //Function to be used when the file is done parsing
        data = results.data; //Get the data from the CSV file and store it in the data variable (above) 
        console.log(data); //Log the data for testing purposes
      }
    });
}

$(document).ready(function(){ //A little JQuery that watches the csv-file button and waits for a change, calling the loadCSV function when it does
    $("#csv-file").change(loadCSV);
  });

function createPolygon() { //The function that creates the polygon for testing purposes, code here is relevant however
    var styleID = document.getElementById("styleNumber").value; //This gets the style ID that the user has given, will be taken from the polygon/polyline etc. itself when that is created
    var result = data.filter(function (obj ) { //Filter out the object (Style pattern) that has the ID given
        return obj.id == styleID; //Return the object data that has the same ID as the one supplied
    })
    var fillColour = "fill.colour"; //This is done because the header name contains a . (fill.colour) and Javascript reads that as colour is the name you're searching for, so it needs to be made into a string...
    var colour = result[0][fillColour]; //... And then the string you made is used here, using bracket notation instead of dot notation, so the variable can be used to search (is the same as result[0]."fill.colour")
    var hexColour = convertMMColourToHex(colour); //Passes the retrieved colour value to a conversion function to receive it in a hex value
    console.log(colour); //Logs the colour number from the CSV for testing
    console.log(hexColour); //Logs the converted hex value for testing
    var polygon1 = L.polygon(latlngs, {color: hexColour}); //Creates a polygon using the first set of hardcoded latlngs, and uses the converted colour to style it
    var polyNumber = "Polygon1"; //A number to be given to the pgons function to label the polygon, testing purposes
    pgons[polyNumber] = polygon1; //Places the polygon inside the pgons function
    //map.addLayer(polygon1);
    
    //var pName = document.getElementById("polyName").value;
    var pName = result[0].name; //Names the polygon using the name from the CSV file
    lcontrol.addOverlay(polygon1, pName); //Adds the Polygon to the layer control
    polygon1.addTo(map); //Then places it on the map
}

//Courtesy of Dom, we have the RGB number conversion (I suck at maths so he helped)
function convertMMColourToHex(colourNum) {
    var bValue = Math.floor(colourNum / (256*256));
    colourNum %= 256*256;    
    
    var gValue = Math.floor(colourNum / 256);
    colourNum %= 256;
    
    var rValue = colourNum;  
    
    console.log("R: " + rValue + " G: " + gValue + " B: " + bValue); //Log each value to ensure it is working correctly
    
    var hexColour = rgbToHex(rValue, gValue, bValue); //Send the RGB values to be converted into a hex value
    return hexColour; //Pass the new hex value back to the polygon creation function
    
}

 function componentToHex(c) { //Called to turn a passed number into a hex equivalent
    var hex = c.toString(16); //Takes the number and converts it into a string (the 16 is because it is a hex value)
    return hex.length == 1 ? "0" + hex : hex; //Will check and append any necessary 0's and pass back the hex value of the number given
}
    
function rgbToHex(r, g, b) { //Called and passed the RGB values calculated in the previous function
    console.log("#" + componentToHex(r) + componentToHex(g) + componentToHex(b)); //Log the hex number for testing purposes
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b); //Return the new hex value (each number is individually passed to the component to hex function, so that it is done correctly)
} 
