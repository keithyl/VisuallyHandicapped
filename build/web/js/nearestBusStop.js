/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var map;
var service;
var marker;
var pos;
var infowindow;
var geocoder;
var markersArray = new Array();
var gmarkers = [];
var hasBoarded = false;
var shakeDetected = false;
var serviceNo, stopID, sequenceNo, busStopName;

function initialize() {
    geocoder = new google.maps.Geocoder();
    var mapOptions = {
        zoom: 17,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        panControl: false,
        streetViewControl: false,
        mapTypeControl: false
    };

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    callGeolocation();
    
    //HTML5 geolocation - throw into function
    function callGeolocation() {
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(function(position) {
                var lat = position.coords.latitude;
                var lng = position.coords.longitude;
                var myLocation = new google.maps.LatLng(lat, lng);
                geocoder.geocode({'latLng': myLocation}, function(results, status) {
                    if (status === google.maps.GeocoderStatus.OK) {
                        if (results[1]) {
                            removeMarkers();
                            map.setZoom(18);
                            marker = new google.maps.Marker({
                                position: myLocation,
                                draggable: false,
                                //animation: google.maps.Animation.DROP,
                                map: map
                            });
                            gmarkers.push(marker);
                        } else {
                            alert('No results found');
                        }
                    }
                });
                pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

                var request = {
                    //pos is the coordinates of the nearest bus stop
                    location: pos,
                   
                    radius: 150,
                    types: ['bus_station']
                };

                map.setCenter(pos);
               
                infowindow = new google.maps.InfoWindow();
                var service = new google.maps.places.PlacesService(map);
               
                service.nearbySearch(request, callback);
            }, function() {
                handleNoGeolocation(true);
            });
        } else {
            handleNoGeolocation(false);
        }
    }

    function callback(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            //for (var i = 0; i < results.length; i++) {
                createMarker(results[i]);
            //}
        }
    }
    
    function createMarker(place) {
        getBusArrival(place.place_id);
        var image = 'images/nearestbuses.png';
        var marker = new google.maps.Marker({
            map: map,
            //place.geometry.location will give the coordinates of the nearest bus stop
            position: place.geometry.location,
            icon: image            
        });
       
        google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent(place.name);
            infowindow.open(map, this);
        });
    }
    
        
    function getBusArrival(placeID) {
        var url= "https://busservices.firebaseio.com/stopsPlaceId/" + placeID + ".json";        
        console.log(url);
        $.getJSON(url, function(data) {
            busStopName = data.name;
            //bus stop ID is stopID
            stopID = data.stopId;
            //console.log(stopID);        
        });
    }

    function removeMarkers() {
        for (i = 0; i < gmarkers.length; i++) {
            gmarkers[i].setMap(null);
        }
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

