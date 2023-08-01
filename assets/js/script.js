var APIKey = "fe5ad5271334f04eed5498a02a4c9816";

var titleEl = document.getElementById("searchResult");
var tempEl = document.getElementById("temp");
var windEl = document.getElementById("wind");
var humidityEl = document.getElementById("humidity");
var searchBtn = document.getElementById("search-btn");
var searchHistoryEl = document.getElementById("search-history");
// var cityBtn = document.getElementById("city-btn");
var cityInput = document.getElementById("city-input");
var forecastCardsEl = document.getElementById("forecast-cards");
var cityArr = [];

function weatherSearch() {
    cityArr.push(cityInput.value);

    localStorage.setItem('city', JSON.stringify(cityArr));
    console.log(localStorage.getItem('city'));

    displayWeather(cityInput.value);
    createCityBtn();
}

function getCity() {
    var gottenCity = localStorage.getItem('city');
    //turns gottenCity into an arary and resets cityArr
    cityArr = Object.values(gottenCity);
}

function createCityBtn() {
    var li = document.createElement('li');
    var cityBtn = document.createElement('button');

    if (localStorage.length > 0) {
        // var pastCities = localStorage.getitem('city');
        // console.log(pastCities);

        cityBtn.innerHTML = cityInput.value;
        cityBtn.classList.add("btn", "btn-secondary", "w-100");
        li.classList.add("list-group-item", "border-0");
        li.appendChild(cityBtn);
        searchHistoryEl.appendChild(li);
    }

}

//This function displays weather data on the page
function displayWeather(cityName) {
    var currentWeatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey + "&units=imperial";

    //Get data to display today's current weather
    fetch(currentWeatherURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (currentData) {
            console.log(currentData);
            //Parse through currentData to display city name and use dayjs to format date obtained from currentData.dt
            titleEl.innerHTML = currentData.name + " " + dayjs.unix(currentData.dt).format("(MM/DD/YYYY)") + "<img src=https://openweathermap.org/img/wn/" + currentData.weather[0].icon + "@2x.png >";
            tempEl.innerHTML = "Temp: " + currentData.main.temp;
            windEl.innerHTML = "Wind: " + currentData.wind.speed + "MPH";
            humidityEl.innerHTML = "Humidity: " +currentData.main.humidity + "%";
        })

    //fetch the 5 day forecast from the API
    var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + APIKey + "&units=imperial";

    fetch(forecastURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (forecastData) {
            console.log(forecastData);
            //Loop through 5 days of forecast. Forecast lists weather for every 3 hours. 
            //Take noon forecast of each day (24hrs/3hrs=8hrs) add 8 for each iteration
            var forecastArr = forecastData.list;
            for (let i = 3, j = 1; i < forecastArr.length; i = i + 8, j++) {
                console.log(forecastArr[i]);
                var cardTitle = document.getElementById("card-title" + j);
                cardTitle.textContent = dayjs.unix(forecastArr[i].dt).format("MM/DD/YYYY");
                var cardIcon = document.getElementById("icon" + j);
                cardIcon.innerHTML = "<img src='https://openweathermap.org/img/wn/" +forecastArr[i].weather[0].icon + "@2x.png' alt='weather icon'></img>"
                var temp = document.getElementById("temp" + j);
                temp.textContent = "Temp: " + forecastArr[i].main.temp;
                var wind = document.getElementById("wind" + j);
                wind.textContent = "Wind: " + forecastArr[i].wind.speed;
                var humid = document.getElementById("humidity" + j);
                humid.textContent = "Humidity: " + forecastArr[i].main.humidity;
            }
        })
}

//calls weatherSearch when search btn is clicked
searchBtn.addEventListener("click", weatherSearch);

//calls displayWeather when city btn is clicked
//cityBtn.addEventListener("click", displayWeather);