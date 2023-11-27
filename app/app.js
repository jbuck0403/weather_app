import API_KEY from "./apikey.js";
import { Forecast, GeoCode } from "./forecast.js";

const geoCode = new GeoCode(API_KEY);
const forecast = new Forecast(API_KEY);

const displayLocation = (data) => {
  const cityNameDiv = document.querySelector(".city");
  const cityName = geoCode.returnCityName(data);

  cityNameDiv.textContent = cityName;
};

const locationForm = document.querySelector(".location-form");
locationForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const zipInput = locationForm.querySelector(".zip-code-input");

  const zipCode = zipInput.value;
  zipInput.value = "";

  const data = await geoCode.returnGeoCodeData(zipCode);
  const latLong = geoCode.returnLatLong(data);
  displayLocation(data);

  const forecastData = await forecast.returnForecastData(latLong);
  console.log(forecastData);
  const forecastInfo = await forecast.returnForecast(forecastData);
  console.log(forecastInfo);

  displayToday(forecastInfo);
  displayForecast(forecastInfo);
});

const displayToday = (forecastInfo) => {
  displayDateTime(forecastInfo);
  displayTemp(forecastInfo);
  displayWeatherIcon(forecastInfo);
  displayWeatherType(forecastInfo);
  displayWeatherDesc(forecastInfo);

  const [high, low] = findTempRange(forecastInfo);
  displayHigh(high);
  displayLow(low);
  displayHumidity(forecastInfo);

  const todayDiv = document.querySelector("#today");
  todayDiv.classList.add("today");
};

const displayForecast = (
  forecastData,
  forecastClass = ".forecast",
  divClass = "hourly-forecast",
  imgClass = "forecast-icon",
  dateTimeClass = "forecast-date-time",
  tempClass = "forecast-temp",
  weatherTypeClass = "forecast-weather-type"
) => {
  const forecastDiv = document.querySelector(forecastClass);

  let forecastHTML = "";

  forecastData.forEach((forecast) => {
    let [date, time] = processDateTime(forecast.dateTime);
    forecastHTML += `<div class="${divClass}">`;
    forecastHTML += `<div class="${dateTimeClass}">${date} ${time}</div>`;
    forecastHTML += `<div class="${tempClass}">${processTemp(
      forecast.temp
    )}</div>`;
    forecastHTML += `<div class="${weatherTypeClass}">${forecast.weather.type}</div>`;
    forecastHTML += `<img class="${imgClass}" src="${forecast.weather.iconURL}" />`;
    forecastHTML += `</div>`;
  });

  forecastDiv.innerHTML = forecastHTML;
};

const processTemp = (temp) => {
  return `${temp}° F`;
};

const processDateTime = (dateTime) => {
  dateTime = dateTime.slice(0, -3).split(" ");

  const dateObj = new Date(dateTime[0]);

  const day = dateObj.getDay();
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return [daysOfWeek[day], dateTime[1]];
};

const displayDateTime = (
  forecastInfo,
  dateClass = ".today-date",
  timeClass = ".today-time",
  idx = 0
) => {
  const dateDiv = document.querySelector(dateClass);
  const timeDiv = document.querySelector(timeClass);

  const [date, time] = processDateTime(forecastInfo[idx].dateTime);

  dateDiv.textContent = date;
  timeDiv.textContent = time;
};

const displayTemp = (forecastInfo, div = ".today-temp", idx = 0) => {
  const tempDiv = document.querySelector(div);

  const temp = forecastInfo[idx].temp;

  tempDiv.textContent = processTemp(temp);
};

const displayWeatherIcon = (forecastInfo, div = ".today-icon", idx = 0) => {
  const iconDiv = document.querySelector(div);

  const icon = forecastInfo[idx].weather.iconURL;

  iconDiv.src = icon;
};

const displayWeatherType = (
  forecastInfo,
  div = ".today-weather-type",
  idx = 0
) => {
  const weatherTypeDiv = document.querySelector(div);

  const weatherType = forecastInfo[idx].weather.type;

  weatherTypeDiv.textContent = weatherType;
};

const displayWeatherDesc = (
  forecastInfo,
  div = ".today-weather-desc",
  idx = 0
) => {
  const weatherDescDiv = document.querySelector(div);

  const weatherDesc = forecastInfo[idx].weather.description;

  weatherDescDiv.textContent = weatherDesc;
};

const findTempRange = (forecastInfo) => {
  let high = 0;
  let low = 200;
  let temp;

  forecastInfo.forEach((forecast) => {
    temp = forecast.temp;
    if (temp > high) high = temp;
    if (temp < low) low = temp;
  });

  return [`High: ${processTemp(high)}`, `Low: ${processTemp(low)}`];
};

const displayHigh = (high, div = ".today-high", idx = 0) => {
  const highDiv = document.querySelector(div);

  highDiv.textContent = high;
};
const displayLow = (low, div = ".today-low", idx = 0) => {
  const lowDiv = document.querySelector(div);

  lowDiv.textContent = low;
};
const displayHumidity = (forecastInfo, div = ".today-humidity", idx = 0) => {
  const humidityDiv = document.querySelector(div);

  const humidity = forecastInfo[idx].humidity;

  humidityDiv.textContent = `Humidity: ${humidity} %`;
};
