/** Agricultural weather page. */
export const weather = {
  loading: "Syncing satellite data...",
  currentLocation: "Current location",
  forecastAt: "Forecast at {time}",
  updatedNow: "Just updated",

  // Crop filter
  cropAll: "All",
  cropVegetable: "Vegetables",
  cropFruit: "Fruit trees",
  cropFlower: "Flowers",

  // Alerts
  noRisk: "No weather hazards during this window.",

  // Metrics
  feelsLike: "Feels like",
  rainChance: "Chance of rain:",
  windSpeed: "Wind speed",
  humidity: "Humidity",
  uvIndex: "UV index",
  uvLow: "Low",
  uvModerate: "Moderate",
  uvHigh: "High",
  uvExtreme: "Extreme",
  hourly24: "24-hour detail",
  pressure: "Pressure",
  now: "Now",

  // Plant doctor
  plantDoctor: "Plant doctor",
  healthyDefault: "Conditions are good",
  healthyDefaultDesc:
    "The weather is excellent for healthy plant growth right now.",

  // Multi-day forecast
  eightDayCycle: "8-day outlook",
  today: "Today",
  stableWeather: "Stable weather",

  // Regional map
  exploreMore: "Want to explore more?",
  collapse: "Collapse",
  expandMap: "Expand map & regions",
  regionalData: "Regional data",
  regionAll: "All",
  regionNorth: "Northern Vietnam",
  regionSouth: "Southern Vietnam",
  cityHanoi: "Hanoi",
  cityHanoiStatus: "Clear skies",
  cityDalat: "Da Lat",
  cityDalatStatus: "Light fog",
  regionalNote:
    "Satellite data for other regions is being extracted in real time.",

  // ── Mobile ────────────────────────────────────────────────────────────
  locating: "Finding your location...",
  yourLocation: "Your location",
  currentLocationWeb: "Current location (web)",
  /** Display name of the fallback location used before location access. */
  defaultCity: "Ho Chi Minh City",
  loadFailed: "Could not load weather data.",
  loadingStation: "Fetching weather station data...",

  labelHumidityShort: "Humidity",
  labelWindShort: "Wind",
  labelRainShort: "Rain",
  labelPressure: "Pressure",
  labelVisibility: "Visibility",
  labelSunrise: "Sunrise",
  labelSunset: "Sunset",
  moonTonight: "Tonight's moon",

  goldenHourTitle: "The ideal window",
  goldenHourGood:
    "Calm wind, dry foliage. Great for spraying and fertilising.",
  goldenHourBad:
    "Conditions are poor today — avoid spraying chemicals.",
  forecast8Days: "8-day forecast",
  weatherDetail: "Weather detail",
  plantDoctorAnalysis: "Plant doctor analysis",
  noAdviceToday: "No specific advice for this day.",
  next24Hours: "🕒 Next 24 hours",
  nowShort: "Now",

  // Weekdays (multi-day forecast)
  tomorrow: "Tomorrow",
  sunday: "Sunday",
  weekdayN: "Day {n}",

  /** OpenWeatherMap condition descriptions, keyed by the raw OWM string. */
  conditions: {
    "clear sky": "Clear sky",
    "few clouds": "Few clouds",
    "scattered clouds": "Scattered clouds",
    "broken clouds": "Broken clouds",
    "overcast clouds": "Overcast",
    "light rain": "Light rain",
    "moderate rain": "Moderate rain",
    "heavy intensity rain": "Heavy rain",
    "very heavy rain": "Very heavy rain",
    "extreme rain": "Extreme rain",
    "freezing rain": "Freezing rain",
    "light intensity shower rain": "Light showers",
    "shower rain": "Showers",
    "heavy intensity shower rain": "Heavy showers",
    thunderstorm: "Thunderstorm",
    "thunderstorm with light rain": "Thunderstorm with light rain",
    "thunderstorm with rain": "Thunderstorm with rain",
    "thunderstorm with heavy rain": "Thunderstorm with heavy rain",
    snow: "Snow",
    mist: "Mist",
    fog: "Fog",
    haze: "Haze",
    dust: "Dust",
  },

  /** Daily summary sentences derived from the OWM summary. */
  summaries: {
    cloudyWithSun: "Expect a mix of cloud and dry sunshine.",
    cloudyWithRain: "Expect a cloudy day with rain.",
    partlyCloudy: "Expect a mostly cloudy day.",
    clear: "Clear skies and bright sunshine.",
    rain: "Rain expected — damp conditions.",
  },

  /** Moon phases. */
  moonPhases: {
    new: "New moon",
    waxingCrescent: "Waxing crescent",
    firstQuarter: "First quarter",
    waxingGibbous: "Waxing gibbous",
    full: "Full moon",
    waningGibbous: "Waning gibbous",
    lastQuarter: "Last quarter",
    waningCrescent: "Waning crescent",
  },

  /** Farmer alerts. */
  alerts: {
    heatTitle: "🔥 Severe heat",
    heatMessage:
      "Temperatures up to {temp}°C. Water deeply in the early morning or cool afternoon.",
    rainTitle: "🌧️ Heavy rain risk",
    rainMessage:
      "{pop}% chance of rain. Pause chemical spraying and check your drainage.",
    windTitle: "💨 Strong wind warning",
    windMessage:
      "Wind at {speed}m/s. Reinforce trellises and stake ornamental plants.",
    goodTitle: "🌱 Favourable weather",
    goodMessage:
      "Ideal growing conditions — good for fertilising, spraying and pruning.",
  },
} as const;
