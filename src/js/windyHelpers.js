import { windyKey } from "./config";

export function initializeWindyMap(lat, lon, locationName) {
	applyWindyReinitializationWorkaround();

	const options = {
		key: windyKey,
		lat: lat,
		lon: lon,
		zoom: 7,
	};

	// Initialize Windy. Note that Windy ALWAYS looks for and sets up the map in a div with id "windy".
	window.windyInit(options, (windyAPI) => {
		const { map } = windyAPI;

		// Put a marker with the searched place name on the map
		window.L.popup()
			.setLatLng([lat, lon])
			.setContent(capitalizeWords(locationName) || "Your Location")
			.openOn(map);
	});
}

function applyWindyReinitializationWorkaround() {
	// Make a copy of the pre-initialized state of Windy's W object
	if (!window.preInitializedW) {
		window.preInitializedW = Object.assign({}, window.W);
	}
	// If Windy HAS booted already (i.e. was initialized once before via windyInit),
	// reassign the pre-initialized W object copy to W so that we can safely initialize it
	// again. We need to do this because Windy isn't built for multiple runs without a page refresh.
	if (window.W.windyBoot) {
		window.W = Object.assign({}, window.preInitializedW);
	}
}

// Return a string with the first letter capitalized
function capitalizeFirstLetter(str) {
	return str.charAt(0).toUpperCase() + str.substring(1);
}

// Return a string with the first letter of each word capitalized
function capitalizeWords(str) {
	if (str.length === 0) {
		return str;
	}

	return str
		.split(" ")
		.map((word) => capitalizeFirstLetter(word))
		.join(" ");
}
