var key = '65a6ef9e53b138d495fa2864b093996c'
let historyArray = [];

// handles the city input
var formSubmit = function(event) {
    event.preventDefault();
    let city = document.getElementById('citySearch').value.trim();
    if(city) {
        cityData(city);
        searchHistory(city);
    } else {
        alert('Enter a city!');
    }
};

var cityData = function(city) {
    let apiUrl =`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`;
    fetch(apiUrl).then((response) => {
        if(response.ok) {
            response.json().then((data) => {
                var lat = data.coord.lat;
                var lon = data.coord.lat;
                var callAPI = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${key}`
                fetch(callAPI).then((response) => {
                    response.json().then((data) => {
                        currentWeather(city, data);
                        futureWeather(data);
                    })
                })
            })
        }
    })
}

var currentWeather = function(city, data) {
    var newCity = city.charAt(0).toUpperCase() + city.slice(1);

    var currentTime = moment.unix(data.current.dt).format('MM/DD/YYYY');
    var currentTemperature = ((data.current.temp - 273.15) * 1.8) + 32;
    var currentWind = data.current.wind_speed;
    var currentHumidity = data.current.humidity;
    var currentUvi = data.current.uvi;

    var currentWeatherNews = document.querySelector('#city-weather');

    currentWeatherNews.innerHTML = 
    `<h5>${newCity} (${currentTime})<h4>
    <p>Temperature: ${currentTemperature.toFixed(2)}&deg;F</p>
    <p>Humidity: ${currentHumidity}%<p>
    <p>Wind: ${currentWind}mph
    <p>UV Index: <span id="currentUvi">${currentUvi}</span></p>`
};

var futureWeather = function(data) {
    var dailyWeather = document.querySelector('#daily-weather');
    dailyWeather.textContent = '';

    for (let i = 1; i < 6; i++) {
        var dailyCityWeather = {
            date: data.daily[i].dt,
            temp: data.daily[i].temp.day,
            wind: data.daily[i].wind_speed,
            humidity: data.daily[i].humidity
        };

        var currentTemperature = ((data.current.temp - 273.15) * 1.8) + 32;
        var currentTime = moment.unix(dailyCityWeather.date).format('MM/DD/YYYY');
        var foreCast = document.createElement('div');

        foreCast.innerHTML = 
        `<div>
        <p>${currentTime}</p>
        <p>Temp: ${currentTemperature.toFixed(2)}&deg;F</p>
        <p>Wind: ${dailyCityWeather.wind} MPH</p>
        <p>Humidity: ${dailyCityWeather.humidity} %
        </div>`; dailyWeather.append(foreCast);
    };
};

var searchHistory = function(city) {
    if(!historyArray.includes(city)) {
        historyArray.push(city);

        var thisCitybtn = $(`<button type='button' id='search-btn' class='btn history-btn btn-block'>${city}</button>`);

        $('#search-history').append(thisCitybtn);
        localStorage.setItem('city', JSON.stringify(historyArray));
    }
};

$(document).on('click', '.history-btn', function() {
    let cityBtn = $(this).text();
    cityData(cityBtn);
});

document.querySelector('#search-btn').addEventListener('click', formSubmit);
$(document).ready(function() {
    let citySave = JSON.parse(localStorage.getItem('city'));
    if(citySave != null) {
        let lastSearch = citySave.length -1;
        let lastSearchCity = citySave[lastSearch];
        cityData(lastSearchCity);
    }
});