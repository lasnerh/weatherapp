const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const apiKey = "889bbe94022d6b7275b74746d6474250";

weatherForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const city = cityInput.value;

  if (city) {
    try {
      const weatherData = await getWeatherData(city);
      const forecastData = await getForecastData(city);
      displayWeatherInfo(weatherData);
      displayForecastInfo(forecastData);
    } catch (error) {
      console.error(error);
      displayError(error);
    }
  } else {
    displayError("Please Enter a city");
  }
});

async function getWeatherData(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error("Could not fetch weather data 😡");
  }

  return await response.json();
}

async function getForecastData(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&cnt=8`;

  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error("Could not fetch weather data 😡");
  }

  return await response.json();
}

function createColumn(title, value) {
  const col = document.createElement("div");
  const heading = document.createElement("h2");
  const valueDisplay = document.createElement("p");

  heading.textContent = title;
  valueDisplay.textContent = value;

  col.classList.add("col");
  col.appendChild(heading);
  col.appendChild(valueDisplay);
  return col;
}

// Row for forecastData
function createRow(time, temp, wind, rain) {
  const row = document.createElement("div");
  const timeDisplay = document.createElement("span");
  const tempDisplay = document.createElement("p");
  const windDisplay = document.createElement("p");
  const rainDisplay = document.createElement("p");

  timeDisplay.textContent = time;
  tempDisplay.textContent = temp;
  windDisplay.textContent = wind;
  rainDisplay.textContent = rain;

  row.classList.add("row");

  row.appendChild(timeDisplay);
  row.appendChild(tempDisplay);
  row.appendChild(windDisplay);
  row.appendChild(rainDisplay);
  return row;
}

function displayForecastInfo(data) {
  const row = document.createElement("div");
  row.classList.add("rows");

  data.list.forEach((entry) => {
    const time = entry.dt_txt.slice(11, 16);
    const temp = `${entry.main.temp.toFixed(1)}°C`;
    const wind = `${(entry.wind.speed * 3.6).toFixed(1)} km/h`;
    const rain = `${Math.round(entry.pop * 100)}%`;

    row.appendChild(createRow(time, temp, wind, rain));
  });

  card.appendChild(row);
}

function displayWeatherInfo(data) {
  const {
    name: city,
    main: { temp, humidity },
    wind,
    rain,
    weather: [{ description, id }],
  } = data;

  console.log(data);

  card.textContent = "";
  card.style.display = "flex";

  let rainMm = 0;

  if (data.rain) {
    rainMm = data.rain["1h"];
  }

  // constants
  const windKmh = wind.speed * 3.6; // API gives meters per second. 1 m/s equals 3.6 km/h so multiply by 3.6
  const cols = document.createElement("div");
  const cityDisplay = document.createElement("h1");
  const tempDisplay = document.createElement("p");
  const humidityDisplay = document.createElement("p");
  const descDisplay = document.createElement("p");
  const weatherSymbol = document.createElement("p");

  // column Temperature
  cols.appendChild(createColumn("Temperature", `${temp.toFixed(1)}°C`));
  // column Wind
  cols.appendChild(createColumn("Wind", `${windKmh.toFixed(1)} km/h`)); // toFixed(1) rounds to one decimal
  // column Rain
  cols.appendChild(createColumn("Rain", `${rainMm} mm`));

  cols.classList.add("cols");
  card.appendChild(cols);

  cityDisplay.textContent = city;
  tempDisplay.textContent = `${temp.toFixed(1)}°C`;
  humidityDisplay.textContent = `Humidity: ${humidity}%`;
  descDisplay.textContent = description;
  weatherSymbol.textContent = getWeatherSymbol(id);

  cityDisplay.classList.add("cityDisplay");
  tempDisplay.classList.add("tempDisplay");
  humidityDisplay.classList.add("humidityDisplay");
  descDisplay.classList.add("descDisplay");
  weatherSymbol.classList.add("weatherEmoji");

  card.appendChild(cityDisplay);
  card.appendChild(tempDisplay);
  card.appendChild(humidityDisplay);
  card.appendChild(descDisplay);
  card.appendChild(weatherSymbol);
}

function getWeatherSymbol(weatherId) {
  switch (true) {
    case weatherId >= 200 && weatherId < 300:
      return "⛈️";
    case weatherId >= 300 && weatherId < 400:
      return "🌧️";
    case weatherId >= 500 && weatherId < 600:
      return "🌧️";
    case weatherId >= 600 && weatherId < 700:
      return "❄️";
    case weatherId >= 700 && weatherId < 800:
      return "🌬️";
    case weatherId === 800:
      return "☀️";
    case weatherId >= 801 && weatherId < 810:
      return "☁️";
    default:
      return "❌";
  }
}

function displayError(message) {
  const errorDisplay = document.createElement("p");
  errorDisplay.textContent = message;
  errorDisplay.classList.add("errorDisplay");

  card.textContent = "";
  card.style.display = "flex";
  card.appendChild(errorDisplay);
}
