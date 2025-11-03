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
	localStorage.setItem(`default-location`, JSON.stringify(location))
	return location
}

async function getLocationByKey(locationKey) {
	const response = await fetch(`https://dataservice.accuweather.com/locations/v1/${locationKey}/`,{
		headers: {
			Authorization: `Bearer ${ACCUWEATHER_API_KEY}`,
		},
	})

	return response.json()
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
	const splicedData = data.splice(0, 3)
	localStorage.setItem(`location-lookup-${locationName}`, JSON.stringify(splicedData))
	return splicedData
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