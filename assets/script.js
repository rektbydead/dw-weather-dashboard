async function getLocationObject(locationName) {
	const response = await fetch(`https://dataservice.accuweather.com/locations/v1/cities/search?q=${locationName}`)
	const data = await response.json()

	return data.map((location) => {
		return {
			'key': location.key,
			'country': location.Country.EnglishName,
			'name': location.AdministrativeArea.EnglishName,
			'geo_location': location.GeoPosition
		}
	})
}

let searchTypingTimeout = undefined

document.addEventListener("DOMContentLoaded", () => {
	const input = document.getElementById("weather-search-input");
	const dropdown = document.getElementById("search-dropdown");

	const cities = [
		"New York", "Los Angeles", "Chicago", "Houston", "Miami",
		"London", "Paris", "Berlin", "Tokyo", "Sydney"
	]

	input.addEventListener("input", () => {
		clearTimeout(searchTypingTimeout)

		searchTypingTimeout = setTimeout(() => {
			const query = input.value.trim().toLowerCase()

			if (query.length === 0) {
				dropdown.style.display = "none"
				return
			}

			const matches = cities.filter(city => city.toLowerCase().includes(query))

			if (matches.length === 0) {
				dropdown.style.display = "none"
				return
			}

			dropdown.innerHTML = matches.map((city) => `
			<li class="w-100 m-2" style="padding: 8px; cursor: pointer" onclick="console.log('clicou mudou:  ${city}')">
				<h2 style="margin: 0; font-size: 1.2em;">${city}</h2>
				<h4 style="margin: 0; font-weight: normal; font-size: 0.9em;">USA</h4>
			</li>`
			).join("");


			dropdown.style.display = "block"
		}, 150)
	})

	/* Close dropdown when clicking outside */
	document.addEventListener("click", (e) => {
		if (!e.target.closest(".search-wrapper")) {
			dropdown.style.display = "none";
		}
	})
});

// export { getLocationObject }