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

document.addEventListener("DOMContentLoaded", () => {
	const cityListElement = document.getElementById("city-list")
	cityListElement.innerHTML = ''

	cityList.forEach(async (city, index) => {
		const todayForecast = await getTodayForecast(city.key)

		const cityItem = document.createElement("li")
		cityItem.classList.add("city-item")
		cityItem.classList.add("border-round")
		cityItem.classList.add("border-color")

		if (index === 0) {
			cityItem.classList.add("city-item-active")
		}

		cityItem.innerHTML = `
			<img 
				src="https://www.accuweather.com/assets/images/weather-icons/v2a/${todayForecast[0].WeatherIcon}.svg" 
				alt="${todayForecast[0].WeatherIcon}"
			/>
			
			<div class="my-auto">
				<h1 class="m-0" id="city-name"> ${city.name} </h1>
				<h2 class="m-0" id="city-chance-of-rain"> Chance of rain: ${todayForecast[0].PrecipitationProbability}% </h2>
			</div>
			
			<span class="my-auto ms-auto" style="font-size: 2rem; color: var(--text-color-secondary)"> ${fahrenheitToCelsius(todayForecast[0].Temperature.Value)}° </span>			
		`

		cityListElement.appendChild(cityItem)
	})
})