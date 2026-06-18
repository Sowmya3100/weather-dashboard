# 🌤️ WeatherNow Dashboard

A clean, modern weather dashboard built with HTML, CSS, and JavaScript using the OpenWeatherMap API.

---

## 🚀 Setup & Run Instructions

### 1. Get a Free API Key
- Visit [https://openweathermap.org/api](https://openweathermap.org/api)
- Sign up for a free account
- Go to **API Keys** in your dashboard and copy your key
- Note: New keys may take up to 2 hours to activate

### 2. Add Your API Key
Open `script.js` and replace line 2:
```js
const API_KEY = "YOUR_API_KEY_HERE";
```
with your actual key:
```js
const API_KEY = "abc123yourrealkeyhere";
Add your OpenWeatherMap API key in script.js before running the app.
```

### 3. Run the App
No installation needed. Just open `index.html` in any modern browser:
```
Double-click index.html
```
Or use VS Code Live Server for best experience.

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| Structure | HTML5 |
| Styling | CSS3 (CSS Variables, Grid, Flexbox, Animations) |
| Logic | Vanilla JavaScript (ES6+) |
| Weather Data | [OpenWeatherMap API](https://openweathermap.org/api) (Current Weather + Geocoding) |
| Icons | Font Awesome 6 |
| Fonts | Google Fonts — Inter, DM Mono |
| Storage | Browser localStorage |

---

## ✨ Features

- **City Search** — Search any city worldwide
- **Auto-suggest** — City name suggestions while typing (Geocoding API)
- **Current Weather** — Temperature, feels like, humidity, wind speed, visibility, pressure, cloud cover
- **Sunrise & Sunset** — Local time for searched city
- **°C / °F Toggle** — Switch units anytime
- **Search History** — Last 8 cities stored in localStorage, clickable to reload
- **Clear History** — One-click history wipe
- **Error Handling** — Friendly messages for invalid cities, API errors, empty input
- **Responsive Design** — Works on desktop and mobile
- **Animated Sky Background** — Subtle atmosphere enhancing the weather theme

---

## 📌 Assumptions Made

1. The free tier of OpenWeatherMap API (1,000 calls/day) is sufficient for this use case.
2. Search history is stored per browser (localStorage), not across devices.
3. Visibility is assumed to be in meters as returned by the API and converted to km for display.
4. Sunrise/Sunset times are shown in the **local time of the searched city** using the timezone offset from the API.
5. A maximum of 8 recent searches are stored to keep the UI clean.

---

## 🤖 AI-Assisted Development Note

## 🤖 AI-Assisted Development Note

I used **ChatGPT and Claude (Anthropic)** as AI development assistants during the project. ChatGPT was mainly used for brainstorming ideas, improving the UI design approach, reviewing features, and discussing implementation strategies. Claude was used as a development assistant for helping structure the HTML/CSS/JavaScript implementation, improving code organization, debugging, and implementing application features.

AI assistance helped with designing the project structure, refining the dashboard layout, implementing features such as city search, auto-suggestions, localStorage-based search history, error handling, and improving overall code quality. I reviewed, modified, and tested the generated suggestions to ensure the final application worked correctly with the OpenWeatherMap API.

I made deliberate decisions to keep the project as a lightweight vanilla JavaScript application instead of using a framework, as it was suitable for this dashboard scope. I also reviewed the generated code, understood the logic behind each function, adjusted the UI design elements (layout, typography, and styling), and validated API integration using OpenWeatherMap documentation.

One challenge encountered was ensuring sunrise and sunset times displayed according to the searched city's local timezone rather than the browser's timezone. This was solved by using the timezone offset provided by the API response and correctly converting the time before displaying it.
---

## 📁 Project Structure

```
weather-dashboard/
├── index.html      # Main HTML structure
├── style.css       # All styles (variables, layout, animations)
├── script.js       # All logic (API calls, DOM updates, localStorage)
└── README.md       # This file
```

---

## 👩‍💻 Author

**Sowmya M**  
B.E. Computer Science (Data Science)  
[GitHub](https://github.com/Sowmya3100)
