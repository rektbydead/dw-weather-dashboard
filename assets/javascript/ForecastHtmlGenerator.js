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

async function setLocation(location) {
	const todayForecast = await getTodayForecast(location.Key)
	document.getElementById("city-name").innerHTML = location.EnglishName
	document.getElementById("city-chance-of-rain").innerHTML = `Chance of rain: ${todayForecast[0].PrecipitationProbability}%`
	document.getElementById("city-temperature").innerHTML = `${fahrenheitToCelsius(todayForecast[0].Temperature.Value)}°`
	document.getElementById("city-weather-image").src = `https://www.accuweather.com/assets/images/weather-icons/v2a/${todayForecast[0].WeatherIcon}.svg`
}