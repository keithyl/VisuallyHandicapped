var infoWindow = new google.maps.InfoWindow();
var geocoder;
var address;
 
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
      geocoder.geocode({'latLng': latlng}, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[1]) {
                map.setZoom(16);
                marker = new google.maps.Marker({
                    position: latlng,
                    draggable: false,
                    animation: google.maps.Animation.DROP,
                    map: map
                });
            contentString = '<div id="iwContent">Lat: <span id="latbox">' + myLocation.lat() + '</span><br />Lng: <span id="lngbox">' + myLocation.lng() + '</span><br/><span id="addrbox">' + results[1].formatted_address + '</span></div>';
            //window.alert(results[1].formatted_address);
            infoWindow.setContent(contentString);
            infoWindow.open(map,marker);
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
  
  /*setTimeout(function(){
   window.location.reload(1);
},5000);*/
  google.maps.event.addDomListener(window, 'load', getLocation() );