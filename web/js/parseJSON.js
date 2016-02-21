/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var busRoute31 = "https://busservices.firebaseio.com/31/route1/stopsById.json";

$.getJSON(busRoute31, function (data) {
    
    $.each(data, function(i) {
      var latlong = data[i].lat + ', ' + data[i].lng;
       var  myLocation =   new google.maps.LatLng(data[i].lat, data[i].lng );
       marker = new google.maps.Marker({
                    position: myLocation,
                    draggable: false,
                    //animation: google.maps.Animation.DROP,
                    map: map
                });
      console.log(latlong);
      });

});

