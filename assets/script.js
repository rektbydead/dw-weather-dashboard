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


export { getLocationObject }