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

			setTimeout(() => {
				dropdown.innerHTML = matches.map((location) => `
					<li class="w-100 m-2" style="padding: 8px; cursor: pointer" onclick="getWeatherData(${location})">
						<h2 style="margin: 0; font-size: 1.2em;">${location.name}</h2>
						<h4 style="margin: 0; font-weight: normal; font-size: 0.9em;">${location.country}</h4>
					</li>`
				).join("");
			}, 1000)
		}, 1500)
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

	return isToday ? "Today" : weekday.slice(0, 3)
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
}

function set5DayForecast(forecast) {
	const dailyForecasts = forecast.DailyForecasts

	document.getElementById("5-day-forecast").innerHTML = dailyForecasts.map((forecast) => `
		<div class="d-flex flex-column flex-grow-1" style="height: 50px; justify-content: space-between; border: 1px solid red">
			<h2 class="my-auto" style="width: 60px;"> ${dateToWeekDay(forecast.Date)} </h2>

			<div class="d-flex flex-column justify-content-center align-items-center">
				<img style="height: 50%; aspect-ratio: 1/1" src="./images/clouds.png" alt="logo"/>
				<h4 class="m-0 p-0" style="color: #dde0e4ff"> ${forecast.Day.IconPhrase}</h4>
			</div>

			<div class="my-auto">
				<span style="color: #dde0e4ff">${fahrenheitToCelsius(forecast.Temperature.Maximum.Value)}</span><span>/${fahrenheitToCelsius(forecast.Temperature.Minimum.Value)}</span>
			</div>
		</div>
	`).join(`<hr class="w-100">`)
}

function setTodayForecast(forecast) {
	console.log(forecast)
	document.getElementById("today-forcast").innerHTML = forecast.map((forecast) => `
		<div class="forecast-item">
			<span class="time"> ${dateToHour(forecast.DateTime)} </span>
			<img src="https://cdn-icons-png.flaticon.com/512/414/414825.png" alt="cloudy">
			<span class="temp">${fahrenheitToCelsius(forecast.Temperature.Value)}°</span>
		</div>
	`).join("<hr/>")
}

async function getWeatherData(location) {
	setLocation(location)

	const responses = await Promise.all([
		get5DayForecast(location.Key),
		getTodayForecast(location.Key)
	])

	set5DayForecast(responses[0])
	setTodayForecast(responses[1])
}