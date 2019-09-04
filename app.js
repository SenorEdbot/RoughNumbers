var GMapsAPIKey = "AIzaSyDwoapQMiuQh-V8VL7c9GZ09jMcILHLs_Y";
var tripMilage;
var secondsTotal;
var fromLat;
var fromLng;
var toLat;
var toLng;
var ralstonAddress = "6117 Orchard Ave, Omaha, NE 68117"
var millardAddress = "13839 L Street, Omaha, NE 68137"
var desMoinesAddress = "1209 SW Ordnance Road, Ankeny IA 50023"
var lincolnAddress = "1413 South 3rd St, Lincoln, NE 68521"
var denverAddress = "5707 W 6th Avenue, Lakewood, CO 80214"
var locationDoingMove;

function initAutocomplete() {
  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer({
    draggable: false,
    map: map
  })
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 41.2565, lng: -95.9345},
    zoom: 10,
    mapTypeId: 'roadmap'
  })
  directionsDisplay.setMap(map)
  directionsDisplay.addListener('directions_changed', function () {
    if ( !$('#starting-address-form') && !$('#ending-address-form')) {
        return false
    }
    computeTotalDistance(directionsDisplay.getDirections());
  });
  // var defaultBounds = new google.maps.LatLngBounds(
  //   new google.maps.LatLng(omahaLat, omahaLng))
  //   var options = {
  //     bounds: defaultBounds
  //   }
  document.getElementById('submit').addEventListener('click', function() {
    event.preventDefault();
    $('#map').show();
    calculateAndDisplayRoute(directionsService, directionsDisplay);
  })
  var startingAddressInput = document.getElementById('starting-address-form');
  var endingAddressInput = document.getElementById('ending-address-form');
  // Create the search box and link it to the UI element.
  var autocomplete1 = new google.maps.places.Autocomplete(startingAddressInput);
  google.maps.event.addListener(autocomplete1, 'place_changed', function () {
    var place = autocomplete1.getPlace();
    fromLat = place.geometry.location.lat();
    fromLng = place.geometry.location.lng();
  })
  var autocomplete2 = new google.maps.places.Autocomplete(endingAddressInput);
  google.maps.event.addListener(autocomplete2, 'place_changed', function () {
    var place2 = autocomplete2.getPlace();
    toLat = place2.geometry.location.lat();
    toLng = place2.geometry.location.lng();
  })
  map.addListener('bounds_changed', function () {
    autocomplete1.setBounds(map.getBounds());
    autocomplete2.setBounds(map.getBounds());
  });
}
var waypts = []
function calculateAndDisplayRoute(directionsService, directionsDisplay) {
  directionsService.route({
      origin: document.getElementById('starting-address-form').value,
      destination: document.getElementById('ending-address-form').value,
      waypoints: waypts,
      optimizeWaypoints: false,
      travelMode: 'DRIVING'
  }, function (response, status) {
      if (status === 'OK') {
          directionsDisplay.setDirections(response);
          var route = response.routes[0];
      } else {
          window.alert('Directions request failed due to ' + status);
      }
  });
}

function computeTotalDistance(result) {
  tripMilage = 0;
  secondsTotal = 0;
  var myroute = result.routes[0];
  console.log(myroute);
  for (var i = 0; i < myroute.legs.length; i++) {
      tripMilage += myroute.legs[i].distance.value;
      secondsTotal += myroute.legs[i].duration.value;
  }
  tripMilage = ((tripMilage / 1000) * 0.621371).toFixed(2);
  $("#final-miles").text("Final Miles: "+ tripMilage)
  calcRoughNumbers(tripMilage);
}

