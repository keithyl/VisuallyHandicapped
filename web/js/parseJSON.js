/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var busRoute31 = "https://busservices.firebaseio.com/31/route1/stopsById.json";
var bus166Time = "https://intelbus.herokuapp.com/?id=04189&serviceNo=166";
var test = "https://intelbus.herokuapp.com/?id=60121";
 var image = 'images/busstops.png';
 var map;
$.getJSON(busRoute31, function (data) {
    
    $.each(data, function(i) {
      var latlong = data[i].lat + ', ' + data[i].lng;
       var  myLocation =   new google.maps.LatLng(data[i].lat, data[i].lng );
       marker = new google.maps.Marker({
                    position: myLocation,
                    draggable: false,
                    //animation: google.maps.Animation.DROP,
                    map: map,
                    icon: image
                });
      //console.log(latlong);
     });

});

$.getJSON(test, function (data) {
    
    $.each(data, function(i) {
      var timing = data[i].duration;
      
     console.log("TIMING: " + timing);
      //console.log(latlong);
     });

});


/*
$.getJSON(bus166Time, function(data){
    $.each(data, function(i) {
        
    });
});*/

