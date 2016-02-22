var map;
var service;
var marker;
var pos;
var infowindow;
var geocoder;
var markersArray = new Array();
var gmarkers = [];

function initialize() {
geocoder = new google.maps.Geocoder();
    var mapOptions = {
        zoom: 18,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        panControl: false,
        streetViewControl: false,
        mapTypeControl: false,
    };

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    //HTML5 geolocation
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(function (position) {            
        var  lat  = position.coords.latitude;
        var  lng =  position.coords.longitude;
        var latlng = new google.maps.LatLng(lat, lng);
        var  myLocation =   new google.maps.LatLng(lat, lng);
      //document.getElementById("grid").value= myLocation.lat() + "," + myLocation.lng();
      geocoder.geocode({'latLng': myLocation}, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[1]) {
                //clearMarkers();
                removeMarkers(); 
                map.setZoom(18);
                marker = new google.maps.Marker({
                    position: myLocation,
                    draggable: false,
                    //animation: google.maps.Animation.DROP,
                    map: map
                });
                gmarkers.push(marker);
            //contentString = '<div id="iwContent">Lat: <span id="latbox">' + myLocation.lat() + '</span><br />Lng: <span id="lngbox">' + myLocation.lng() + '</span><br/><span id="addrbox">' + results[1].formatted_address + '</span></div>';
            //window.alert(results[1].formatted_address);
            //infoWindow.setContent(contentString);
            //infoWindow.open(map,marker);
            } else {
                alert('No results found');
            }
            
        } 
    });
            pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            /*
            infowindow = new google.maps.InfoWindow({
                map: map,
                position: pos,
                content: 'You Are Here'
            });*/

            var request = {
                location: pos,
                radius: 140,
                types: ['bus_station']
            };

            map.setCenter(pos);

            infowindow = new google.maps.InfoWindow();
            var service = new google.maps.places.PlacesService(map);
            service.nearbySearch(request, callback);

        },

        function () {
            handleNoGeolocation(true);
        });
    } else {
        handleNoGeolocation(false);
    }

    function callback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                createMarker(results[i]);
            }
        }
    }
    
    function removeMarkers(){
        for(i=0; i<gmarkers.length; i++){
            gmarkers[i].setMap(null);
        }
    }   

    function createMarker(place) {
        //deleteMarkers();
        var stopID;
        var busstopID;
        var placeLoc = place.geometry.location;
        //console.log("Place location: " + place.place_id);
        console.log(place.name);
        var url2 = "https://busservices.firebaseio.com/stopsPlaceId/" + place.place_id + ".json";
       
        $.getJSON(url2, function(data) {
            stopID = data.stopId;
            //console.log("stopID " + stopID);
            busTimingUrl = "https://intelbus.herokuapp.com/?id=" + stopID;
            //console.log(busstopID);
            $.getJSON(busTimingUrl, function(busData) {
                $.each(busData, function(i) {
                    console.log("DATA " + busData[i].nextBus.duration);
                    
                    var nextBusTiming = busData[i].nextBus.duration;
                    var bus2Timing = busData[i].subsequentBus.duration;
                    var bus3Timing = busData[i].subsequentBus3.duration;
                    
                    console.log("bus time: " + nextBusTiming);
                });
            });
        });
   
        var image = 'images/nearestbuses.png';
        var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
            icon: image
        });

        google.maps.event.addListener(marker, 'click', function () {
            infowindow.setContent(place.name);
            infowindow.open(map, this);
        });

    }
   
    function deleteMarkers() {
        if (markersArray) {
            for (i = 0; i < markersArray.length; i++) {
                markersArray[i].setMap(null);
            }
            markersArray.length = 0;
        }
    }

    }
google.maps.event.addDomListener(window, 'load', initialize);