function addShopLocation() {
  var inputLocation = $("#input-location").val();  
  if (!inputLocation) {
    return false
  }
  switch(inputLocation){
    case "west-omaha":
      locationDoingMove = 'woma'
      var newWaypt = millardAddress;
      waypts.push({
          location: newWaypt,
          stopover: true
      });
      break;
    case "omaha":
      locationDoingMove = 'oma'
        var newWaypt = ralstonAddress;
        waypts.push({
            location: newWaypt,
            stopover: true
        });
        break;
    case "lincoln":
      locationDoingMove = 'linc'
        var newWaypt = lincolnAddress;
        waypts.push({
            location: newWaypt,
            stopover: true
        });
        break;
    case "denver":
      locationDoingMove = 'cco'
        var newWaypt = denverAddress;
        waypts.push({
            location: newWaypt,
            stopover: true
        });
        break;
    case "des-moines":
      locationDoingMove = 'dm'
        var newWaypt = desMoinesAddress;
        waypts.push({
            location: newWaypt,
            stopover: true
        });
        break;
    default:
      console.log(inputLocation);
  }
  
}

function calcRoughNumbers(tripMilage) {
  var inputLocation = $("#input-location").val();
  var averageSpeed = parseInt($("#average-speed-form").val());
  var laborHigh = parseInt($("#labor-high-end-form").val());
  var loadTravelFee = parseInt($("#load-travel-fee-form").val());
  var unloadTravelFee = parseInt($("#unload-travel-fee-form").val());
  var trucks = parseInt($("#trucks-form").val());
  var movers = parseInt($("#movers-form").val());
  

  // Calculate Drivetime Hours
  var finalDrivetime = (tripMilage / averageSpeed) * 2
  console.log(tripMilage, averageSpeed)
  $("#final-drivetime-hours").text("Final Drivetime Hours: "+ finalDrivetime.toFixed(2))
  $("#final-drivetime-hours-label").attr("class","visible")
  
  // Calculate Drivetime Cost
  console.log(movers, trucks, finalDrivetime)
  var hourlyRate = (movers + trucks) * 40
  var finalDrivetimeCost = finalDrivetime * hourlyRate
  $("#final-drivetime-cost").text("Final Drivetime $: "+ finalDrivetimeCost.toFixed(2))

  // Calculate Fuel
  var finalFuel = (tripMilage * 1.25) * trucks
  $("#final-fuel").text("Final Fuel: "+ finalFuel.toFixed(2))


  // Calculate Labor
  $("#final-labor").text("Final Labor High: "+ laborHigh)


  // Calculate Load Travel Fee
  $("#final-load-travel-fee").text("Final Load Travel Fee: "+ loadTravelFee)


  // Calculate Unload Travel Fee
  $("#final-unload-travel-fee").text("Final Unload Travel Fee: "+ unloadTravelFee)


  // Calculate Final Low End
  var finalLow = Math.ceil(finalFuel + finalDrivetimeCost + (laborHigh - 200) + loadTravelFee + unloadTravelFee)
  console.log(finalLow)
  $("#final-low-end").text("Final Low: "+ finalLow)


  // Calculate Final High End
  var finalHigh = Math.ceil(finalFuel + finalDrivetimeCost + laborHigh + loadTravelFee + unloadTravelFee)
  $("#final-high-end").text("Final High: "+ finalHigh)
  $("#final-price-label").attr("class","visible")
}

$('#add-ending-address').on('click', function() {
  event.preventDefault;
    if (!$('#add-ending-address').val()) {
        return false
    }
    var addressesDiv = document.getElementById('addresses');
    addressesDiv.innerHTML = '';
    console.log('button was clicked')
    var newWaypt = $('#add-ending-address').val().trim();
    waypts.push({
        location: newWaypt,
        stopover: true
    });
    $('#add-ending-address').val('');
    if(waypts.length > -1 ){
        for (var i=0; i<waypts.length; i++){
            addressesDiv.innerHTML += "Waypoint #" + counter[i] + ": " + waypts[i].location + "<br>";
        }
    }
})
$('#add-starting-address').on('click', function () {
    event.preventDefault;
    if (!$('#add-starting-address').val()) {
        return false
    }
    var addressesDiv = document.getElementById('addresses');
    addressesDiv.innerHTML = '';
    console.log('button was clicked')
    var newWaypt = $('#add-starting-address').val().trim();
    waypts.push({
        location: newWaypt,
        stopover: true
    });
    $('#add-starting-address').val('');
    if(waypts.length > -1 ){
        for (var i=0; i<waypts.length; i++){
            addressesDiv.innerHTML += "Waypoint #" + counter[i] + ": " + waypts[i].location + "<br>";
        }
    }
})