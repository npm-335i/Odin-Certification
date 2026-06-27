const BASE_URL = "https://api.open-meteo.com/v1/forecast";
const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";

const form = document.getElementById("weatherForm");
const input = document.getElementById("locationInput");

const loadingEl = document.getElementById("loadingIndicator");
const errorEl = document.getElementById("errorMsg");
const weatherCard = document.getElementById("weatherCard");

const locationName = document.getElementById("locationName");
const countryName = document.getElementById("countryName");

const weatherIcon = document.getElementById("weatherIcon");
const tempDisplay = document.getElementById("tempDisplay");
const descDisplay = document.getElementById("descDisplay");

const humidityVal = document.getElementById("humidityVal");
const windVal = document.getElementById("windVal");
const feelsVal = document.getElementById("feelsVal");
const pressureVal = document.getElementById("pressureVal");

function getWeatherStatus(code) {
  const map = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",

    45: "Fog",
    48: "Fog",

    51: "Light drizzle",
    53: "Drizzle",
    55: "Heavy drizzle",

    61: "Light rain",
    63: "Rain",
    65: "Heavy rain",

    71: "Light snow",
    73: "Snow",
    75: "Heavy snow",

    80: "Rain showers",
    81: "Rain showers",
    82: "Heavy showers",

    95: "Thunderstorm",
    96: "Thunderstorm",
    99: "Thunderstorm",
  };

  return map[code] || "Unknown";
}

function getWeatherIcon(code) {
  if ([0, 1].includes(code)) return "Clear";
  if ([2, 3].includes(code)) return "Cloudy";

  if ([45, 48].includes(code)) return "Fog";

  if ([51, 53, 55].includes(code)) return "Drizzle";

  if ([61, 63, 65, 80, 81, 82].includes(code)) return "Rain";

  if ([71, 73, 75].includes(code)) return "Snow";

  if ([95, 96, 99].includes(code)) return "Storm";

  return "Weather";
}

async function getCoordinates(city) {
  const response = await fetch(
    `${GEO_URL}?name=${encodeURIComponent(city)}&count=1`,
  );

  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error("Location not found");
  }

  return data.results[0];
}

async function fetchWeather(city) {
  const place = await getCoordinates(city);

  const response = await fetch(
    `${BASE_URL}?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,pressure_msl,wind_speed_10m,weather_code`,
  );

  if (!response.ok) {
    throw new Error("Weather service unavailable");
  }

  const data = await response.json();

  return {
    city: place.name,
    country: place.country,

    temp: Math.round(data.current.temperature_2m),

    feels: Math.round(data.current.apparent_temperature),

    humidity: data.current.relative_humidity_2m,

    wind: Math.round(data.current.wind_speed_10m),

    pressure: Math.round(data.current.pressure_msl),

    description: getWeatherStatus(data.current.weather_code),

    icon: getWeatherIcon(data.current.weather_code),
  };
}

function renderWeather(weather) {
  locationName.textContent = weather.city;
  countryName.textContent = weather.country;

  weatherIcon.textContent = weather.icon;

  tempDisplay.innerHTML = `${weather.temp}<small>°C</small>`;

  descDisplay.textContent = weather.description;

  humidityVal.textContent = `${weather.humidity}%`;

  windVal.textContent = `${weather.wind} km/h`;

  feelsVal.textContent = `${weather.feels}°C`;

  pressureVal.textContent = `${weather.pressure} hPa`;

  weatherCard.classList.add("active");
}

function toggleLoading(state) {
  loadingEl.classList.toggle("active", state);
}

function showError(message) {
  errorEl.textContent = message;

  errorEl.classList.add("active");
}

function hideError() {
  errorEl.classList.remove("active");
}

async function searchWeather(event) {
  event.preventDefault();

  const city = input.value.trim();

  if (!city) return;

  hideError();

  weatherCard.classList.remove("active");

  toggleLoading(true);

  try {
    const weather = await fetchWeather(city);

    renderWeather(weather);
  } catch (error) {
    showError(error.message || "Something went wrong");
  } finally {
    toggleLoading(false);
  }
}

async function loadDefaultCity() {
  input.value = "London";

  await searchWeather(new Event("submit"));
}

form.addEventListener("submit", searchWeather);

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(loadDefaultCity, 200);
});
