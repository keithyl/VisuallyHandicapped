var infoWindow = new google.maps.InfoWindow();
 
 function getLocation(){

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

     var  myLocation =   new google.maps.LatLng(lat, lng);


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
   
 contentString = '<div id="iwContent">Lat: <span id="latbox">' + myLocation.lat() + '</span><br />Lng: <span id="lngbox">' + myLocation.lng() + '</span></div>';
  infoWindow.setContent(contentString);
    infoWindow.open(map,marker); 
  }
  
  /*setTimeout(function(){
   window.location.reload(1);
},5000);*/
  google.maps.event.addDomListener(window, 'load', getLocation() );