let searchTypingTimeout = undefined

document.addEventListener("DOMContentLoaded", async () => {
	const defaultLocation = await getDefaultLocation()
	await getWeatherData(defaultLocation)

	const input = document.getElementById("weather-search-input")
	const dropdown = document.getElementById("search-dropdown")

	input.addEventListener("input", () => {
		clearTimeout(searchTypingTimeout)
		dropdown.style.display = "block"
		dropdown.innerHTML = `
				<li id="search-dropdown-spinner" class="spinner"></li>
		`

		if (input.value.trim().length < 3) {
			dropdown.innerHTML = `
						<li class="w-100 m-2 not-found" style="padding: 8px;">
							<h3> No results found for "${input.value.trim().toLowerCase()}" </h3>
						</li>
					`
			return;
		}

		searchTypingTimeout = setTimeout(async () => {
			const matches = await lookupLocation(input.value.trim().toLowerCase())

			if (matches.length === 0) {
				dropdown.innerHTML = `
						<li class="w-100 m-2 not-found" style="padding: 8px;">
							<h3> No results found for "${input.value.trim().toLowerCase()}" </h3>
						</li>
					`
				return
			}

			dropdown.innerHTML = matches.map((location) => `
				<li class="w-100 m-2" style="padding: 8px; cursor: pointer" onclick='getWeatherData(${JSON.stringify(location)})'>
					<h2 style="margin: 0; font-size: 1.2em;">${location.EnglishName}</h2>
					<h4 style="margin: 0; font-weight: normal; font-size: 0.9em;">${location.Country.EnglishName}</h4>
				</li>`
			).join("");
		}, 500)
	})

	/* Close dropdown when clicking outside */
	document.addEventListener("click", (e) => {
		if (!e.target.closest(".search-wrapper")) {
			dropdown.style.display = "none";
		}
	})
})

async function setLocation(location) {
	const todayForecast = await getTodayForecast(location.Key)
	document.getElementById("city-name").innerHTML = location.EnglishName
	document.getElementById("city-chance-of-rain").innerHTML = `Chance of rain: ${todayForecast[0].PrecipitationProbability}%`
	document.getElementById("city-temperature").innerHTML = `${fahrenheitToCelsius(todayForecast[0].Temperature.Value)}°`
	document.getElementById("city-weather-image").src = `https://www.accuweather.com/assets/images/weather-icons/v2a/${todayForecast[0].WeatherIcon}.svg`
}

function set5DayForecast(forecast) {
	const dailyForecasts = forecast.DailyForecasts
	document.getElementById("daily-forecast").innerHTML = dailyForecasts.map((forecast) => `
		<div class="daily-forecast-item">
			<span class="daily-forecast-item-day"> ${dateToWeekDay(forecast.Date)} </span>
			
			<div class="daily-forecast-item-image">
				<img 
					src="https://www.accuweather.com/assets/images/weather-icons/v2a/${forecast.Day.Icon}.svg" 
					alt="daily-forecast-item-${forecast.Day.Icon}"
				/>
				
				 <span> ${forecast.Day.IconPhrase} </span>
			</div>
			
			<div class="daily-forecast-item-temperature">
				<span class="maximum">
					${fahrenheitToCelsius(forecast.Temperature.Maximum.Value)}°
				</span>
				<span class="slash"> / </span>
				<span class="minimum">${fahrenheitToCelsius(forecast.Temperature.Minimum.Value)}°</span>
			</div>
		</div>	
	`
	).join(`<hr/>`)
}

function setTodayForecast(forecast) {
	document.getElementById("hourly-forcast").innerHTML = forecast.map((forecast) => `
		<div class="hourly-forecast-item">
			<span class="time"> ${dateToHour(forecast.DateTime)} </span>
			<img src="https://www.accuweather.com/assets/images/weather-icons/v2a/${forecast.WeatherIcon}.svg" alt="cloudy">
			<span class="temperature">${fahrenheitToCelsius(forecast.Temperature.Value)}°</span>
		</div>
	`).join("<hr/>")
}

async function getWeatherData(location) {
	console.log(location)
	localStorage.setItem(`default-location`, JSON.stringify(location))
	await setLocation(location)

	const responses = await Promise.all([
		get5DayForecast(location.Key),
		getTodayForecast(location.Key)
	])

	set5DayForecast(responses[0])
	setTodayForecast(responses[1])
}