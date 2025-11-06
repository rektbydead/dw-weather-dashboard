const ACCUWEATHER_API_KEY = "zpka_760a7f024433458ea1b84c1b33211150_924d685f"
const CACHE_TIMEOUT = 1800 * 1000 // 30 minutes

async function cachedFetch(url, options) {
	const now = Date.now();
	const cached = localStorage.get(url);

	if (cached && now - cached.timestamp < CACHE_TIMEOUT) {
		return cached.data
	}

	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${ACCUWEATHER_API_KEY}`,
		},
	})

	const data = await response.json()

	localStorage.setItem(url, { data, timestamp: now })
	return data;
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