//Dla grupy js animowana ikona, wiadomo tam gdzie kolor możemy zmienić kolor, szerokość i wysokość zmieniamy w html
//jak zrobimy to w css to wtedy dziwnie się skaluje i wygląda paskudnie (sprawdzałem)
//tam gdzie jest cloudy definiujemy jaką ma być ikonką, możliwe opcje to: clear-day, clear-night, partly-cloudy-day, partly-cloudy-night, 
//cloudy, rain, sleet, snow, wind, fog - i to trzeba będzie podstawiać na podstawie tego co nam zwróci fetch 
// zmieniamy ikonkę za pomocą skycons.set("icon", 'rain');

var skycons = new Skycons({"color": "white"});
skycons.add(document.getElementById("icon"), 'cloudy')
skycons.play();

