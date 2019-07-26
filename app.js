$(document).ready(function() {
  $("#rough-number-form").on("submit", function(event) {
      event.preventDefault();
      var startingAddress = $("#starting-address-form").val();
      var startingAddress2 = $("#starting-address-2-form").val();
      var endingAddress = $("#starting-address-form").val();
      var endingAddress2 = $("#starting-address-2-form").val();
      var startingAddress = $("#starting-address-form").val();
      var inputLocation = $("#input-location").val();
      var miles = parseInt($("#miles-form").val());
      var averageSpeed = parseInt($("#average-speed-form").val());
      var laborHigh = parseInt($("#labor-high-end-form").val());
      var loadTravelFee = parseInt($("#load-travel-fee-form").val());
      var unloadTravelFee = parseInt($("#unload-travel-fee-form").val());
      var trucks = parseInt($("#trucks-form").val());
      var movers = parseInt($("#movers-form").val());

      // Calculate Drivetime Hours
      var finalDrivetime = (miles / averageSpeed) * 2
      console.log(miles, averageSpeed)
      $("#final-drivetime-hours").text("Final Drivetime Hours: "+ finalDrivetime.toFixed(2))
      $("#final-drivetime-hours-label").attr("class","visible")
      
      // Calculate Drivetime Cost
      console.log(movers, trucks, finalDrivetime)
      var hourlyRate = (movers + trucks) * 40
      var finalDrivetimeCost = finalDrivetime * hourlyRate
      $("#final-drivetime-cost").text("Final Drivetime $: "+ finalDrivetimeCost.toFixed(2))

      // Calculate Fuel
      var finalFuel = (miles * 1.25) * trucks
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
    })
})
