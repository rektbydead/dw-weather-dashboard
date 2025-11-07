document.addEventListener("DOMContentLoaded", () => {
	function saveSettings() {
		const useCelsius = document.querySelector('input[name="temperature"]:checked').value;
		const useTwelveHourNotation = document.querySelector('input[name="hour-format"]:checked').value;
		const useWeekDay = document.querySelector('input[name="date-format"]:checked').value;
		console.log(useCelsius, useTwelveHourNotation, useWeekDay)
		localStorage.setItem("settings-useCelsius", useCelsius);
		localStorage.setItem("settings-useTwelveHourNotation", useTwelveHourNotation);
		localStorage.setItem("settings-useWeekDay", useWeekDay);
	}

	document.querySelectorAll('input[name="temperature"], input[name="hour-format"], input[name="date-format"]').forEach(input => {
		input.addEventListener("change", saveSettings);
	})

	document.querySelector(`input[name="temperature"][value="${localStorage.getItem("settings-useCelsius")}"]`).checked = true
	document.querySelector(`input[name="hour-format"][value="${localStorage.getItem("settings-useTwelveHourNotation")}"]`).checked = true
	document.querySelector(`input[name="date-format"][value="${localStorage.getItem("settings-useWeekDay")}"]`).checked = true
});