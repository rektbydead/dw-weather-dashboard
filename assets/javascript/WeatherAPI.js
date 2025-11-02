const ACCUWEATHER_API_KEY = "zpka_760a7f024433458ea1b84c1b33211150_924d685f"

const defaultLocationKey = "349727"

async function getDefaultLocation() {
	const defaultLocationString = localStorage.getItem(`default-location`)
	if (defaultLocationString) {
		return JSON.parse(defaultLocationString)
	}

	const response = await fetch(`https://dataservice.accuweather.com/locations/v1/${defaultLocationKey}/`,{
		headers: {
			Authorization: `Bearer ${ACCUWEATHER_API_KEY}`,
		},
	})

	const location = await response.json()
	const locationObject = {
		'key': location.Key,
		'country': location.Country.EnglishName,
		'name': location.AdministrativeArea.EnglishName,
		'geo_location': location.GeoPosition
	}

	localStorage.setItem(`default-location`, JSON.stringify(locationObject))
	return locationObject
}

async function lookupLocation(locationName) {
	const savedLocationString = localStorage.getItem(`location-lookup-${locationName}`)
	if (savedLocationString) {
		return JSON.parse(savedLocationString)
	}

	const response = await fetch(`https://dataservice.accuweather.com/locations/v1/cities/search?q=${locationName}`,{
		headers: {
			Authorization: `Bearer ${ACCUWEATHER_API_KEY}`,
		},
	})

	const data = await response.json()
	const mappedData = data.map((location) => {
		return {
			'key': location.Key,
			'country': location.Country.EnglishName,
			'name': location.AdministrativeArea.EnglishName,
			'geo_location': location.GeoPosition
		}
	}).splice(0, 3)

	localStorage.setItem(`location-lookup-${locationName}`, JSON.stringify(mappedData))
	return mappedData
}

async function get5DayForecast(locationKey) {
	const response = await fetch(`https://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}`,{
		headers: {
			Authorization: `Bearer ${ACCUWEATHER_API_KEY}`,
		},
	})

	return await response.json()
}

async function getTodayForecast(locationKey) {
	const response = await fetch(`https://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${locationKey}`,{
		headers: {
			Authorization: `Bearer ${ACCUWEATHER_API_KEY}`,
		},
	})

	return await response.json()
}