// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history

//---Selectors---//

var cityFormEl = document.querySelector("#city-form");
var inputCityEl = document.querySelector("#input-city");
var resultsContainerEl = document.querySelector("#result-container");
var historyContainerEl = document.querySelector("#history-container");
let cityWeatherIconEl = document.querySelector("#city-weather-icon");
// var cityNameEl = document.querySelector("#city-name");
// var tempEl = document.querySelector("#temperatureF");
// var humidity = document.querySelector("#humidity");
// var windMPH = document.querySelector("#wind");
// var uvIndex = document.querySelector("#uv-index");
var forecastEl = document.querySelector("#fivedaycolumns");




//---Functions---//

// Create formsubmithandler function//

var formSubmitHandler = function (event) {
    event.preventDefault();
    let cityName = inputCityEl.value.trim();

    if (cityName) {
        getCityInfo(cityName);


    } else {
        alert("Please enter a valid city name");
    }
};


// Create a getCityInfo function using a fetch from the open weather api then console log the response to check//


var getCityInfo = function (cityName) {
    console.log(cityName);

    var apiKey = `23063d416b2ee9cce627a00bf1093a71`
    var citySearch = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`

    fetch(citySearch)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {

                    console.log(data);
                    var cityForecast = `https://api.openweathermap.org/data/2.5/onecall?lat=${data[0].lat}&lon=${data[0].lon}&exclude=minutely,hourly&appid=${apiKey}`

                    fetch(cityForecast)
                        .then(function (response) {
                            if (response.ok) {
                                response.json().then(function (data) {
                                    console.log(data);
                                    displayCityInfo(data);
                                })
                            }
                        })
                });
            } else {
                alert("Error: City Not Found!")
            }
        })
        .catch(function (error) {
            alert("Unable to connect to the Server");
        });
};



var displayCityInfo = function (data) {

    let cityName = inputCityEl.value.trim();
    inputCityEl.value = "";


    if (data.length === 0) {
        alert("No cities found under that name.  Try a new search.");
        return;
    }

    let today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;

    let cityWeatherIcon = data.current.weather[0].icon;
    cityWeatherIconEl.setAttribute("src", "https://openweathermap.org/img/w/" + cityWeatherIcon + ".png");
    resultsContainerEl.appendChild(cityWeatherIconEl);

    console.log(cityWeatherIcon);

    let cityHeader = document.createElement("h3");
    cityHeader.innerText = cityName + "( " + today + " )" + cityWeatherIcon;
    resultsContainerEl.appendChild(cityHeader);

    let tempF = document.createElement("li");
    let currentTemp = data.current.temp;
    console.log(currentTemp);
    tempF.innerHTML = "Temp: " + currentTemp + "&#176F";
    resultsContainerEl.appendChild(tempF);

    let windMPH = document.createElement("li")
    let currentWind = data.current.wind_speed
    console.log(currentWind);
    windMPH.innerHTML = "Wind: " + currentWind + "MPH";
    resultsContainerEl.appendChild(windMPH);

    let humidity = document.createElement("li")
    let currentHumidity = data.current.humidity
    console.log(currentHumidity);
    humidity.innerHTML = "Humidity: " + currentHumidity + "%";
    resultsContainerEl.appendChild(humidity);

    let uvIndex = document.createElement("li")
    let currentUVI = data.current.uvi
    console.log(currentUVI);
    uvIndex.innerText = currentUVI;
    resultsContainerEl.appendChild(uvIndex);

    displayCityForecast(data);

};


var displayCityForecast = function (data) {

    let dailyData = data.daily
    console.log(dailyData)

    for (let i = 1; i < 6; i++) {

        let forecastID = data.daily[i].dt;
        let forecastDate = new Date(forecastID * 1000);
        let forecastDay = forecastDate.getDate();
        let forecastMonth = forecastDate.getMonth() + 1;
        let forecastYear = forecastDate.getFullYear();


        // Create Elements to House 5 Day Forecast
 
        let forecastEl = document.createElement("div");
        forecastEl.classList = "d-inline-flex flex-wrap";

        let forecastCards = document.createElement("div");
        forecastCards.classList = "card text-white bg-dark-blue m-2 p0";

        let forecastDetails = document.createElement("ul")
        forecastDetails.classList = "unstyled list p-3"

        // Populate 5-day Forecast Cards

        let forecastCardDate = document.createElement("li")
        forecastCardDate.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
        forecastCards.appendChild(forecastCardDate);


        // Icon Element for Forecast Card



        // Temp

        let tempForecast = document.createElement("li");
        let forecastTemp = data.daily[i].temp;
        console.log(tempForecast);
        tempF.innerHTML = "Temp: " + currentTemp + "&#176F";
        forecastCards.appendChild(tempForecast);


        // Humidity

        let humidityForecast = document.createElement("li")
        let forecastHumidity = data.daily[i].humidity
        console.log(humidityForecast);
        humidity.innerHTML = "Humidity: " + currentHumidity + "%";
        forecastCards.appendChild(humidityForecast);

        // Wind

        let windForecast = document.createElement("li")
        let forecastWind = data.daily[i].wind_speed
        console.log(windForecast);
        windMPH.innerHTML = "Wind: " + currentWind + "MPH";
        forecastCards.appendChild(windForecast);








    }






};



















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