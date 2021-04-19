export async function getCurrentConditionsForLatLon(lat, lon, apiKey) {
	const owmWeatherData = await owmWeatherDataForLatLon(lat, lon, apiKey);
	if (!owmWeatherData) {
		return null;
	}
	const owmOneCallData = await ownOneCallDataForLatLon(lat, lon, apiKey);
	if (!owmOneCallData) {
		return null;
	}
	return extractOwmCurrentConditionData(owmWeatherData, owmOneCallData);
}

export async function getCurrentConditionsForCity(city, apiKey) {
	const owmWeatherData = await owmWeatherDataForCity(city, apiKey);
	if (!owmWeatherData) {
		return null;
	}
	const owmOneCallData = await ownOneCallDataForLatLon(owmWeatherData.coord.lat, owmWeatherData.coord.lon, apiKey);
	if (!owmOneCallData) {
		return null;
	}
	return extractOwmCurrentConditionData(owmWeatherData, owmOneCallData);
}

async function owmWeatherDataForLatLon(lat, lon, apiKey) {
	const weatherResponse = await fetch(
		`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
	);

	if (weatherResponse.status !== 200) {
		return null;
	}

	return await weatherResponse.json();
}

async function owmWeatherDataForCity(city, apiKey) {
	const weatherResponse = await fetch(
		`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}`
	);

	if (weatherResponse.status !== 200) {
		return null;
	}

	return await weatherResponse.json();
}

async function ownOneCallDataForLatLon(lat, lon, apiKey) {
	const oneCallResponse = await fetch(
		`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${apiKey}`
	);

	if (oneCallResponse.status !== 200) {
		return null;
	}

	return await oneCallResponse.json();
}

function extractOwmCurrentConditionData(owmWeatherData, owmOneCallData) {
	return {
		locationName: owmWeatherData.name,
		lat: owmWeatherData.coord.lat,
		lon: owmWeatherData.coord.lon,
		temp: owmWeatherData.main.temp,
		feelsLike: owmWeatherData.main.feels_like,
		icon: owmWeatherData.weather[0].icon,
		description: owmWeatherData.weather[0].description,
		warnings: owmOneCallData.alerts || null,
	};
}
