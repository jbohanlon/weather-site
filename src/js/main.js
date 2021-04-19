import $ from "jquery";
import { openWeatherMapKey } from "./config";
import { getCurrentConditionsForLatLon, getCurrentConditionsForCity } from "./openWeatherMapHelpers";
import { getMultiDayForecast } from "./nwsHelpers";
import { initializeWindyMap } from "./windyHelpers";
import { renderWeather, renderError } from "./weatherRenderers";

window.addEventListener("DOMContentLoaded", () => {
	setUpLocationSubmissionFormHandler();
	setUpWeatherWarningsToggle();

	navigator.geolocation.getCurrentPosition(
		async (geolocationPosition) => {
			const currentConditions = await getCurrentConditionsForLatLon(
				geolocationPosition.coords.latitude,
				geolocationPosition.coords.longitude,
				openWeatherMapKey
			);
			if (!currentConditions) {
				displaySearchError(`Could not find weather data for your location.`);
				return;
			}

			const multiDayForecast = await getMultiDayForecast(
				geolocationPosition.coords.latitude,
				geolocationPosition.coords.longitude
			);
			if (!multiDayForecast) {
				displaySearchError(`Could not find weather data for your location.`);
				return;
			}

			displayWeather(currentConditions, multiDayForecast);
		},
		async (geolocationError) => {
			displaySearchError(`Please allow your location to be detected or enter a U.S. city.`);
		}
	);
});

function setUpLocationSubmissionFormHandler() {
	document.getElementById("weather-form").addEventListener("submit", async (e) => {
		e.preventDefault();

		const city = document.getElementById("city-input").value;

		if (!city) {
			displaySearchError("Please enter a city.");
			return;
		}

		const currentConditions = await getCurrentConditionsForCity(city, openWeatherMapKey);
		if (!currentConditions) {
			displaySearchError(`Could not find U.S. city: ${escapeHtml(city)}`);
			return;
		}

		const multiDayForecast = await getMultiDayForecast(currentConditions.lat, currentConditions.lon);
		if (!multiDayForecast) {
			displaySearchError(`Could not find U.S. city: ${escapeHtml(city)}`);
			return;
		}

		displayWeather(currentConditions, multiDayForecast);
	});
}

// Set up show/hide listeners for collapse events for the #weather-warnings element to change show/hide button text.
function setUpWeatherWarningsToggle() {
	$("#weather-output")
		.on("hide.bs.collapse", "#weather-warnings", function () {
			$("#toggle-warnings-button").text("Show weather warnings");
		})
		.on("show.bs.collapse", "#weather-warnings", function () {
			$("#toggle-warnings-button").text("Hide weather warnings");
		});
}

function displaySearchError(errorMessage) {
	document.getElementById("weather-output").innerHTML = renderError(errorMessage);
}

function displayWeather(currentConditions, multiDayForecast) {
	document.getElementById("weather-output").innerHTML = renderWeather(currentConditions, multiDayForecast);
	initializeWindyMap(currentConditions.lat, currentConditions.lon, currentConditions.locationName);
}

// Replaces dangerous characters with equivalent HTML entities for safe display in HTML
function escapeHtml(str) {
	return str
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}
