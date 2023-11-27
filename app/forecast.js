class APIData {
  constructor(API_KEY) {
    this.API_KEY = API_KEY;
  }

  returnData = async (url) => {
    const response = await fetch(url);
    const data = await response.json();

    return data;
  };
}

export class ZipToState extends APIData {
  constructor(API_KEY) {
    super(API_KEY);
  }

  returnZipData = (zipCode) => {
    const url = `https://api.zipcodestack.com/v1/search?codes=${zipCode}&country=us&apikey=${this.API_KEY}`;

    return this.returnData(url);
  };

  returnStateName = (data, zipCode) => {
    return data["results"][zipCode][0]["state_code"];
  };

  returnLatLong = (data, zipCode) => {
    return {
      lat: data["results"][zipCode][0]["latitude"],
      long: data["results"][zipCode][0]["longitude"],
    };
  };

  returnCityName = (data, zipCode) => {
    return data["results"][zipCode][0]["city_en"];
  };
}

export class Forecast extends APIData {
  constructor(API_KEY) {
    super(API_KEY);
  }

  returnForecastData = (latLong) => {
    const lat = latLong["lat"];
    const long = latLong["long"];

    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${this.API_KEY}`;

    return this.returnData(url);
  };

  returnForecast = async (data) => {
    const forecast = [];
    data["list"].forEach((forecastBlock) => {
      forecast.push({
        dateTime: forecastBlock["dt_txt"],
        temp: this.returnTemp(forecastBlock),
        humidity: forecastBlock["main"]["humidity"],
        weather: this.returnWeather(forecastBlock["weather"][0]),
      });
    });

    return forecast;
  };

  returnTemp = (tempData) => {
    const kelvinToFahrenheit = (k) => {
      return Math.round((k - 273.15) * (9 / 5) + 32);
    };
    return kelvinToFahrenheit(tempData["main"]["temp"]);
  };

  returnWeather = (weatherData) => {
    return {
      type: weatherData["main"],
      description: weatherData["description"],
      iconURL: this.returnWeatherIcon(weatherData["icon"]),
    };
  };

  returnWeatherIcon = (iconCode) => {
    return `http://openweathermap.org/img/w/${iconCode}.png`;
  };
}
