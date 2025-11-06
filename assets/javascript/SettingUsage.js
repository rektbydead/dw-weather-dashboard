function setDefaultSettings() {
	const useCelsius = localStorage.getItem("settings-useCelsius")
	const useTwelveHourNotation = localStorage.getItem("settings-useTwelveHourNotation")
	const useWeekDay = localStorage.getItem("settings-useWeekDay")

	if (useCelsius === null) {
		localStorage.setItem("settings-useCelsius", "false")
	}

	if (useTwelveHourNotation === null) {
		localStorage.setItem("settings-useTwelveHourNotation", "true")
	}

	if (useWeekDay === null) {
		localStorage.setItem("settings-useWeekDay", "true")
	}
}

setDefaultSettings()

function shouldUseWeekDay() {
	return localStorage.getItem("settings-useWeekDay") === "true"
}

function shouldUseCelsius() {
	return localStorage.getItem("settings-useCelsius") === "true"
}

function shouldUseTwelveHourNotation() {
	return localStorage.getItem("settings-useTwelveHourNotation") === "true"
}

document.addEventListener("DOMContentLoaded", () => {
})