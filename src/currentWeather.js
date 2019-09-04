// Weather
let appId = 'b2f64f9caf0c63a8eb6a5131e431a31e';
let units = 'metric';
let lang = 'pl';
let cityName = document.querySelector('.city');
let temperatureDescription = document.querySelector('.sun');
let temperatureDegree = document.querySelector('.temp');


// Current location
window.addEventListener('load', () => {
    let lon;
    let lat;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            lon = position.coords.longitude;
            lat = position.coords.latitude;
            console.log(lat, lon);
            const proxy = 'https://cors-anywhere.herokuapp.com/';
            const api = `${proxy}http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&APPID=${appId}&units=${units}&lang=${lang}`;
            fetch(api)
                .then(res => {
                    return res.json();
                })
                .then(res => {
                    console.log(res)
                    init(res)
                })
        })
    }
})

// Put data to divs
function init(data) {
    cityName.textContent = data.city.name;
    temperatureDegree.textContent = Math.floor(data.list[0].main.temp) + '℃';
    temperatureDescription.textContent = data.list[0].weather[0].description;
}