# Weather Site
This is a weather information site that displays an interactive weather map and a 7-day forecast for any U.S. city. City to lat-long coordinate resolution and current weather conditions are retrieved from the OpenWeatherMap API, future forecast data comes from the National Weather Service, and the interactive map is powered by the Windy map forecast API.

To run the code yourself, you'll need to get free API keys from OpenWeatherMap and Windy, and then create a file at src/js/config.js that looks like this:

```js
export const openWeatherMapKey = "your_openweathermap_key_here";
export const windyKey = "your_windy_key_here";
```
