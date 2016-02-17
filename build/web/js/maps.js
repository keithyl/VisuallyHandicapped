var infoWindow;
var geocoder;
var address;
var map;
 
 function getLocation(){
geocoder = new google.maps.Geocoder();
      {
          if (navigator.geolocation)

          {

              var options = {
                  enableHighAccuracy: true,
                  timeout: 5000,
                  maximumAge: 0
              };
               
            

              navigator.geolocation.watchPosition( success, error,options);
          }
//test
          else

          { x.innerHTML= "Geolocation is not supported by this browser."; }
      }

  }

  function error(e) {

  console.log("error code:" + e.code + 'message: ' + e.message );

  }

  function success(position) {
     var  lat  = position.coords.latitude;
     var  lng =  position.coords.longitude;
     var latlng = new google.maps.LatLng(lat, lng);
     var  myLocation =   new google.maps.LatLng(lat, lng);
      document.getElementById("grid").value= myLocation.lat() + "," + myLocation.lng();
      geocoder.geocode({'latLng': myLocation}, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[1]) {
                map.setZoom(18);
                marker = new google.maps.Marker({
                    position: myLocation,
                    draggable: false,
                    //animation: google.maps.Animation.DROP,
                    map: map
                });
                    var request = {
          location: myLocation,
          radius: 120,
          types: ['bus_station']
        };
        infowindow = new google.maps.InfoWindow();
        service = new google.maps.places.PlacesService(map);
        service.search(request, callback);
            //contentString = '<div id="iwContent">Lat: <span id="latbox">' + myLocation.lat() + '</span><br />Lng: <span id="lngbox">' + myLocation.lng() + '</span><br/><span id="addrbox">' + results[1].formatted_address + '</span></div>';
            //window.alert(results[1].formatted_address);
            //infoWindow.setContent(contentString);
            //infoWindow.open(map,marker);
            } else {
                alert('No results found');
            }
            
        } 
    });

     var mapOptions = {
           center: new google.maps.LatLng(myLocation.lat(),myLocation.lng()),
          zoom: 18,
          mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      var map = new google.maps.Map(document.getElementById("map-canvas"),
              mapOptions);


      var marker = new google.maps.Marker({
          position: myLocation,
          map: map,
          title:"you are here"
      });
   
 //contentString = '<div id="iwContent">Lat: <span id="latbox">' + myLocation.lat() + '</span><br />Lng: <span id="lngbox">' + myLocation.lng() + '<span id="addrbox>' + address + '</span></div>';
  /*infoWindow.setContent(contentString);
    infoWindow.open(map,marker);*/
  }
  function callback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
          }
        }
      }

      function createMarker(place) {
      
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location
        });
        var content='<strong style="font-size:1.2em">'+place.name+'</strong>'+
                    '<br/><strong>Latitude:</strong>'+placeLoc.lat()+
                    '<br/><strong>Longitude:</strong>'+placeLoc.lng()+
                    '<br/><strong>Type:</strong>'+place.types[0]+
                    '<br/><strong>Rating:</strong>'+(place.rating||'n/a');
        var more_content='<img src="http://googleio2009-map.googlecode.com/svn-history/r2/trunk/app/images/loading.gif"/>';
        
        //make a request for further details
        service.getDetails({reference:place.reference}, function (place, status) 
                                    {
                                      if (status == google.maps.places.PlacesServiceStatus.OK) 
                                      {
                                        more_content='<hr/><strong><a href="'+place.url+'" target="details">Details</a>';
                                        
                                        if(place.website)
                                        {
                                          more_content+='<br/><br/><strong><a href="'+place.website+'" target="details">'+place.website+'</a>';
                                        }
                                      }
                                    });


        google.maps.event.addListener(marker, 'click', function() {
          
          infowindow.setContent(content+more_content);
          infowindow.open(map, this);
        });
      }
  
  /*setTimeout(function(){
   window.location.reload(1);
},5000);*/
  google.maps.event.addDomListener(window, 'load', getLocation() );
  
  