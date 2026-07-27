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
} as const;
