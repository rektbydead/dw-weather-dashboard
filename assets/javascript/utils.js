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