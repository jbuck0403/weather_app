import API_KEY from "./apikey.js";
import { Forecast, GeoCode } from "./forecast.js";

const geoCode = new GeoCode(API_KEY);
const forecast = new Forecast(API_KEY);

const appendCityName = (data) => {
  const cityNameDiv = document.querySelector(".city-name");
  const cityName = geoCode.returnCityName(data);

  console.log(cityName);
  cityNameDiv.textContent = cityName;
};

const locationForm = document.querySelector(".location-form");
locationForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const zipInput = locationForm.querySelector(".zip-code-input");
  const btn = locationForm.querySelector(".location-form-submit");

  const zipCode = zipInput.value;
  zipInput.value = "";

  const data = await geoCode.returnGeoCodeData(zipCode);
  const latLong = geoCode.returnLatLong(data);
  appendCityName(data);

  const forecastData = await forecast.returnForecastData(latLong);
  console.log(forecastData);
  const forecastInfo = await forecast.returnForecast(forecastData);
  console.log(forecastInfo);
});
