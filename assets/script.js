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
				<svg class="w-100 icon-big" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g><circle cx="12" cy="3" r="1"><animate id="spinner_7Z73" begin="0;spinner_tKsu.end-0.5s" attributeName="r" calcMode="spline" dur="0.6s" values="1;2;1" keySplines=".27,.42,.37,.99;.53,0,.61,.73"/></circle><circle cx="16.50" cy="4.21" r="1"><animate id="spinner_Wd87" begin="spinner_7Z73.begin+0.1s" attributeName="r" calcMode="spline" dur="0.6s" values="1;2;1" keySplines=".27,.42,.37,.99;.53,0,.61,.73"/></circle><circle cx="7.50" cy="4.21" r="1"><animate id="spinner_tKsu" begin="spinner_9Qlc.begin+0.1s" attributeName="r" calcMode="spline" dur="0.6s" values="1;2;1" keySplines=".27,.42,.37,.99;.53,0,.61,.73"/></circle><circle cx="19.79" cy="7.50" r="1"><animate id="spinner_lMMO" begin="spinner_Wd87.begin+0.1s" attributeName="r" calcMode="spline" dur="0.6s" values="1;2;1" keySplines=".27,.42,.37,.99;.53,0,.61,.73"/></circle><circle cx="4.21" cy="7.50" r="1"><animate id="spinner_9Qlc" begin="spinner_Khxv.begin+0.1s" attributeName="r" calcMode="spline" dur="0.6s" values="1;2;1" keySplines=".27,.42,.37,.99;.53,0,.61,.73"/></circle><circle cx="21.00" cy="12.00" r="1"><animate id="spinner_5L9t" begin="spinner_lMMO.begin+0.1s" attributeName="r" calcMode="spline" dur="0.6s" values="1;2;1" keySplines=".27,.42,.37,.99;.53,0,.61,.73"/></circle><circle cx="3.00" cy="12.00" r="1"><animate id="spinner_Khxv" begin="spinner_ld6P.begin+0.1s" attributeName="r" calcMode="spline" dur="0.6s" values="1;2;1" keySplines=".27,.42,.37,.99;.53,0,.61,.73"/></circle><circle cx="19.79" cy="16.50" r="1"><animate id="spinner_BfTD" begin="spinner_5L9t.begin+0.1s" attributeName="r" calcMode="spline" dur="0.6s" values="1;2;1" keySplines=".27,.42,.37,.99;.53,0,.61,.73"/></circle><circle cx="4.21" cy="16.50" r="1"><animate id="spinner_ld6P" begin="spinner_XyBs.begin+0.1s" attributeName="r" calcMode="spline" dur="0.6s" values="1;2;1" keySplines=".27,.42,.37,.99;.53,0,.61,.73"/></circle><circle cx="16.50" cy="19.79" r="1"><animate id="spinner_7gAK" begin="spinner_BfTD.begin+0.1s" attributeName="r" calcMode="spline" dur="0.6s" values="1;2;1" keySplines=".27,.42,.37,.99;.53,0,.61,.73"/></circle><circle cx="7.50" cy="19.79" r="1"><animate id="spinner_XyBs" begin="spinner_HiSl.begin+0.1s" attributeName="r" calcMode="spline" dur="0.6s" values="1;2;1" keySplines=".27,.42,.37,.99;.53,0,.61,.73"/></circle><circle cx="12" cy="21" r="1"><animate id="spinner_HiSl" begin="spinner_7gAK.begin+0.1s" attributeName="r" calcMode="spline" dur="0.6s" values="1;2;1" keySplines=".27,.42,.37,.99;.53,0,.61,.73"/></circle><animateTransform attributeName="transform" type="rotate" dur="6s" values="360 12 12;0 12 12" repeatCount="indefinite"/></g></svg>
			`

		searchTypingTimeout = setTimeout(async () => {
			const matches = await lookupLocation(input.value.trim().toLowerCase())

			if (matches.length === 0) {
				dropdown.innerHTML = `
						<li class="w-100 m-2" style="padding: 8px;">
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

function fahrenheitToCelsius(fahrenheit) {
	return Math.ceil((fahrenheit - 32) * 5 / 9)
}

function dateToWeekDay(dateStr) {
	const date = new Date(dateStr)
	const weekday = date.toLocaleString("en-US", { weekday: "long" })

	const today = new Date()
	const isToday =
		date.getFullYear() === today.getFullYear() &&
		date.getMonth() === today.getMonth() &&
		date.getDate() === today.getDate()

	return (isToday ? "Today" : weekday).slice(0, 3)
}

function dateToHour(dateStr) {
	const date = new Date(dateStr)

	const hoursUTC = date.getUTCHours()
	const hours12 = ((hoursUTC + 11) % 12) + 1
	const ampm = hoursUTC >= 12 ? "PM" : "AM"

	return `${hours12} ${ampm}`
}

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
	await setLocation(location)

	const responses = await Promise.all([
		get5DayForecast(location.Key),
		getTodayForecast(location.Key)
	])

	set5DayForecast(responses[0])
	setTodayForecast(responses[1])
}