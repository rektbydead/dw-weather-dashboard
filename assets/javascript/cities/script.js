const cityList = [
	{
		name: "New York",
		key: "349727",
	},
	{
		name: "London",
		key: "328328",
	},
	{
		name: "Porto",
		key: "275317",
	},
	{
		name: "Lisbon",
		key: "1557084",
	},
	{
		name: "Paris",
		key: "623",
	},
	{
		name: "Berlin",
		key: "178087"
	}
]

document.addEventListener("DOMContentLoaded", async () => {
	const cityListElement = document.getElementById("city-list");
	cityListElement.innerHTML = '';

	const forecasts = await Promise.all(cityList.map(city => getTodayForecast(city.key)));

	cityList.forEach((city, index) => {
		const todayForecast = forecasts[index];

		const cityItem = document.createElement("li");
		cityItem.classList.add("city-item", "border-round", "border-color");

		if (index === 0) {
			cityItem.classList.add("city-item-active");
		}

		cityItem.innerHTML = `
			<img 
				src="https://www.accuweather.com/assets/images/weather-icons/v2a/${todayForecast[0].WeatherIcon}.svg" 
				alt="${todayForecast[0].WeatherIcon}"
			/>
			
			<div class="my-auto">
				<h1 class="m-0 city-name">${city.name}</h1>
				<h2 class="m-0 city-chance-of-rain">
					Chance of rain: ${todayForecast[0].PrecipitationProbability}%
				</h2>
			</div>
			
			<span class="my-auto ms-auto city-temperature">
				${fahrenheitToCelsius(todayForecast[0].Temperature.Value)}°
			</span>			
		`

		cityItem.addEventListener("click", async () => {
			// const forecast = await getWeatherForecast(city.key)

			document.querySelectorAll(".city-item").forEach(item => {
				item.classList.remove("city-item-active")
			})

			cityItem.classList.add("city-item-active");
		})

		cityListElement.appendChild(cityItem)
	})
})