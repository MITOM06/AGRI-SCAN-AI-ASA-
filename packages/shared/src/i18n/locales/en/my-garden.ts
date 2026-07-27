/** My Garden: overview, upload, diagnosis result, tracking. */
export const myGarden = {
  // Defaults
  defaultPlantName: "Plant",
  noDetailYet: "No details yet",
  noDiagnosisYet: "Not diagnosed yet",
  noIdentification: "Not identified yet",

  // Upload
  uploadTitlePrefix: "Your smart plant",
  uploadTitleHighlight: "doctor",
  uploadSubtitle:
    "Photograph your plant. The AI identifies the species, diagnoses its health and gives you a personalised care plan in seconds.",
  uploadCta: "Take or upload a photo",
  uploadHint:
    "JPG and PNG supported, up to 10MB. Make sure the photo is sharp and well lit.",
  uploadPickFile: "Choose a photo from your device",

  // Analysing
  analyzing: "The AI is analysing...",
  analyzingStep1: "Identifying the plant...",
  analyzingStep2: "Matching disease characteristics...",
  analyzingStep3: "Building the diagnosis...",
  analyzingStep4: "Preparing care recommendations...",
  buildingSchedule: "The AI is building a care schedule...",
  updatingCondition: "The AI is updating the plant's condition...",

  // Overview
  myGarden: "My garden",
  totalPlants: "Total plants",
  healthy: "Healthy",
  needsAttention: "Needs attention",
  addPlant: "Add a plant",
  trackedPlants: "Tracked plants",
  realtimeUpdate: "Updated in real time",
  emptyGardenTitle: "Your garden is empty",
  emptyGardenTitle2: "let's fill it up!",
  emptyGardenDesc:
    "Photograph any plant — we'll identify it and track its care for you. It's that easy.",
  detail: "Details",
  track: "Track",
  stage: "Stage:",
  removeFromGarden: "Remove from garden",
  statusGood: "Good",
  statusDiseaseWarning: "Disease warning",

  // Plant groups
  tabFruit: "Fruit trees",
  tabFlower: "Flowers",
  tabOrnamental: "Ornamentals",
  groupFruit: "Fruit group",
  groupFlower: "Flower group",
  groupOrnamental: "Ornamental group",
  catalogFruit: "Supported fruit trees",
  catalogFlower: "Supported flowers",
  catalogOrnamental: "Supported ornamentals",
  catalogLoading: "Loading the plant catalogue...",
  catalogEmpty: "No plants in this category yet.",
  catalogError: "Could not load the plant catalogue. Please try again.",
  viewSample: "View sample details",

  // Watering schedule
  waterToday: "Water: today",
  waterTomorrow: "Water: tomorrow",
  waterInDays: "Water: in {days} days",

  // Diagnosis result
  identified: "Successfully identified",
  diagnosis: "Diagnosis",
  plantHealthy: "This plant is healthy",
  treatmentPlan: "Treatment plan:",
  treatmentStep1:
    "Isolate the plant from the others to prevent cross-infection.",
  treatmentStep2:
    "Cut away badly diseased leaves and branches with sterilised shears.",
  treatmentStep3:
    "Apply a targeted biological treatment to both sides of the leaves in the cool afternoon.",
  buyTreatment: "Buy treatment",
  addToMyGarden: "Add to my garden",
  addToMyGardenHint: "Save it to track watering and care",
  backToGarden: "Back to my garden",
  scanAnother: "Scan another plant",

  // Metric cards
  labelLight: "Light",
  labelWatering: "Watering",
  valueEveryTwoDays: "Every 2 days",
  labelTemperature: "Temperature",
  labelDifficulty: "Difficulty",
  valueMedium: "Moderate",

  // Fruit trees — timeline
  expectedFruitDate: "Expected fruiting date",
  stageSeeding: "Sowing",
  stageFloweringNow: "Flowering (now)",
  stageHarvest: "Harvest",
  harvestInPrefix: "Expected harvest in",
  daysLeftSuffix: "days",
  fruitTipsTitle: "How to encourage fruiting",
  fruitTip1Title: "Withhold water",
  fruitTip1Desc:
    "Stop watering for 5-7 days to push the plant into its reproductive phase and trigger flowering and fruit set.",
  fruitTip2Title: "High-potassium fertiliser",
  fruitTip2Desc:
    "Use an NPK fertiliser high in potassium (e.g. 15-5-20) to improve fruit set and sweetness.",
  fruitTip3Title: "Hand pollination",
  fruitTip3Desc:
    "Use a soft brush to move pollen from male to female flowers early in the morning (7-9am) to improve fruit set.",
  fruitTip4Title: "Prune water sprouts",
  fruitTip4Desc:
    "Remove thin and non-fruiting shoots so nutrients go to the fruit instead.",

  // Flowers
  expectedBloomDate: "Expected blooming date",
  stageSprouting: "Sprouting",
  stageBuddingNow: "Budding (now)",
  stageFullBloom: "Full bloom",
  bloomInPrefix: "Expected full bloom in",
  flowerTipsTitle: "Care for bigger, longer-lasting blooms",
  flowerTip1Title: "More light",
  flowerTip1Desc:
    "Give the plant 6-8 hours of direct sun daily. Too little light makes buds small and prone to dropping.",
  flowerTip2Title: "Water correctly",
  flowerTip2Desc:
    "Water only at the base — never onto buds or flowers, which causes rot.",
  flowerTip3Title: "High-phosphorus fertiliser",
  flowerTip3Desc:
    "Add a phosphorus-rich fertiliser to drive strong bud development and vivid colour.",

  // Ornamentals
  pruningTitle: "Shaping and pruning guide",
  pruningCorrectSpot: "Correct cutting point",
  pruningIdealAngle: "Ideal cutting angle",
  pruningIdealAngleDesc:
    "Cut 1-2cm above a leaf node at a 45° angle so water doesn't sit on the wound and cause mould.",
  pruningTip1Title: "Thinning",
  pruningTip1Desc:
    "Remove branches crowding the inside of the canopy to improve airflow.",
  pruningTip2Title: "Pinching",
  pruningTip2Desc:
    "Pinch off soft tips to encourage side shoots and a fuller canopy.",
  pruningTip3Title: "Leaf cleaning",
  pruningTip3Desc:
    "Wipe dust off the leaves regularly with a damp cloth so the plant photosynthesises well.",
  leafCareTitle: "Care for glossy green foliage",
  leafTip1Title: "Air humidity",
  leafTip1Desc:
    "Foliage plants usually prefer 60-80% humidity. Mist the leaves 1-2 times a day or keep a humidifier nearby.",
  leafTip2Title: "Diffused light",
  leafTip2Desc:
    "Avoid harsh direct sun, which scorches leaves. Place the plant where light filters through a window, or use shade cloth.",
  leafTip3Title: "Nitrogen-rich fertiliser",
  leafTip3Desc:
    "Use a foliar feed or high-nitrogen NPK to keep leaves large, thick and deep green.",

  // Tracking
  growingWell: "Growing steadily",
  tracking: "Tracking",
  progress: "Progress",
  updated: "Updated",
  updateToday: "Update today",
  updateTodayHint: "Take a photo for the AI to analyse",
  growthRoadmap: "Growth roadmap",
  noRoadmap: "No growth roadmap for this plant yet.",
  todayTasks: "Today's tasks",
  dayN: "Day {day}",
  today: "Today",
  taskWatering: "Watering",
  taskFertilizing: "Fertilising & care",
  taskCare: "Care",
  upcomingSchedule: "Upcoming schedule",
  taskDayN: "Day {day} tasks",
  noCareRoadmap: "No care roadmap yet",
  noCareRoadmapDesc:
    "Upload a photo so the AI can analyse it and build a daily care roadmap for your plant.",

  // Notifications
  deleteFailed: "Could not delete the plant. Please try again.",
  deleted: "Plant removed from your garden.",
  addFailed: "Could not add the plant to your garden.",
  added: "Plant added to your garden.",
  analyzeFailed: "Could not analyse the image. Please try again.",
  updateConditionFailed: "Could not update the plant's condition.",
  conditionUpdated: "Plant status updated.",
  connectionError: "Connection error. Please try again.",
  loadGardenFailed: "Could not load your garden.",
  addPlantFailed: "Could not add the plant to your garden.",
  deletePlantFailed: "Could not delete the plant.",
  checkInFailed: "Could not check in.",

  // ── Mobile: plant setup screen (garden-setup) ──────────────────────────
  setupTitle: "Plant details",

  // Care goals — the `id` is the API code, not translated
  goalHealDisease: "Treat a disease",
  goalGetFruit: "Harvest fruit",
  goalGetFlower: "Get flowers",
  goalMaintain: "Keep it healthy",

  // Location status
  locating: "Getting your location...",
  locationWebMode: "Location acquired (web mode)",
  locationDenied: "Location permission denied",
  locationOk: "Precise location acquired",
  locationFailed: "Could not get your location",

  // AI analysis
  analyzingCondition: "The AI is analysing your plant...",
  analysisDone: "Analysis complete!",
  detectedPrefix: "Detected: {disease}",
  composingRoadmap: "The AI is composing your roadmap...",

  // Form
  step1Label: "1. Name your plant",
  namePlaceholder: "e.g. Balcony tomato, Potted rose...",
  step2Label: "2. Care goal",
  step2Hint: "The AI uses this goal to tailor its advice.",
  step3Label: "3. Location & weather",
  yourGardenLocation: "Your garden's location",
  weatherHint:
    "The AI will pull the next 7 days of weather at this location to optimise watering.",
  submitButton: "Create care roadmap",

  // Messages
  errorNoValidImage: "No valid image found.",
  errorAiTitle: "AI error",
  errorAiMessage: "Could not analyse the image right now.",
  errorMissingInfoTitle: "Missing information",
  errorMissingNameMessage: "Please give your plant a name.",
  waitTitle: "One moment",
  waitGpsMessage: "We're getting your GPS location to check the weather.",
  successTitle: "🎉 Done!",
  successMessage:
    "The AI has analysed the weather and built a care roadmap for your plant.",
  viewGardenNow: "View my garden",
  errorCreateRoadmap: "Something went wrong while creating the roadmap.",
} as const;
