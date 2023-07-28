var APIKey = "fe5ad5271334f04eed5498a02a4c9816";

var titleEl = document.getElementById("searchResult");
var tempEl = document.getElementById("temp");
var windEl = document.getElementById("wind");
var humidityEl = document.getElementById("humidity");
var searchBtn = document.getElementById("search-btn");
var searchHistoryEl = document.getElementById("search-history");
var cityBtn = document.getElementById("city-btn");
var cityInput = document.getElementById("city-input");
var forecastCardsEl = document.getElementById("forecast-cards");
var cityArr = [];



function weatherSearch() {
    var cityName = cityInput.value;
    // if (!cityArr.includes(cityName)) {
        console.log(cityArr);
        cityArr.push(cityName);
        console.log(cityArr);
        localStorage.setItem('city', JSON.stringify(cityArr));
    // }
    // searchHistoryEl.innerHTML="<li class='list-group-item border-0'><button type='button' id='city-btn' class='btn btn-secondary w-100'>" + cityName + "</button></li>";

    displayWeather(cityName);
    displayHistory();
}
function displayHistory() {
    cityArr = localStorage.getItem("city");
    console.log(cityArr);
    if(cityArr.length === 0){
        cityArr = [];
        return;
    }
        for (let i = 0; i < cityArr.length; i++) {
            
                var listItemEl = document.createElement("li");
                listItemEl.classList.add("list-group-item", "border-0");
                var historyBtnEl = document.createElement("button");
                historyBtnEl.setAttribute("type", "button");
                historyBtnEl.setAttribute("id", "city-btn");
                historyBtnEl.classList.add("btn", "btn-secondary", "w-100");
                listItemEl.innerHTML = historyBtnEl;
                searchHistoryEl.appendChild(listItemEl);
                // searchHistoryEl.innerHTML="<li class='list-group-item border-0'><button type='button' id='city-btn' class='btn btn-secondary w-100'>" + cityArr[i] + "</button></li>";
            
        }
    

}

function displayWeather(cityName) {
    var currentWeatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey + "&units=imperial";

    fetch(currentWeatherURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (currentData) {
            console.log(currentData);
            //Parse through currentData to display city name and use dayjs to format date obtained from currentData.dt
            titleEl.innerHTML = currentData.name + " " + dayjs.unix(currentData.dt).format("(MM/DD/YYYY)") + "<img src=https://openweathermap.org/img/wn/" + currentData.weather[0].icon + "@2x.png >";

        })

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
displayHistory();
//calls displayWeather when city btn is clicked
//cityBtn.addEventListener("click", displayWeather);