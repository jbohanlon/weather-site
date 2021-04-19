// Returns 7-day forecast data for given latitude and longitude coordinates
export async function getMultiDayForecast(lat, lon) {
	const coordinateRequest = await fetch(`https://api.weather.gov/points/${lat},${lon}`);
	const coordinateData = await coordinateRequest.json();

	const nwsResponse = await fetch(coordinateData.properties.forecast);
	return await nwsResponse.json();
}
