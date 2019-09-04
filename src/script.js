document.addEventListener('DOMContentLoaded', () => {
    let appId = 'd56b410a93a6e32c305bbb37968f39d4'; //klucz z OpenWeather
    let units = 'metric';
    let searchMethod='q';
    let langCode = 'pl';

    function searchWeather(searchTerm, displayWeatherInfo){
		//Tak będzie wyglądał obiekt reprezentujący dane zwracane z tej funkcji (na razie wszystkie pola niech będą undefined).
		let weatherInfo = { sunset: undefined, sunrise: undefined, cityName: undefined, today: undefined, todaysNight: undefined, incomingDays: [] }; 
		
		//Wywołujemy pierwszy webservice żeby pobrać sunrise i sunset, oraz dane aktualej pogody.
		fetch(`http://api.openweathermap.org/data/2.5/weather?${searchMethod}=${searchTerm}&APPID=${appId}&units=${units}&lang=${langCode}`) 
		.then((result) => {return result.json()})
		.then(result => {
			
			//Ustalamy weatherkind (żeby móc potem zmieniać obrazki tła).
			let wk = 1;
			if (result.weather[0].id > 800) {
				wk = 7;
			}
			else if (result.weather[0].id == 800) {
				wk = 6;
			}
			else if (result.weather[0].id > 622) {
				wk = 5;
			}
			else if (result.weather[0].id > 531) {
				wk = 4;
			}
			else if (result.weather[0].id > 321) {
				wk = 3;
			}
			else if (result.weather[0].id > 232) {
				wk = 2;
			}
			
			//Wypełniamy ten obiekt, który będziemy zwracali z tej funkcji, pobranymi danymi.
			weatherInfo.sunset = result.sys.sunset; 
			weatherInfo.sunrise = result.sys.sunrise;
			weatherInfo.cityName = result.name;
			weatherInfo.today = {
				weatherKind: wk,
				date: new Date(result.dt * 1000).toISOString().substring(0, 10),
				maxTemperature: result.main.temp_max,
				minTemperature: result.main.temp_min,
				currentTemperature: result.main.temp,
				description: result.weather[0].description,
				iconUrl: 'http://openweathermap.org/img/wn/' + result.weather[0].icon +'.png'
			};
			//Wywołujemy drugi webserive, aby pobrać dane na kolejne dni, ale również, żeby pozyskać dane na dzisiejszą noc.
			fetch(`http://api.openweathermap.org/data/2.5/forecast?${searchMethod}=${searchTerm}&APPID=${appId}&units=${units}&lang=${langCode}`)
			.then((result) => {return result.json()})
			.then(result =>
			{  
				//Grupujemy dane po dacie i przekształcamy mapę powstałą po grupowaniu na tablice tablic. Każda tablica zawiera wpisy zwrócone przez webservice dotyczące jednego, tego samego dnia.
				let groupByDate = Array.from(groupBy(result.list, item => item.dt_txt.substring(0, 10)).values());
				
				//Pobieramy wpisy, które dotyczą dzisiejszej nocy (wiemy kiedy jest sunset więc to możliwe).
				let tonightEntries = groupByDate[0].filter(item => item.dt > weatherInfo.sunset );
				
				//Do wpisów z dzisiejszej nocy dodajemy wpisy z jutrzejszego poranka (z przed wschodu słońca), do timpestampa mówiącego kiedy jest wschód słońca dodaję 86400, bo dokładnie tyle sekund ma doba,
				//a tutaj potrzebujemy czas wschodu słońca jutro.
				tonightEntries = tonightEntries.concat(groupByDate[1].filter(item => item.dt < weatherInfo.sunrise + 86400));
				
				//Wywołuję funkcję, która zbuduje mi obiekt reprezentujący dane dla nocy (jako temperatura będzie srednia temperatura w nocy, a jako opis i ikona będą wartości najczęściej występujące we wszystkich wpisach dotyczących tej nocy).
				weatherInfo.todaysNight = ParseWeatherData(tonightEntries);
				
				//Nasępnie iteruję po tablicach reprezentujących pozostałe dni, z pominięciem pierwszego elementu, bo dane dla "dzisiaj" już ustaliliśmy.
				for (x = 1; x < groupByDate.length -1; x++) {
					const sunrise = weatherInfo.sunrise + x * 86400; //Przeliczam kiedy następuje wschód danego dnia.
					const sunset = weatherInfo.sunset + x * 86400; //Przeliczam kiedy następuje zachód danego dnia.
					let dayEntries = groupByDate[x].filter(item => item.dt <= sunset && item.dt >= sunrise); //Wyfiltrowywuję wpisy dotyczące dnia.
					let nightEntries = groupByDate[x].filter(item => item.dt > sunset ); //Wyfiltrowywuję wpisy dotyczące nocy.
					nightEntries = nightEntries.concat(groupByDate[x + 1].filter(item => item.dt < sunrise + 86400)); //Do wpisów dotyczących nocy dodaje wpisy z poranka następnego dnia (przed wschodem); tu ponownie dodaje ilość sekund w dobie, bo chodzi o kolejny dzień.
					weatherInfo.incomingDays.push({ day: ParseWeatherData(dayEntries), night: ParseWeatherData(nightEntries)}); //Zarówno dla wpisów z dnia i nocy buduję po obiekcie reprezentującym dane pogodowe czyli (srednia temperatura, najczęściej występujący opis i ikona itd).
				}
				//Tutaj wywołujemy przekazaną w argumentach metode wyświetlającą dane.
				displayWeatherInfo(weatherInfo);
			});
		}); 
	}

	//Ta funkcja bierze kolekcję wpisów i buduję z niej pojedyńczy obiekt reprezentujący dane pogodowe. 
	//Ze wszystkich wpisów zostanie obliczona średnia temperatura, oraz zostanie wyznaczony opis na takiej zasadzie, że wyszukana zostanie wartosć powtarzająca się we wpisach najczęściej.
	function ParseWeatherData(data) {
		//Grupujemy dane po opisie.
		let goruedByDescription = Array.from(groupBy(data, item => item.weather[0].description).values());
		let mostPopulatedGroupIndex = 0; //Tutaj będziemy trzymali index w tablicy, na którym znajduje się wpis z najczęściej występującym opisem (może ich być kilka, ale nam potrzebny jeden taki index).
		
		//W pętli zliczamy ile elementów trafiło do grupy i zapamiętujemy ta wartość oraz index jeśli wcześniej zapamiętana wartość jest mniejsza.
		let count = 0;
		for (i = 0; i < goruedByDescription.length; i++) {
			if (count < goruedByDescription[i].length){
				count = goruedByDescription[i].length;
				mostPopulatedGroupIndex = i;
			}
		}
		
		//Tutaj sumujemy wszystkie temperatury ze wszystkich wpisów (żeby potem średnią obliczyć).
		let sum = 0;
		for(i = 0; i < data.length; i++ ){
			sum += data[i].main.temp;
		}
		
		//Zwracamy obiekt z danymi.
		return {
			avarageTemperature: sum/data.length, //Srednia temperatura (suma przez ilość wpisów).
			date: new Date(data[0].dt * 1000).toISOString().substring(0, 10), //Data 
			iconUrl: 'http://openweathermap.org/img/wn/'+ goruedByDescription[mostPopulatedGroupIndex][0].weather[0].icon + '.png', //Ikonka skojarzona z wpisem, którego opis pojawiał się najczęściej.
			description: goruedByDescription[mostPopulatedGroupIndex][0].weather[0].description //Opis pojawiający się najczęściej.
		};
	}

    function groupBy(list, keyGetter) {
        const map = new Map();
        list.forEach((item) => {
             const key = keyGetter(item);
             const collection = map.get(key);
             if (!collection) {
                 map.set(key, [item]);
             } else {
                 collection.push(item);
             }
        });
        return map;
    }

    function getRandomNr(min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }//funkcja losująca losową liczbę, potrzebna do zmieniania tła

    function displayWeatherInfo(weatherInfo){
		
		//Tutaj weźmiemy obiekt weatherInfo i wyciągamy z niego dane żeby sobie je wyswietlić na stronie.
		//Na razie wklejam tu tylko console log, żeby można było wyswietlić w konsoli jak obiekt jest zbudowany i czekam na ostateczne nazwy klas w htmlu żeby to "powklejać" w odpowiednie miejsca.
		console.log(weatherInfo);
		console.log(Math.round(weatherInfo.incomingDays[0].day.avarageTemperature));
    }
	
	document.querySelector('button').addEventListener('click', () => {
		
		let searchTerm = document.querySelector('.search').value;
		
		if(searchTerm)
			searchWeather(searchTerm, displayWeatherInfo);
		
    })
})