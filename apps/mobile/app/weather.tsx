import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  RefreshControl,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import {
  ArrowLeft,
  MapPin,
  Wind,
  Droplets,
  Sun,
  CloudRain,
  AlertTriangle,
  Info,
  CheckCircle,
  CalendarDays,
  Clock,
  ThumbsUp,
  Gauge,
  Eye,
  Sunrise,
  Sunset,
  Moon,
  Activity,
} from "lucide-react-native";

import { weatherApi } from "@agri-scan/shared";
import type { WeatherAndAdviceResponse, TranslateFn } from "@agri-scan/shared";
import { useT } from "../context/I18nContext";

import { styles } from "../styles/weather.styles";
// `id` là giá trị gửi lên API — không dịch. Nhãn dùng chung key với web.
const CATEGORIES = [
  { id: "ALL", labelKey: "weather.cropAll" },
  { id: "VEGETABLE", labelKey: "weather.cropVegetable" },
  { id: "FRUIT", labelKey: "weather.cropFruit" },
  { id: "FLOWER", labelKey: "weather.cropFlower" },
];

/**
 * Dịch `description` của OpenWeatherMap.
 *
 * Trước đây là một object tiếng Việt hardcode ngay trong file này. Nay từ điển
 * nằm ở weather.conditions.* trong @agri-scan/shared, keyed bằng đúng chuỗi OWM
 * trả về — nên bản tiếng Anh cũng được "dịch" (viết hoa cho đẹp) thay vì hiện
 * nguyên chuỗi thô. Không khớp key thì t() trả về chính chuỗi đó.
 */
const translateWeather = (engDesc: string, t: TranslateFn) => {
  if (!engDesc) return "";
  return t(`weather.conditions.${engDesc.toLowerCase()}`);
};

/** Dịch câu tóm tắt ngày từ summary của OWM. */
const translateSummary = (summary: string, t: TranslateFn) => {
  if (!summary) return "";
  const s = summary.toLowerCase();
  if (s.includes("partly cloudy") && s.includes("clear spells"))
    return t("weather.summaries.cloudyWithSun");
  if (s.includes("partly cloudy") && s.includes("rain"))
    return t("weather.summaries.cloudyWithRain");
  if (s.includes("partly cloudy")) return t("weather.summaries.partlyCloudy");
  if (s.includes("clear")) return t("weather.summaries.clear");
  if (s.includes("rain")) return t("weather.summaries.rain");
  return summary; // Giữ nguyên nếu không khớp từ điển
};

const getModernIconUrl = (code: string) => {
  const map: Record<string, string> = {
    "01d": "clear-day.png",
    "01n": "clear-night.png",
    "02d": "partly-cloudy-day.png",
    "02n": "partly-cloudy-night.png",
    "03d": "cloudy.png",
    "03n": "cloudy.png",
    "04d": "cloudy.png",
    "04n": "cloudy.png",
    "09d": "showers-day.png",
    "09n": "showers-night.png",
    "10d": "rain.png",
    "10n": "rain.png",
    "11d": "thunder-rain.png",
    "11n": "thunder-rain.png",
    "13d": "snow.png",
    "13n": "snow.png",
    "50d": "fog.png",
    "50n": "fog.png",
  };
  const fileName = map[code] || "partly-cloudy-day.png";
  return `https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/2nd%20Set%20-%20Color/${fileName}`;
};

