// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history

//---Selectors---//

let cityFormEl = document.querySelector("#city-form");
let inputCityEl = document.querySelector("#input-city");
let resultsContainerEl = document.querySelector("#result-container");
let historyContainerEl = document.querySelector("#history-container");
let cityWeatherIconEl = document.querySelector("#city-weather-icon");
// var cityNameEl = document.querySelector("#city-name");
// var tempEl = document.querySelector("#temperatureF");
// var humidity = document.querySelector("#humidity");
// var windMPH = document.querySelector("#wind");
// var uvIndex = document.querySelector("#uv-index");
let forecastEl = document.querySelector("#fivedaycolumns");
let citySearchHistory = JSON.parse(localStorage.getItem("cityName")) || [];
let clearBtn = document.querySelector("#clear-btn");
console.log(citySearchHistory);

//---Functions---//

// Create formsubmithandler function//

const formSubmitHandler = function (event) {
    event.preventDefault();
    let cityName = inputCityEl.value.trim();

    if (cityName) {
        getCityInfo(cityName);

        // Clear Past Content

        resultsContainerEl.innerHTML = "";
        forecastEl.innerHTML = "";

    } else {
        alert("Please enter a valid city name");
    }
};

// Create a getCityInfo function using a fetch from the open weather api then console log the response to check//


const getCityInfo = function (cityName) {
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
                                    saveCityName(cityName);
                                    displaySearchHistory();
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


// Save City to Local Storage

const saveCityName = function (cityName) {

    let duplicateCity = false;
    for (let i = 0; i < citySearchHistory.length; i++) {
        if(citySearchHistory[i] === cityName){
            duplicateCity = true;
            break;
        }
        
    }
    if(!duplicateCity) {
        citySearchHistory.push(cityName);
        localStorage.setItem("cityName", JSON.stringify(citySearchHistory));
        console.log("cityName", citySearchHistory[i]);
    }

};

const displaySearchHistory = function () {
    historyContainerEl.innerHTML = "";

    for (let i = 0; i < citySearchHistory.length; i++) {
        
        let searchHistoryEl = document.createElement("button");
        searchHistoryEl.classList = "btn-secondary btn-block";
        searchHistoryEl.setAttribute("value", citySearchHistory[i]);
        searchHistoryEl.setAttribute("type", "text");
        searchHistoryEl.textContent = citySearchHistory[i];
        console.log("city button", searchHistoryEl.value);
        searchHistoryEl.addEventListener("click", function(){
            console.log("Search History Button Clicked!", searchHistoryEl.value);
            selectedCity = this.value;
            getCityInfo(selectedCity);
            displayCityForecast(selectedCity)
        });
        historyContainerEl.appendChild(searchHistoryEl);
    }

}

const displayCityInfo = function (data) {

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
    let currentTemp = Math.floor(1.8 * (data.current.temp - 273.15) + 32);
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


const displayCityForecast = function (data) {

    let dailyData = data.daily
    console.log(dailyData)

    for (let i = 1; i < 6; i++) {

        let forecastID = dailyData[i].dt;
        let forecastDate = new Date(forecastID * 1000);
        let forecastDay = forecastDate.getDate();
        let forecastMonth = forecastDate.getMonth() + 1;
        let forecastYear = forecastDate.getFullYear();

        // Create Elements to House 5 Day Forecast
 
        forecastEl.classList = "d-inline-flex flex-wrap";

        let forecastCard = document.createElement("div");
        forecastCard.classList = "card text-white bg-dark-blue m-2 p0";

        let forecastDetails = document.createElement("ul")
        forecastDetails.classList = "list-unstyled p-3"

        // Populate 5-day Forecast Cards

        let forecastCardDate = document.createElement("li")
        forecastCardDate.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
        forecastDetails.appendChild(forecastCardDate);
        // Icon Element for Forecast Card


        
        // Temp

        let tempForecastEL = document.createElement("li");
        let forecastTemp = Math.floor(1.8 * (dailyData[i].temp.day - 273.15) + 32);
        console.log(forecastTemp);
        tempForecastEL.innerHTML = "Temp: " + forecastTemp + "&#176F";
        forecastDetails.appendChild(tempForecastEL);
        // Humidity

        let humidityForecastEl = document.createElement("li")
        let forecastHumidity = dailyData[i].humidity
        console.log(forecastHumidity);
        humidityForecastEl.innerHTML = `Humidity:${forecastHumidity}%`;
        forecastDetails.appendChild(humidityForecastEl);

        // Wind

        let windForecastEl = document.createElement("li")
        let forecastWind = dailyData[i].wind_speed
        console.log(forecastWind);
        windForecastEl.innerHTML = "Wind: " + forecastWind + "MPH";
        forecastDetails.appendChild(windForecastEl);
        forecastCard.append(forecastDetails)
        forecastEl.append(forecastCard)
    }
};


clearBtn.addEventListener("click", function() {
citySearchHistory = [];
localStorage.clear();
location.reload();
});

cityFormEl.addEventListener("submit", formSubmitHandler);
