/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var busRoute31 = "https://busservices.firebaseio.com/31/route1/stopsById.json";

$.getJSON(busRoute31, function (json) {

    // Set the variables from the results array
   
    console.log(json);
    var obj = JSON.parse(json);
    
    //console.log("object: " + obj);

});

