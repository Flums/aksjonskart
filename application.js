//Default to last center and zoomlevel, set to Lillestrøm if no found
if (document.cookie.indexOf("zoom") >= 0) {
    var lastZoom = document.cookie.replace(/(?:(?:^|.*;\s*)zoom\s*\=\s*([^;]*).*$)|^.*$/, "$1");
} 
else {
    lastZoom = 10;
    document.cookie="zoom=" + lastZoom;
}
if (document.cookie.indexOf("mapcenter_lng") >= 0) {
    var lastcenter_lng= document.cookie.replace(/(?:(?:^|.*;\s*)mapcenter_lng\s*\=\s*([^;]*).*$)|^.*$/, "$1");
}
else {
    lastcenter_lng = 11.04;
}
if (document.cookie.indexOf("mapcenter_lat") >= 0) {
    var lastcenter_lat= document.cookie.replace(/(?:(?:^|.*;\s*)mapcenter_lat\s*\=\s*([^;]*).*$)|^.*$/, "$1");
}
else{
    lastcenter_lat= 59.95;  
}
  

var ressurser = new L.LayerGroup();
            
var poi = new L.LayerGroup();

var teiger = new L.FeatureGroup();

var topo2offline = L.tileLayer('tiles/{z}/{x}/{y}.jpg', {
    attribution: '', 
    maxZoom: 16
});

var topo2 = L.tileLayer('http://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo2&zoom={z}&x={x}&y={y}', {
    attribution: '', 
    maxZoom: 16
});

var basemaps = {
    "Topo2 (offline)": topo2offline,
    "Topo2": topo2
};

var overlays = {
    "Ressurser": ressurser,
    "POI": poi,
    "Teiger": teiger
};

var map = L.map('map', {
    center: [lastcenter_lat, lastcenter_lng], 
    zoom: lastZoom,
    layers: [topo2, ressurser, teiger, poi]
});



var drawControl = new L.Control.Draw({
    edit: {
            featureGroup: teiger
    }
});

map.addControl(drawControl);

L.control.layers(basemaps, overlays).addTo(map);

map.on('draw:created', function (e) {
    var type = e.layerType,
        layer = e.layer;

    if (type === 'marker') {
        layer.bindPopup('A popup!');
    }
    var shape = layer.toGeoJSON();
    console.log(shape);

    teiger.addLayer(layer);
});

//Save map position and zoomlevel to a cookie so that page reloads don't move the map
map.on('zoomend', function (e) { 
    var zoom = map.getZoom();
    document.cookie="zoom=" + zoom; 
    console.log(">Zoom: " + zoom);
});

map.on('moveend', function (e) { 
    var mapcenter = map.getCenter();
    document.cookie="mapcenter_lng=" + mapcenter.lng;
    document.cookie="mapcenter_lat=" + mapcenter.lat;
});


var gpx = "rundt.gpx";

new L.GPX(gpx, {
    async: true
}).addTo(map);
          
          


//var marker2 = L.marker([59.916064, 11.72], {icon: redcross}).addTo(map);
L.geoJson(geojsonFeature).addTo(poi);
L.geoJson(geojsonFeature2).addTo(poi);