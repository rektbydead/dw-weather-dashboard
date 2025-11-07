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

async function getWeatherData(location) {
	localStorage.setItem(`default-location`, JSON.stringify(location))
	await setLocation(location)

	const dropdown = document.getElementById("search-dropdown")
	dropdown.innerHTML = ""

	const responses = await Promise.all([
		get5DayForecast(location.Key),
		getTodayForecast(location.Key)
	])

	set5DayForecast(responses[0])
	setTodayForecast(responses[1])
}