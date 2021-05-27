var map = L.map('map').setView([15.6261, -61.44361], 13);

    var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    var dark = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
	maxZoom: 20,
	attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    });

var water = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 1,
	maxZoom: 16,
	ext: 'jpg'
    });

var googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
    });

var googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
    });

var buLayer = L.geoJson(bu_data, {style: {
    color: 'red',
    fillColor: 'blue',
    fillOpacity: '0.8'
    },
    onEachFeature: function (feature, layer) {
        layer.bindPopup("BU: "+ feature.properties.BU);
    }, 

    // filter: function(feature) {
    //     if(feature.properties.TYPE === 'MA_1')
    //         {return true;
    //         }
    // },
    
}).addTo(map);

var baseMaps = {
        'OSM':osm,
        'Dark Map': dark,
        'Water Color Map':water,
        'Google Streets Map': googleStreets,
        'Google Satellite Map':googleSat,
    };


var marker = L.marker([15.6261, -61.44361]).addTo(map)
    .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
    // .openPopup();

 var overlayMaps = {
        'Marker': marker,
        'Buildings': buLayer
    };

    L.control.layers(baseMaps, overlayMaps, {collapsed: false}).addTo(map);
    $('.layer-card-cb').on('change', function(){
        if($(this).is(':checked')){
            buLayer.addTo(map);
        } else {
            map.removeLayer(buLayer);
        }
    })
    // 
    $('.opacity').on('change', function(){
        var val = $(this).val();
        var opacity = val / 100;
        console.log(val);


        buLayer.setStyle({fillOpacity: opacity, opacity: opacity});
    });

    // var lpLayer = L.tileLayer.wms('http://localhost:8080/geoserver/wms?', {
    // layers: 'gis:LP_2020',
    // transparent: true,
    // format:('image/png')
    // }).addTo(map);


    // var BuLayer = L.tileLayer.wms('http://localhost:8080/geoserver/wms?', {
    // layers: 'gis:BU_2020',
    // transparent: true,
    // format:('image/png')
    // }).addTo(map);

    // var BuLayer = L.tileLayer.wms('http://localhost:8080/geoserver/wms?', {
    // layers: 'gis:DF_2020',
    // transparent: true,
    // format:('image/png')
    // }).addTo(map);


    // var BuLayer = L.tileLayer.wms('http://localhost:8080/geoserver/wms?', {
    // layers: 'gis:FL_2020',
    // transparent: true,
    // format:('image/png')
    // }).addTo(map);

    function handleLayer(layerName) {
        var layer = L.tileLayer.wms("http://localhost:8080/geoserver/wms?", {
        layers: layerName,
        transparent: true,
        format: "image/png",
        zIndex: 1000,
     });

        return layer;
    }

    //map scale
    L.control.scale().addTo(map);


    //Mouse Coordinates
    //mouse coordinate
    map.on("mousemove", function (e) {
        $(".map-coordinate").html(`Lat: ${e.latlng.lat}, Lng: ${e.latlng.lng}`);
    });

    // function handleLayer(layerName) {
    //     var layer = L.tileLayer.wms('http://localhost:8080/geoserver/wms?', {layer: layerName,
    //     transparent: true,
    //     format:('image/png'),
    //     });
    //     return layer;
    // }
    // handleLayer('gis:BU_2020').addTo(map);
    // handleLayer('gis:LP_2020').addTo(map);
    // handleLayer('gis:DF_2020').addTo(map);
    // handleLayer('gis:FL_2020').addTo(map);
    
    
    //Legend control function
    function wmsLegendControl(layerName, layerTitle) {
        var className = layerName.split(":")[1];
        console.log(className)
        var url = `http://localhost:8080/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&LAYER=${layerName}`;
        var legend = `<p class="${className}" style='margin-top:10px; font-weight: bold'>${layerTitle}</p>`;
        legend += `<p><img class="${className}" src=${url} /><br class=${layerName} /></p> `;
        return legend;

    }
    
    // layer Sidebar
    layersFromGeoserver.map((layer) => {
        $(".left-sidebar").append(
        layerCardGenerator(
            layer.layerTitle,
            layer.layerName,
            layer.defaultCheck,
            layer.thumbnailUrl,
            layer.description
        ));
    });
//Default layer on switch
layersFromGeoserver.map(layer => {
    if(layer.defaultCheck === 'checked'){
        handleLayer(layer.layerName).addTo(map);
        $('.legend').append(wmsLegendControl(layer.layerName, layer.layerTitle));
    }
});



//Opacity Control button
    $('.opacity').on('change', function() {
        var layerName = $(this).attr('code');
        
        var opacity = $(this).val() / 100;

        console.log(layerName, opacity);

        map.eachLayer(function(layer){
            if(layer.options.layers === layerName) {
                layer.setOpacity(opacity);
            }
        });
    });
// layer on/off switch
    $('.layer-card-cb').on('change', function(){
        var layerName = $(this).attr('id');
        var layerTitle = $(this).attr('name');
        
        if($(this).is(':checked')){
            window[layerName] = handleLayer(layerName).addTo(map);
            $(".legend").append(wmsLegendControl(layerName, layerTitle));

        } else{
            map.eachLayer(function (layer){
                if (layer.options.layers === layerName){
                    map.removeLayer(layer);
                }
                
            });
            var className = layerName.split(":")[1]
            $(`.legend .${className}`).remove();
        }
    }
    );


    //Default map view
    $(".default-view").on("click", function () {
  map.setView([15.6261, -61.44361], 15);
    });

    //View map in full browser
    function fullScreenToggler() {
        var doc = document,
        elm = document.getElementById("map");

    if (elm.requestFullscreen) {
        !doc.fullscreenElement ? elm.requestFullscreen() : doc.exitFullscreen();
        } else if (elm.mozRequestFullScreen) {
                !doc.mozFullScreen ? elm.mozRequestFullScreen() : doc.mozCancelFullScreen();
        } else if (elm.msRequestFullscreen) {
        !doc.msFullscreenElement
        ? elm.msRequestFullscreen()
        : doc.msExitFullscreen();
        } else if (elm.webkitRequestFullscreen) {
        !doc.webkitIsFullscreen
            ? elm.webkitRequestFullscreen()
        : doc.webkitCancelFullscreen();
        } else {
        console.log("Fullscreen support not detected.");
            }
    }

        $(".full-screen").click(fullScreenToggler);

    //Browser print
    L.control.browserPrint().addTo(map);
            $(".print-map").click(function () {
            var printMode = L.control.browserPrint.mode.landscape();
            map.printControl.print(printMode);
    });

    $(".leaflet-control-browser-print").css({
        display: "none",
    });