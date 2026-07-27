/** Plant guide: filters, listing, plant detail. */
export const encyclopedia = {
  title: "Plant Guide",
  subtitle:
    "Explore a rich world of plants with detailed information on their traits, uses and care.",

  // Filters
  filters: "Filters",
  clearFilters: "Clear filters",
  filterType: "Plant type",
  filterGrowth: "Growth rate",
  filterLight: "Light needs",
  filterWater: "Water needs",
  searchPlaceholder: "Search by common or scientific name...",
  clearSearch: "Clear search",

  // Filter values
  typeShade: "Shade tree",
  typeLandscape: "Ornamental",
  typeTimber: "Timber",
  typeFruit: "Fruit tree",
  typeSpiritual: "Sacred plant",
  typeFengShui: "Feng shui plant",

  growthFast: "Fast",
  growthMedium: "Moderate",
  growthSlow: "Slow",

  lightFull: "Full sun",
  lightShade: "Shade",
  lightPartial: "Partial sun",

  waterLow: "Low",
  waterMedium: "Moderate",
  waterHigh: "High",

  // States
  loadListFailed: "Could not load the plant list. Please try again.",
  loadDetailFailed: "Could not load the details. Please try again.",
  noResults: "No matching plants found.",
  approved: "Approved",
  pending: "Pending review",

  // Detail labels
  labelGrowth: "Growth rate",
  labelLight: "Light",
  labelWater: "Water",
  labelFamily: "Family",
  labelHeight: "Height",
  labelBloomSeason: "Blooming season",
  labelPlantingSite: "Planting site",
  labelSoilType: "Soil type",
  labelCommonDiseases: "Common diseases",
  labelDescription: "Description",
  labelUses: "Uses",
  labelCare: "Care instructions",

  // ── Mobile ────────────────────────────────────────────────────────────
  loadDetailFailedShort: "Could not load the plant details. Please try again.",
  familyFallback: "Plant",
  searchPlaceholderShort: "Search by plant name...",
  resultCount: "{count} results found",
  loadingData: "Loading data...",
  loadingDetail: "Loading details...",
  filterSheetTitle: "Search filters",
  applyFilters: "Apply",
  labelGrowthShort: "Growth",
  valueUnknown: "Unknown",
  valueUpdating: "Coming soon...",
  labelHeightInline: "Height: ",
  labelSoilInline: "Soil: ",
  labelDiseasesInline: "Common diseases:",
} as const;