export default function WeatherScreen() {
  const t = useT();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [weatherData, setWeatherData] =
    useState<WeatherAndAdviceResponse | null>(null);
  const [activeCategory, setActiveCategory] = useState<
    "ALL" | "FRUIT" | "FLOWER" | "VEGETABLE"
  >("ALL");
  const [cityName, setCityName] = useState(t("weather.locating"));
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  const fetchWeather = async (category = activeCategory) => {
    try {
      setErrorMsg("");
      let lat = 10.8231;
      let lon = 106.6297;
      let cName = "TP.Hồ Chí Minh";

      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          let location = await Location.getCurrentPositionAsync({});
          lat = location.coords.latitude;
          lon = location.coords.longitude;
          cName = t("weather.yourLocation");

          if (Platform.OS !== "web") {
            try {
              const reverseGeocode = await Location.reverseGeocodeAsync({
                latitude: lat,
                longitude: lon,
              });
              if (reverseGeocode.length > 0) {
                const place = reverseGeocode[0];
                cName =
                  place.subregion ||
                  place.city ||
                  place.region ||
                  t("weather.currentLocation");
              }
            } catch (geoErr) {}
          } else {
            try {
              const res = await fetch(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=vi`,
              );
              const data = await res.json();
              cName =
                data.city || data.principalSubdivision || t("weather.currentLocation");
            } catch (webGeoErr) {
              cName = t("weather.currentLocationWeb");
            }
          }
        }
      } catch (locErr) {}

      setCityName(cName);
      const res = await weatherApi.getWeatherAndAdvice({ lat, lon, category });
      setWeatherData(res);
    } catch (error: any) {
      setErrorMsg(
        error.response?.data?.message || t("weather.loadFailed"),
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchWeather();
  };

  const handleCategoryChange = (cat: any) => {
    setActiveCategory(cat);
    setLoading(true);
    fetchWeather(cat);
  };

  const handleDaySelect = (index: number) => {
    setSelectedDayIndex(index);
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const generateFutureAdvices = (dayInfo: any) => {
    const tips = [];
    if (dayInfo.tempMax >= 34) {
      tips.push({
        adviceType: "WARNING",
        title: t("weather.alerts.heatTitle"),
        message: t("weather.alerts.heatMessage", {
          temp: Math.round(dayInfo.tempMax),
        }),
      });
    }
    if (dayInfo.pop >= 60) {
      tips.push({
        adviceType: "WARNING",
        title: t("weather.alerts.rainTitle"),
        message: t("weather.alerts.rainMessage", { pop: dayInfo.pop }),
      });
    }
    if (dayInfo.windSpeed >= 6) {
      tips.push({
        adviceType: "WARNING",
        title: t("weather.alerts.windTitle"),
        message: t("weather.alerts.windMessage", {
          speed: dayInfo.windSpeed,
        }),
      });
    }
    if (tips.length === 0) {
      tips.push({
        adviceType: "RECOMMEND",
        title: t("weather.alerts.goodTitle"),
        message: t("weather.alerts.goodMessage"),
      });
    }
    return tips;
  };

  const findGoldenHour = (hourlyList: any[]) => {
    const validHours = hourlyList.slice(0, 15).filter((h) => {
      const hLocal = new Date(h.timestamp * 1000).getHours();
      return hLocal >= 5 && hLocal <= 17;
    });
    if (validHours.length === 0) return null;
    const sorted = validHours.sort((a, b) => {
      if (a.pop !== b.pop) return a.pop - b.pop;
      if (a.windSpeed !== b.windSpeed) return a.windSpeed - b.windSpeed;
      return Math.abs(a.temp - 26) - Math.abs(b.temp - 26);
    });
    const best = sorted[0];
    if (best.pop > 40 || best.windSpeed > 6 || best.temp > 35) return null;
    return best;
  };

  const getDayName = (timestamp: number, index: number) => {
    if (index === 0) return t("weather.today");
    if (index === 1) return t("weather.tomorrow");
    const d = new Date(timestamp * 1000);
    return d.getDay() === 0
      ? t("weather.sunday")
      : t("weather.weekdayN", { n: d.getDay() + 1 });
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return `${date.getHours().toString().padStart(2, "0")}:00`;
  };

  const formatTimeFromStamp = (timestamp: number) => {
    if (!timestamp) return "--:--";
    const d = new Date(timestamp * 1000);
    return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
  };

  const getMoonPhaseText = (phase: number) => {
    if (phase === 0 || phase === 1) return t("weather.moonPhases.new");
    if (phase > 0 && phase < 0.25)
      return t("weather.moonPhases.waxingCrescent");
    if (phase === 0.25) return t("weather.moonPhases.firstQuarter");
    if (phase > 0.25 && phase < 0.5)
      return t("weather.moonPhases.waxingGibbous");
    if (phase === 0.5) return t("weather.moonPhases.full");
    if (phase > 0.5 && phase < 0.75)
      return t("weather.moonPhases.waningGibbous");
    if (phase === 0.75) return t("weather.moonPhases.lastQuarter");
    return t("weather.moonPhases.waningCrescent");
  };

  const getHeroBgColor = (iconCode: string) => {
    if (!iconCode) return "#1e3a8a";
    if (iconCode.includes("n")) return "#0f172a";
    if (["09d", "10d", "11d", "13d", "50d"].includes(iconCode))
      return "#475569";
    return "#0ea5e9";
  };

  if (loading && !weatherData) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#16a34a" />
        <Text style={styles.loadingText}>{t("weather.loadingStation")}</Text>
      </View>
    );
  }

  const safeData: any = weatherData;

  // 🔥 ĐÃ FIX LỖI: Lấy cả Áp suất, Tầm nhìn, Bình minh, Hoàng hôn cho ngày tương lai
  const currentViewData =
    weatherData && selectedDayIndex === 0
      ? {
          temp: Math.round(weatherData.weatherData.current.temp),
          desc:
            weatherData.weatherData.current.weatherDescription ||
            weatherData.weatherData.current.weatherMain,
          icon: weatherData.weatherData.current.weatherIcon,
          humidity: weatherData.weatherData.current.humidity,
          wind: weatherData.weatherData.current.windSpeed,
          uvi: weatherData.weatherData.current.uvi,
          pop: weatherData.weatherData.hourly[0]?.pop || 0,
          advices: weatherData.advices,
          pressure: safeData.weatherData.current.pressure,
          visibility: safeData.weatherData.current.visibility,
          sunrise: safeData.weatherData.current.sunrise,
          sunset: safeData.weatherData.current.sunset,
          summary: translateSummary(
            safeData.weatherData.daily[0]?.summary,
            t,
          ),
          moonPhase: safeData.weatherData.daily[0]?.moonPhase,
        }
      : weatherData && selectedDayIndex > 0
        ? {
            temp: Math.round(
              weatherData.weatherData.daily[selectedDayIndex].tempMax,
            ),
            desc: weatherData.weatherData.daily[selectedDayIndex].weatherMain,
            icon: weatherData.weatherData.daily[selectedDayIndex].weatherIcon,
            humidity: weatherData.weatherData.daily[selectedDayIndex].humidity,
            wind: weatherData.weatherData.daily[selectedDayIndex].windSpeed,
            uvi: weatherData.weatherData.daily[selectedDayIndex].uvi,
            pop: weatherData.weatherData.daily[selectedDayIndex].pop,
            advices: generateFutureAdvices(
              weatherData.weatherData.daily[selectedDayIndex],
            ),
            // 🔥 Đọc dữ liệu từ mảng daily thay vì gán null
            pressure: safeData.weatherData.daily[selectedDayIndex]?.pressure,
            visibility:
              safeData.weatherData.daily[selectedDayIndex]?.visibility,
            sunrise: safeData.weatherData.daily[selectedDayIndex]?.sunrise,
            sunset: safeData.weatherData.daily[selectedDayIndex]?.sunset,
            summary: translateSummary(
              safeData.weatherData.daily[selectedDayIndex]?.summary,
              t,
            ),
            moonPhase: safeData.weatherData.daily[selectedDayIndex]?.moonPhase,
          }
        : null;

  const goldenHour =
    selectedDayIndex === 0 && weatherData
      ? findGoldenHour(weatherData.weatherData.hourly)
      : null;

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 10) }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <View style={styles.locationWrapper}>
          <MapPin size={18} color="#16a34a" />
          <Text style={styles.locationText}>{cityName}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.filterBtn,
                activeCategory === cat.id && styles.filterBtnActive,
              ]}
              onPress={() => handleCategoryChange(cat.id)}
            >
              <Text
                style={[
                  styles.filterBtnText,
                  activeCategory === cat.id && styles.filterBtnTextActive,
                ]}
              >
                {t(cat.labelKey)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#16a34a"]}
          />
        }
      >
        {errorMsg ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{errorMsg}</Text>
            <TouchableOpacity
              style={styles.retryBtn}
              onPress={() => fetchWeather()}
            >
              <Text style={styles.retryText}>{t("common.retry")}</Text>
            </TouchableOpacity>
          </View>
        ) : weatherData && currentViewData ? (
          <>
            {/* HERO CARD */}
            <View
              style={[
                styles.heroCard,
                { backgroundColor: getHeroBgColor(currentViewData.icon) },
              ]}
            >
              <View style={styles.heroMain}>
                <View style={styles.heroTextGroup}>
                  <Text style={styles.tempHuge}>{currentViewData.temp}°</Text>
                  <Text style={styles.weatherDesc}>
                    {translateWeather(currentViewData.desc, t)}
                  </Text>
                </View>
                <Image
                  source={{ uri: getModernIconUrl(currentViewData.icon) }}
                  style={styles.weatherIconHuge}
                  resizeMode="contain"
                />
              </View>

              <View style={styles.statsGridRow}>
                <View style={styles.statItemRow}>
                  <Droplets size={20} color="#93c5fd" />
                  <Text style={styles.statValueRow}>
                    {currentViewData.humidity}%
                  </Text>
                  <Text style={styles.statLabelRow}>
                    {t("weather.labelHumidityShort")}
                  </Text>
                </View>
                <View style={styles.statItemRow}>
                  <Wind size={20} color="#cbd5e1" />
                  <Text style={styles.statValueRow}>
                    {currentViewData.wind} m/s
                  </Text>
                  <Text style={styles.statLabelRow}>
                    {t("weather.labelWindShort")}
                  </Text>
                </View>
                <View style={styles.statItemRow}>
                  <Sun size={20} color="#fde047" />
                  <Text style={styles.statValueRow}>{currentViewData.uvi}</Text>
                  <Text style={styles.statLabelRow}>Tia UV</Text>
                </View>
                <View style={styles.statItemRow}>
                  <CloudRain size={20} color="#67e8f9" />
                  <Text style={styles.statValueRow}>
                    {currentViewData.pop}%
                  </Text>
                  <Text style={styles.statLabelRow}>
                    {t("weather.labelRainShort")}
                  </Text>
                </View>
              </View>
            </View>

            {/* KHUNG GIỜ VÀNG (Chỉ hiện hôm nay) */}
            {selectedDayIndex === 0 && (
              <View style={styles.goldenHourCard}>
                <View style={styles.goldenHourLeft}>
                  <View style={styles.goldenIconBox}>
                    <ThumbsUp size={24} color="#10b981" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.goldenTitle}>
                      {t("weather.goldenHourTitle")}
                    </Text>
                    {goldenHour ? (
                      <Text style={styles.goldenDesc}>
                        {t("weather.goldenHourGood")}
                      </Text>
                    ) : (
                      <Text style={styles.goldenDesc}>
                        {t("weather.goldenHourBad")}
                      </Text>
                    )}
                  </View>
                </View>
                {goldenHour && (
                  <View style={styles.goldenTimeBadge}>
                    <Clock size={16} color="#059669" />
                    <Text style={styles.goldenTimeText}>
                      {formatTime(goldenHour.timestamp)}
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* THANH CHỌN NGÀY NGANG */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <CalendarDays size={20} color="#111827" />
                <Text style={styles.sectionTitle}>
                  {t("weather.forecast8Days")}
                </Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.dateTabsScroll}
              >
                {weatherData.weatherData.daily.map((day, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.dateTab,
                      selectedDayIndex === index && styles.dateTabActive,
                    ]}
                    onPress={() => handleDaySelect(index)}
                  >
                    <Text
                      style={[
                        styles.dateTabText,
                        selectedDayIndex === index && styles.dateTabTextActive,
                      ]}
                    >
                      {getDayName(day.timestamp, index)}
                    </Text>
                    {day.pop > 30 && (
                      <CloudRain
                        size={12}
                        color={selectedDayIndex === index ? "#fff" : "#0284c7"}
                        style={{ marginTop: 4 }}
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* CHỈ SỐ MỞ RỘNG (Hiện cả hiện tại lẫn tương lai) */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Activity size={20} color="#111827" />
                <Text style={styles.sectionTitle}>
                  {t("weather.weatherDetail")}
                </Text>
              </View>

              {/* Tóm tắt thời tiết nổi bật (Đã dịch sang Tiếng Việt) */}
              {currentViewData.summary && (
                <View style={styles.summaryBox}>
                  <Text style={styles.summaryText}>
                    {currentViewData.summary}
                  </Text>
                </View>
              )}

              <View style={styles.extendedGrid}>
                {currentViewData.pressure !== null &&
                  currentViewData.pressure !== undefined && (
                    <View style={styles.extendedItem}>
                      <Gauge size={22} color="#6366f1" />
                      <View>
                        <Text style={styles.extendedLabel}>
                          {t("weather.labelPressure")}
                        </Text>
                        <Text style={styles.extendedValue}>
                          {currentViewData.pressure} hPa
                        </Text>
                      </View>
                    </View>
                  )}
                {currentViewData.visibility !== null &&
                  currentViewData.visibility !== undefined && (
                    <View style={styles.extendedItem}>
                      <Eye size={22} color="#14b8a6" />
                      <View>
                        <Text style={styles.extendedLabel}>
                          {t("weather.labelVisibility")}
                        </Text>
                        <Text style={styles.extendedValue}>
                          {(currentViewData.visibility / 1000).toFixed(1)} km
                        </Text>
                      </View>
                    </View>
                  )}
                {currentViewData.sunrise !== null &&
                  currentViewData.sunrise !== undefined && (
                    <View style={styles.extendedItem}>
                      <Sunrise size={22} color="#f59e0b" />
                      <View>
                        <Text style={styles.extendedLabel}>
                          {t("weather.labelSunrise")}
                        </Text>
                        <Text style={styles.extendedValue}>
                          {formatTimeFromStamp(currentViewData.sunrise)}
                        </Text>
                      </View>
                    </View>
                  )}
                {currentViewData.sunset !== null &&
                  currentViewData.sunset !== undefined && (
                    <View style={styles.extendedItem}>
                      <Sunset size={22} color="#f43f5e" />
                      <View>
                        <Text style={styles.extendedLabel}>
                          {t("weather.labelSunset")}
                        </Text>
                        <Text style={styles.extendedValue}>
                          {formatTimeFromStamp(currentViewData.sunset)}
                        </Text>
                      </View>
                    </View>
                  )}
                {currentViewData.moonPhase !== null &&
                  currentViewData.moonPhase !== undefined && (
                    <View style={[styles.extendedItem, { width: "100%" }]}>
                      <Moon size={22} color="#8b5cf6" />
                      <View>
                        <Text style={styles.extendedLabel}>
                          {t("weather.moonTonight")}
                        </Text>
                        <Text style={styles.extendedValue}>
                          {getMoonPhaseText(currentViewData.moonPhase)}
                        </Text>
                      </View>
                    </View>
                  )}
              </View>
            </View>

            {/* AI ADVICE */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Image
                  source={{
                    uri: "https://cdn-icons-png.flaticon.com/512/2043/2043130.png",
                  }}
                  style={{ width: 22, height: 22 }}
                />
                <Text style={styles.sectionTitle}>
                  {t("weather.plantDoctorAnalysis")}
                </Text>
              </View>

              {currentViewData.advices.length > 0 ? (
                currentViewData.advices.map((advice: any, index: number) => {
                  const isWarning = advice.adviceType === "WARNING";
                  const isRec = advice.adviceType === "RECOMMEND";
                  return (
                    <View
                      key={index}
                      style={[
                        styles.adviceCard,
                        isWarning
                          ? styles.cardWarning
                          : isRec
                            ? styles.cardRecommend
                            : styles.cardInfo,
                      ]}
                    >
                      <View style={styles.adviceHeader}>
                        {isWarning ? (
                          <AlertTriangle size={20} color="#ef4444" />
                        ) : isRec ? (
                          <CheckCircle size={20} color="#10b981" />
                        ) : (
                          <Info size={20} color="#3b82f6" />
                        )}
                        <Text
                          style={[
                            styles.adviceTitle,
                            isWarning && { color: "#991b1b" },
                          ]}
                        >
                          {advice.title}
                        </Text>
                      </View>
                      <Text style={styles.adviceMessage}>{advice.message}</Text>
                    </View>
                  );
                })
              ) : (
                <Text
                  style={{
                    color: "#6b7280",
                    fontStyle: "italic",
                    marginLeft: 4,
                  }}
                >
                  {t("weather.noAdviceToday")}
                </Text>
              )}
            </View>

            {/* DỰ BÁO 24 GIỜ TỚI (Chỉ hiện hôm nay) */}
            {selectedDayIndex === 0 && (
              <View style={[styles.section, { marginBottom: 40 }]}>
                <Text style={styles.sectionTitle}>
                  {t("weather.next24Hours")}
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.hourlyScroll}
                >
                  {weatherData.weatherData.hourly.map((hour, idx) => (
                    <View key={idx} style={styles.hourlyItem}>
                      <Text style={styles.hourlyTime}>
                        {idx === 0
                          ? t("weather.nowShort")
                          : formatTime(hour.timestamp)}
                      </Text>
                      <Image
                        source={{ uri: getModernIconUrl(hour.weatherIcon) }}
                        style={styles.hourlyIcon}
                        resizeMode="contain"
                      />
                      <Text style={styles.hourlyTemp}>
                        {Math.round(hour.temp)}°
                      </Text>
                      {hour.pop > 0 && (
                        <View style={styles.popBadge}>
                          <CloudRain size={10} color="#0284c7" />
                          <Text style={styles.popText}>{hour.pop}%</Text>
                        </View>
                      )}
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}
