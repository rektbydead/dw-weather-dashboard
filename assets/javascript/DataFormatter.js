function fahrenheitToCelsius(fahrenheit) {
	return Math.ceil((fahrenheit - 32) * 5 / 9)
}

function dateToWeekDay(dateStr, useWeekDay) {
	const date = new Date(dateStr)
	if (useWeekDay === false) {
		return new Intl.DateTimeFormat('en-US', {
			month: 'short',
			day: 'numeric'
		}).format(date);
	}

	const weekday = date.toLocaleString("en-US", { weekday: "long" })

	const today = new Date()
	const isToday =
		date.getFullYear() === today.getFullYear() &&
		date.getMonth() === today.getMonth() &&
		date.getDate() === today.getDate()

	return (isToday ? "Today" : weekday).slice(0, 3)
}

function dateToHour(dateStr, useAmPm) {
	const date = new Date(dateStr)

	const hoursUTC = date.getUTCHours()
	if (useAmPm === false) return `${hoursUTC < 10 ? `0${hoursUTC}` : hoursUTC}:00`

	const hours12 = ((hoursUTC + 11) % 12) + 1
	const ampm = hoursUTC >= 12 ? "PM" : "AM"
	return `${hours12} ${ampm}`
}