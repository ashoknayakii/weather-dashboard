// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history

//---Selectors---//

var cityFormEl = document.querySelector("#city-form");
var inputCityEl = document.querySelector("#input-city");



//---Functions---//

// Create formsubmithandler function//

var formSubmitHandler = function (event) {
    event.preventDefault();
    var cityName = inputCityEl.value.trim();

    if (cityName) {
        getCityInfo(cityName);
        inputCityEl.value = "";
        
    } else {
        alert("Please enter a valid city name");
    }
};





// Create a getCityInfo function using a fetch from the open weather api then console log the response to check//

var getCityInfo = function (cityName) {

var citySearch = "https://api.weatherapi.com/v1/current.json?key=aef924f407e147739a530214221202&q=${cityName}&date&temp_f&condition:text&condition:icon&wind_mph&humidity&uv&days=5&aqi=no"

fetch(citySearch)
.then(function (response) {
    console.log("response");
    return response.json();
})
.then(function (data) {
    console.log();
    console.log("Data:", data);
})
.catch(function(error) {
    alert("Unable to connect to WeatherAPI")
});

}










// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index








// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe







// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity









// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city



// Event Listeners //

cityFormEl.addEventListener("submit", formSubmitHandler);