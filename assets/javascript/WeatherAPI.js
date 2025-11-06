const ACCUWEATHER_API_KEY = "zpka_4c902dcffc1e420d89266e698c538429_4c1d4a53	"
const CACHE_TIMEOUT = 1800 * 1000 // 30 minutes

async function cachedFetch(url) {
	const now = Date.now()

	const cachedData = localStorage.getItem(url)
	if (cachedData) {
		const cachedObject = JSON.parse(localStorage.getItem(url))

		if (now - cachedObject.timestamp < CACHE_TIMEOUT) {
			return cachedObject.data
		}
	}

	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${ACCUWEATHER_API_KEY}`,
		},
	})

	const data = await response.json()
	localStorage.setItem(url, JSON.stringify({ data: data, timestamp: now }))
	return data
}


const defaultLocationKey = "349727"

async function getDefaultLocation() {
	const url = `https://dataservice.accuweather.com/locations/v1/${defaultLocationKey}/`
	return cachedFetch(url)
}

async function lookupLocation(locationName) {
	const url =`https://dataservice.accuweather.com/locations/v1/cities/search?q=${locationName}`
	return cachedFetch(url)
}

async function get5DayForecast(locationKey) {
	const url = `https://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}`
	return cachedFetch(url)
}

async function getTodayForecast(locationKey) {
	const url = `https://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${locationKey}`
	return cachedFetch(url)
}