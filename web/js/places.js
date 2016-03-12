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
    /*if (navigator.geolocation) {
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
        } */
    
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
                    location: pos,
                    radius: 100,
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

    function removeMarkers() {
        for (i = 0; i < gmarkers.length; i++) {
            gmarkers[i].setMap(null);
        }
    }

    function createMarker(place) {
        if (! hasBoarded) {
            // hard code to SMU SOA bus stop for testing
            getBusArrival('ChIJeT0RdqMZ2jERRobPHBNqyPM');
            //getBusArrival(place.place_id);
        }

        var image = 'images/nearestbuses.png';
        var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
            icon: image
        });

        google.maps.event.addListener(marker, 'click', function() {
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
    
    function getBusArrival(placeID) {
        var url= "https://busservices.firebaseio.com/stopsPlaceId/" + placeID + ".json";
        
        console.log(url);
        $.getJSON(url, function(data) {
            busStopName = data.name;
            $('#busStopName').html(busStopName + ' (' + data.stopId + ')');
            stopID = data.stopId;            
            serviceNo = $('#serviceNo').html();
            var busTimingUrl = "https://intelbus.herokuapp.com/?id=" + stopID + "&serviceNo=" + serviceNo;
            console.log(busTimingUrl);
            $.getJSON(busTimingUrl, function(busData) {
                if (busData[0].nextBus.duration === 'Arriving') {
                    $('#Duration1').html(busData[0].nextBus.duration);
                } else {
                    $('#Duration1').html(busData[0].nextBus.duration + ' Mins');
                }
                
                if (busData[0].subsequentBus.duration === 'Arriving') {
                    $('#Duration2').html(busData[0].subsequentBus.duration);
                } else {
                    $('#Duration2').html(busData[0].subsequentBus.duration + ' Mins');
                }
                //$('#Duration3').html(busData[0].subsequentBus3.duration);
            });

            highlightRoute();
        });
    }

    function highlightRoute() {
        // hardcoded 147 route to highlight route on map
        $.getJSON('147route.json', function(routes) {
            var polyline = new google.maps.Polyline({
                clickable: false,
                strokeColor: '#f01b48',
                strokeWeight: 8,
                strokeOpacity: .8
            });

            var latlngs = [];
            var currentStop = false;
            for (var i=0, l=routes.length; i<l; i++){
                var coord = routes[i];
                //hardcode to indicate starting position at SMU SOA bus stop
                if (coord === '1.2962224,103.8496698' || currentStop) {
                    currentStop=true;
                    var latlng = coord.split(',');
                    var position = new google.maps.LatLng(parseFloat(latlng[0], 10), parseFloat(latlng[1], 10));
                    latlngs.push(position);
                }
            }
            polyline.setPath(latlngs);
            polyline.setMap(map);
        });
    }

    // BOARDED BUS double click event
    $('body').dblclick(function() {
        hasBoarded = true;
        // callGeolocation();

        if (!shakeDetected) {
            // find boarding bus stop sequence number
            $.getJSON('https://busservices.firebaseio.com/147/route2/stops.json', function(data) {
                $.each(data, function(i) {
                    if(data[i].stopId === stopID) {
                        sequenceNo = i;
                    }
                });
                sequenceNo++;

                //remove table with bus arrival info
                $('#busTiming').remove();

                //add table to display next bus stop name
                $('.table-responsive').append('<table class="table table-hover" id="busStopName">\n\
                                            <tr><th width=15%>' + "Bus Onboard: " + '</th><td>' + serviceNo + '</td></tr>\n\
                                            <tr id="nextBusStop"><th>' + "Next Bus Stop: " + '</th><td id="nextBusStopCol"></td></tr>\n\
                                            </table>');
                getBusStopInfo();
                sequenceNo++;
            });
            
            simulateMovingBus();
        }
    });
    
    function simulateMovingBus() {
        //simulate moving bus by adding timeout of 5 seconds for each increment
        setTimeout(function () {    
            // get next bus stop name
            getBusStopInfo();
            sequenceNo++;
            
            // for mobile detecting shake event
            if (!shakeDetected) {
                simulateMovingBus();
            }


            // for testing on laptop to stop loop - shake detected
            if (sequenceNo === 37) {
                shakeDetected = true;
            }               
        }, 5000)
    }

    function getBusStopInfo() {
        //get next bus stop name
        var busStopInfoUrl = 'https://busservices.firebaseio.com/147/route2/stops/' + sequenceNo + '.json';
        $.getJSON(busStopInfoUrl, function(data) {
            var nextBusStop = data.name;
            console.log(nextBusStop);
            $('#nextBusStopCol').html(nextBusStop);

            //test for auto play next bus stop name
            var text = $('#nextBusStop').text();
            responsiveVoice.speak(text); 
        });
    }
    
    // tap once to play bus stop name after onboard the bus
    $('body').click(function() {
        if (hasBoarded && !shakeDetected) {
            var text = $('#nextBusStop').text();
            responsiveVoice.speak(text);
            
            // for chinese
            //responsiveVoice.speak(text, "Chinese Female");
        }
    });
    
    // eventlistener for shake event to indicate alighting
    var shakeEvent = new Shake({threshold: 15});
    shakeEvent.start();
    window.addEventListener('shake', function(){
        shakeDetected = true;
        if (hasBoarded && shakeDetected) {
           // alert('SHAKE DETECTED ALIGHTED');
            
            responsiveVoice.speak('Shake detected. Tap twice to confirm alighting from the bus');
            // play message - confirm alight, tap once for no, tap twice for yes
            $('body').dblclick(function() {
               //alert('CONFIRM ALIGHTED');

               responsiveVoice.speak('You have alighted from the bus');
               
               //redirect to main page
               window.location.replace(window.location.href);
            });
        }
    }, false);
}
google.maps.event.addDomListener(window, 'load', initialize);