// ====== CONFIG ======
const API_KEY = '46ae00f0684b3290c6d72011d7019963'; // Replace with your OpenWeatherMap API key
const BASE_URL = "https://api.openweathermap.org/data/2.5";
const GEO_URL = "https://api.openweathermap.org/geo/1.0";

// ====== STATE ======
let unit = "metric"; // 'metric' (°C) or 'imperial' (°F)
let searchHistory = JSON.parse(localStorage.getItem("weatherHistory")) || [];

// ====== DOM REFS ======
const cityInput    = document.getElementById("city-input");
const weatherCard  = document.getElementById("weather-card");
const loader       = document.getElementById("loader");
const errorMsg     = document.getElementById("error-msg");
const errorText    = document.getElementById("error-text");
const suggestions  = document.getElementById("suggestions");

// ====== INIT ======
window.addEventListener("load", () => {
  updateClock();
  setInterval(updateClock, 1000);
  renderHistory();

  // Enter key search
  cityInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") fetchWeather();
  });

  // Auto-suggest on typing
  cityInput.addEventListener("input", debounce(handleSuggest, 400));

  // Hide suggestions when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-box") && !e.target.closest(".suggestions")) {
      suggestions.classList.add("hidden");
    }
  });
});

// ====== CLOCK ======
function updateClock() {
  const now = new Date();
  const opts = { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" };
  document.getElementById("current-datetime").textContent = now.toLocaleString("en-IN", opts);
}

// ====== UNIT TOGGLE ======
function setUnit(u) {
  unit = u;
  document.getElementById("btn-c").classList.toggle("active", u === "metric");
  document.getElementById("btn-f").classList.toggle("active", u === "imperial");

  // Re-fetch if a city is currently displayed
  const city = document.getElementById("city-name").textContent;
  if (city) fetchWeatherByCity(city);
}

// ====== FETCH WEATHER (entry point) ======
async function fetchWeather() {
  const city = cityInput.value.trim();
  if (!city) {
    showError("Please enter a city name.");
    return;
  }
  suggestions.classList.add("hidden");
  await fetchWeatherByCity(city);
}

async function fetchWeatherByCity(city) {
  showLoader(true);
  hideError();

  try {
    const res = await fetch(
      `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${unit}`
    );

    if (!res.ok) {
      if (res.status === 404) throw new Error("City not found. Check spelling and try again.");
      if (res.status === 401) throw new Error("Invalid API key. Please check your configuration.");
      throw new Error("Something went wrong. Please try again.");
    }

    const data = await res.json();
    displayWeather(data);
    saveHistory(data);

  } catch (err) {
    showError(err.message);
    weatherCard.classList.add("hidden");
  } finally {
    showLoader(false);
  }
}

// ====== DISPLAY WEATHER ======
function displayWeather(data) {
  const unitSymbol = unit === "metric" ? "°C" : "°F";
  const windUnit   = unit === "metric" ? "m/s" : "mph";

  document.getElementById("city-name").textContent    = data.name;
  document.getElementById("country-name").innerHTML   =
    `<i class="fas fa-location-dot"></i> ${data.sys.country} &nbsp;·&nbsp; ${data.coord.lat.toFixed(2)}°N, ${data.coord.lon.toFixed(2)}°E`;
  document.getElementById("temperature").textContent  = Math.round(data.main.temp);
  document.getElementById("temp-unit").textContent    = unitSymbol;
  document.getElementById("feels-like").textContent   = `${Math.round(data.main.feels_like)}${unitSymbol}`;
  document.getElementById("humidity").textContent     = `${data.main.humidity}%`;
  document.getElementById("wind-speed").textContent   = `${data.wind.speed} ${windUnit}`;
  document.getElementById("visibility").textContent   = `${(data.visibility / 1000).toFixed(1)} km`;
  document.getElementById("pressure").textContent     = `${data.main.pressure} hPa`;
  document.getElementById("cloud-cover").textContent  = `${data.clouds.all}% cloud`;
  document.getElementById("condition-text").textContent = data.weather[0].description;

  // Weather icon
  const iconCode = data.weather[0].icon;
  document.getElementById("weather-icon").src =
    `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  // Sunrise / Sunset (convert Unix timestamp)
  document.getElementById("sunrise").textContent = formatTime(data.sys.sunrise, data.timezone);
  document.getElementById("sunset").textContent  = formatTime(data.sys.sunset, data.timezone);

  weatherCard.classList.remove("hidden");
  hideError();
}

// ====== FORMAT TIME ======
function formatTime(unixTime, timezoneOffset) {
  const date = new Date((unixTime + timezoneOffset) * 1000);
  const hh = String(date.getUTCHours()).padStart(2, "0");
  const mm = String(date.getUTCMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

// ====== SEARCH HISTORY ======
function saveHistory(data) {
  const unitSymbol = unit === "metric" ? "°C" : "°F";
  const entry = {
    city: data.name,
    country: data.sys.country,
    temp: `${Math.round(data.main.temp)}${unitSymbol}`,
    icon: data.weather[0].icon,
    time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    ts: Date.now()
  };

  // Remove duplicates
  searchHistory = searchHistory.filter(h => h.city.toLowerCase() !== entry.city.toLowerCase());
  searchHistory.unshift(entry);

  // Keep max 8
  if (searchHistory.length > 8) searchHistory = searchHistory.slice(0, 8);

  localStorage.setItem("weatherHistory", JSON.stringify(searchHistory));
  renderHistory();
}

function renderHistory() {
  const list = document.getElementById("history-list");

  if (searchHistory.length === 0) {
    list.innerHTML = `
      <div class="empty-history">
        <i class="fas fa-magnifying-glass"></i>
        <p>No recent searches yet</p>
      </div>`;
    return;
  }

  list.innerHTML = searchHistory.map(h => `
    <div class="history-item" onclick="fetchWeatherByCity('${escapeHTML(h.city)}')">
      <div class="history-left">
        <img src="https://openweathermap.org/img/wn/${h.icon}.png"
             width="28" height="28" alt="" style="margin-right:2px"/>
        <div>
          <div class="history-city">${escapeHTML(h.city)}, ${escapeHTML(h.country)}</div>
          <div class="history-time">${h.time}</div>
        </div>
      </div>
      <div class="history-temp">${h.temp}</div>
    </div>
  `).join("");
}

function clearHistory() {
  searchHistory = [];
  localStorage.removeItem("weatherHistory");
  renderHistory();
}

// ====== AUTO SUGGEST ======
async function handleSuggest() {
  const query = cityInput.value.trim();
  if (query.length < 2) { suggestions.classList.add("hidden"); return; }

  try {
    const res = await fetch(
      `${GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`
    );
    if (!res.ok) return;
    const data = await res.json();

    if (!data.length) { suggestions.classList.add("hidden"); return; }

    suggestions.innerHTML = data.map(d => `
      <div class="suggestion-item" onclick="selectSuggestion('${escapeHTML(d.name)}')">
        <i class="fas fa-location-dot" style="color:#4A9EE8;margin-right:8px"></i>
        ${escapeHTML(d.name)}, ${d.state ? escapeHTML(d.state) + ", " : ""}${escapeHTML(d.country)}
      </div>
    `).join("");

    suggestions.classList.remove("hidden");
  } catch (_) {
    suggestions.classList.add("hidden");
  }
}

function selectSuggestion(city) {
  cityInput.value = city;
  suggestions.classList.add("hidden");
  fetchWeatherByCity(city);
}

// ====== UI HELPERS ======
function showLoader(show) {
  loader.classList.toggle("hidden", !show);
}

function showError(msg) {
  errorText.textContent = msg;
  errorMsg.classList.remove("hidden");
}

function hideError() {
  errorMsg.classList.add("hidden");
}

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
