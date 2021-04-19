export function renderWeather(currentConditions, multiDayForecast) {
	return (
		renderWeatherWarnings(currentConditions.warnings) +
		renderCurrentConditions(currentConditions) +
		renderWindyContainer() +
		renderMultiDayForecast(multiDayForecast)
	);
}

function renderWeatherWarnings(warnings) {
	if (!warnings) {
		return "";
	}

	return `
		<div class="container">
			<div id="weather-warnings-container">
				<div class="alert alert-warning mt-3 text-center text-md-left" role="alert">
					<span class="d-inline-block mt-0 mt-md-1">There are weather warnings in this area.</span>
					<button
						id="toggle-warnings-button"
						class="btn btn-sm btn-warning float-md-right mt-1 mt-md-0"
						type="button"
						data-toggle="collapse"
						data-target="#weather-warnings"
						aria-expanded="false"
						aria-controls="weather-warnings"
					>
						Show weather warnings
					</button>
					<div class="clearfix"></div>
					<div id="weather-warnings" class="collapse">
						<h1 class="h3 my-3">Weather Warnings</h1>
						${warnings.map((warning) => formatWeatherWarning(warning.description)).join("")}
					</div>
				</div>
			</div>
		</div>
	`;
}

function formatWeatherWarning(text) {
	const lines = text.split("*");
	const headline = lines[0];
	const details = lines.slice(1);

	return `
		<div class="weather-warning">
			<p><strong>${headline}</strong></p>
			${details.length === 0 ? "" : `<ul><li>${details.join("</li><li>")}</li></ul>`}
		</div>
	`;
}

function renderCurrentConditions(currentConditions) {
	return `
		<div class="container">
			<div id="current-weather" class="text-center">
				${renderWeatherImage(currentConditions.icon, currentConditions.description)}
				${renderCurrentWeatherDescription(currentConditions.locationName, currentConditions.temp, currentConditions.feelsLike)}
			</div>
		</div>
	`;
}

function renderWeatherImage(icon, description) {
	// Weather images from OWM: https://openweathermap.org/weather-conditions#Icon-list
	return `<img class="current-weather-image" src="https://openweathermap.org/img/wn/${icon}@4x.png" alt="${description}"/>`;
}

function renderCurrentWeatherDescription(locationName, temp, feelsLike) {
	return `<p>Right now in ${locationName}, it's ${kelvinToFahrenheitRounded(
		temp
	)}&deg;F and feels like ${kelvinToFahrenheitRounded(feelsLike)}&deg;F</p>`;
}

function kelvinToFahrenheitRounded(temp) {
	return Math.round((temp - 273.15) * 1.8 + 32);
}

function renderWindyContainer() {
	return `<div id="windy" class="my-5" style="height: 500px"></div>`;
}

function renderMultiDayForecast(multiDayForecast) {
	const forecastPeriods = multiDayForecast.properties.periods.map((timePeriodData, forecastIndex) => {
		let classes = "col-lg-4 col-md-6 mb-3";

		if (forecastIndex === multiDayForecast.properties.periods.length - 2) {
			// Second-to-last forecast card
			classes += " ml-lg-auto";
		} else if (forecastIndex === multiDayForecast.properties.periods.length - 1) {
			// Last forecast card
			classes += " mr-lg-auto";
		}

		return `
			<div class="${classes}">
				<div class="card h-100">
					<img src="${timePeriodData.icon}" class="card-img-top" alt="${timePeriodData.shortForecast}" />
					<div class="card-body">
						<h5 class="card-title">${timePeriodData.name}</h5>
						<p class="card-text">${timePeriodData.detailedForecast}</p>
					</div>
				</div>
			</div>
		`;
	});

	return `
	<div class="container">
		<h1 class="h2">Seven-Day Forecast</h1>
		<div id="multi-day-forecast" class="row">
			${forecastPeriods.join("")}
		</div>
	</div>
	`;
}

export function renderError(errorMessage) {
	return `
		<div class="container">
			<div id="errors" class="alert alert-danger" role="alert">${errorMessage}</div>
		</div>
	`;
}
