"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CloudRain, Sun, Cloud, Wind, Droplets, ThermometerSun, 
  Sprout, ShieldAlert, MapPin, Calendar, Sunrise, Sunset, 
  Leaf, Moon, Eye, Gauge, Compass, AlertTriangle, Umbrella,
  CloudLightning, Thermometer, ChevronDown, ChevronUp
} from 'lucide-react';

// Mock Data based on OpenWeatherMap One Call API 3.0 structure
const ONE_CALL_MOCK = {
  location: "Hồ Chí Minh, Việt Nam",
  alerts: [
    {
      sender_name: "TT Dự báo KTTV Quốc gia",
      event: "Cảnh báo Nắng nóng gay gắt",
      start: "10:00",
      end: "16:00",
      description: "Nhiệt độ ngoài trời có thể lên tới 38-40°C. Nguy cơ cao xảy ra cháy nổ và ảnh hưởng nghiêm trọng đến cây trồng nông nghiệp."
    }
  ],
  current: {
    temp: 35.2,
    feels_like: 40.5,
    pressure: 1008,
    humidity: 62,
    dew_point: 26.8, // Quan trọng cho nấm bệnh
    uvi: 11.2,
    clouds: 20,
    visibility: 10000,
    wind_speed: 4.5, // m/s
    wind_deg: 140, // SE
    wind_gust: 7.2,
    weather: { main: "Clear", description: "Nắng gắt", type: "hot" },
    sunrise: "05:58",
    sunset: "18:02",
  },
  hourly: [
    { time: "Bây giờ", temp: 35, pop: 0, wind: 4.5, type: 'hot' },
    { time: "14:00", temp: 36, pop: 0, wind: 5.0, type: 'hot' },
    { time: "15:00", temp: 35, pop: 10, wind: 5.5, type: 'hot' },
    { time: "16:00", temp: 33, pop: 20, wind: 6.0, type: 'cloudy' },
    { time: "17:00", temp: 31, pop: 40, wind: 4.0, type: 'cloudy' },
    { time: "18:00", temp: 29, pop: 80, wind: 3.5, type: 'rain' },
    { time: "19:00", temp: 27, pop: 90, wind: 2.0, type: 'rain' },
    { time: "20:00", temp: 26, pop: 30, wind: 2.0, type: 'cloudy' },
  ],
  daily: [
    { day: "Hôm nay", min: 26, max: 36, pop: 80, uvi: 11, moon_phase: 0.25, type: 'hot', summary: "Nắng nóng ban ngày, mưa rào về chiều tối.", tip: "Tưới đẫm sáng sớm. Cẩn thận nấm bệnh do mưa chiều sau nắng gắt." },
    { day: "Ngày mai", min: 25, max: 33, pop: 90, uvi: 8, moon_phase: 0.28, type: 'rain', summary: "Mưa dông rải rác cả ngày.", tip: "Ngưng tưới nước. Khơi thông rãnh thoát nước." },
    { day: "Thứ 4", min: 24, max: 32, pop: 40, uvi: 9, moon_phase: 0.31, type: 'cloudy', summary: "Trời nhiều mây, dịu mát hơn.", tip: "Thời tiết lý tưởng để bón phân gốc." },
    { day: "Thứ 5", min: 25, max: 34, pop: 20, uvi: 10, moon_phase: 0.35, type: 'good', summary: "Nắng đẹp, gió nhẹ.", tip: "Phun thuốc phòng trừ sâu bệnh (ít gió, không mưa)." },
    { day: "Thứ 6", min: 26, max: 35, pop: 10, uvi: 11, moon_phase: 0.40, type: 'hot', summary: "Nắng nóng quay trở lại.", tip: "Che lưới lan cho cây non. Tăng cường tưới ẩm." },
    { day: "Thứ 7", min: 25, max: 33, pop: 60, uvi: 9, moon_phase: 0.45, type: 'rain', summary: "Mưa rào ngắt quãng.", tip: "Kiểm tra tình trạng rửa trôi phân bón." },
    { day: "CN", min: 24, max: 31, pop: 70, uvi: 8, moon_phase: 0.50, type: 'cloudy', summary: "Nhiều mây, có mưa nhỏ.", tip: "Cắt tỉa cành lá già yếu, tạo độ thông thoáng." },
  ]
};

const ALL_LOCATIONS = [
  { name: "Hà Nội", temp: 22, type: "cloudy", description: "Nhiều mây", humidity: 75, region: "Bắc Bộ" },
  { name: "Hải Phòng", temp: 23, type: "rain", description: "Mưa phùn", humidity: 80, region: "Bắc Bộ" },
  { name: "Đà Nẵng", temp: 28, type: "good", description: "Trời trong xanh", humidity: 65, region: "Trung Bộ" },
  { name: "Huế", temp: 27, type: "cloudy", description: "Nhiều mây", humidity: 70, region: "Trung Bộ" },
  { name: "Đà Lạt", temp: 18, type: "rain", description: "Mưa rào", humidity: 85, region: "Tây Nguyên" },
  { name: "Buôn Ma Thuột", temp: 24, type: "good", description: "Nắng nhẹ", humidity: 60, region: "Tây Nguyên" },
  { name: "Cần Thơ", temp: 34, type: "hot", description: "Nắng nóng", humidity: 60, region: "Nam Bộ" },
  { name: "Cà Mau", temp: 33, type: "hot", description: "Nắng gắt", humidity: 65, region: "Nam Bộ" },
];

// Helpers
const getMoonPhaseName = (phase: number) => {
  if (phase === 0 || phase === 1) return "Trăng mới";
  if (phase > 0 && phase < 0.25) return "Trăng lưỡi liềm đầu tháng";
  if (phase === 0.25) return "Bán nguyệt đầu tháng";
  if (phase > 0.25 && phase < 0.5) return "Trăng khuyết đầu tháng";
  if (phase === 0.5) return "Trăng rằm";
  if (phase > 0.5 && phase < 0.75) return "Trăng khuyết cuối tháng";
  if (phase === 0.75) return "Bán nguyệt cuối tháng";
  return "Trăng lưỡi liềm cuối tháng";
};

const getWindDirection = (deg: number) => {
  const directions = ['Bắc', 'Đông Bắc', 'Đông', 'Đông Nam', 'Nam', 'Tây Nam', 'Tây', 'Tây Bắc'];
  return directions[Math.round(deg / 45) % 8];
};

const getWeatherIcon = (type: string, className = "w-6 h-6") => {
  switch (type) {
    case 'hot': return <Sun className={`${className} text-orange-500`} />;
    case 'rain': return <CloudRain className={`${className} text-blue-500`} />;
    case 'storm': return <CloudLightning className={`${className} text-purple-500`} />;
    case 'cloudy': return <Cloud className={`${className} text-gray-400`} />;
    case 'good': return <Sun className={`${className} text-yellow-500`} />;
    default: return <Sun className={`${className} text-yellow-500`} />;
  }
};

const getDoctorAdvice = (current: typeof ONE_CALL_MOCK.current) => {
  // Logic based on One Call API data combinations
  if (current.temp > 35 && current.humidity < 50) {
    return {
      title: "Nguy cơ sốc nhiệt & mất nước",
      desc: `Nhiệt độ ${current.temp}°C kết hợp độ ẩm thấp. Cây trồng bốc thoát hơi nước rất mạnh. Cần tưới đẫm nước vào sáng sớm. Tuyệt đối không bón phân hóa học lúc này để tránh xót rễ.`,
      color: "bg-orange-50/80 border-orange-200 text-orange-900",
      iconColor: "text-orange-500", iconBg: "bg-orange-100"
    };
  }
  if (current.dew_point > 24 && current.humidity > 80) {
    return {
      title: "Cảnh báo nấm bệnh bùng phát",
      desc: `Điểm sương cao (${current.dew_point}°C) và độ ẩm bão hòa. Môi trường cực kỳ thuận lợi cho nấm bệnh (thán thư, sương mai) phát triển. Cần phun thuốc phòng nấm và đảm bảo vườn thông thoáng.`,
      color: "bg-purple-50/80 border-purple-200 text-purple-900",
      iconColor: "text-purple-500", iconBg: "bg-purple-100"
    };
  }
  if (current.wind_gust > 10) {
    return {
      title: "Cảnh báo gió giật mạnh",
      desc: `Gió giật lên tới ${current.wind_gust} m/s. Không nên phun thuốc sâu/phân bón lá lúc này vì thuốc sẽ bị tạt, giảm hiệu quả và ảnh hưởng môi trường. Chằng chống cây cao.`,
      color: "bg-blue-50/80 border-blue-200 text-blue-900",
      iconColor: "text-blue-500", iconBg: "bg-blue-100"
    };
  }
  
  return {
    title: "Điều kiện sinh trưởng lý tưởng",
    desc: "Nhiệt độ, độ ẩm và sức gió đều ở mức thuận lợi. Thích hợp cho mọi hoạt động canh tác: bón phân, phun thuốc, cắt tỉa hoặc xuống giống mới.",
    color: "bg-green-50/80 border-green-200 text-green-900",
    iconColor: "text-green-600", iconBg: "bg-green-100"
  };
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export function WeatherPage() {
  const [currentDate, setCurrentDate] = useState("");
  const [activeWeather, setActiveWeather] = useState(ONE_CALL_MOCK);
  const [selectedRegion, setSelectedRegion] = useState("Tất cả");
  const [showMore, setShowMore] = useState(false);
  
  // Drag to scroll state
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const regions = ["Tất cả", "Bắc Bộ", "Trung Bộ", "Tây Nguyên", "Nam Bộ"];
  const filteredLocations = selectedRegion === "Tất cả" 
    ? ALL_LOCATIONS 
    : ALL_LOCATIONS.filter(loc => loc.region === selectedRegion);

  const handleLocationSelect = (loc: typeof ALL_LOCATIONS[0]) => {
    setActiveWeather(prev => ({
      ...prev,
      location: `${loc.name}, Việt Nam`,
      current: {
        ...prev.current,
        temp: loc.temp,
        feels_like: loc.temp + 2,
        humidity: loc.humidity,
        weather: {
          ...prev.current.weather,
          type: loc.type,
          description: loc.description
        }
      }
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    setCurrentDate(date.toLocaleDateString('vi-VN', options));
  }, []);

  const advice = getDoctorAdvice(activeWeather.current);

  return (
    <div className="min-h-screen pt-24 pb-12 bg-[#F0F4F8]">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6"
      >
        
        {/* Header & Alerts */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center gap-3 tracking-tight">
              <MapPin className="text-primary w-10 h-10" />
              {activeWeather.location}
            </h1>
            <p className="text-gray-500 mt-2 flex items-center gap-2 font-medium text-lg">
              <Calendar size={22} />
              Cập nhật lúc: {currentDate}
            </p>
          </div>
        </motion.div>

        {activeWeather.alerts.map((alert, idx) => (
          <motion.div 
            key={idx}
            variants={itemVariants}
            className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-2xl shadow-sm flex items-start gap-4"
          >
            <AlertTriangle className="text-red-500 w-8 h-8 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-red-800 font-bold text-lg">{alert.event}</h3>
              <p className="text-red-700 text-sm mt-1 font-medium">{alert.description}</p>
              <p className="text-red-500 text-xs mt-2 font-semibold">Nguồn: {alert.sender_name} • Hiệu lực: {alert.start} - {alert.end}</p>
            </div>
          </motion.div>
        ))}

        {/* Main Content Area */}
        <div className="space-y-6">
          
          {/* Hero & Advice Split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Main Weather Card */}
              <motion.div 
                variants={itemVariants}
                className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[2rem] p-8 text-white shadow-lg shadow-emerald-500/20"
              >
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
                
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-7xl font-bold tracking-tighter drop-shadow-sm">
                        {activeWeather.current.temp}°
                      </div>
                      <div className="text-xl mt-2 font-medium text-slate-300">Cảm giác như {activeWeather.current.feels_like}°C</div>
                    </div>
                    <motion.div 
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      className="p-5 bg-white/10 rounded-3xl backdrop-blur-md border border-white/10"
                    >
                      {getWeatherIcon(activeWeather.current.weather.type, "w-24 h-24 text-white drop-shadow-md")}
                    </motion.div>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                    <div className="text-2xl font-semibold">{activeWeather.current.weather.description}</div>
                    <div className="flex items-center gap-6 text-base font-medium text-slate-300">
                      <div className="flex items-center gap-2"><Sunrise size={24} className="text-yellow-400"/> {activeWeather.current.sunrise}</div>
                      <div className="flex items-center gap-2"><Sunset size={24} className="text-orange-400"/> {activeWeather.current.sunset}</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Plant Doctor Advice */}
              <motion.div 
                variants={itemVariants}
                className={`rounded-[2rem] p-8 border ${advice.color} shadow-sm flex flex-col justify-center`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-4 rounded-2xl shadow-sm ${advice.iconBg} ${advice.iconColor}`}>
                    <Sprout size={36} />
                  </div>
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    Bác sĩ cây trồng
                  </h3>
                </div>
                <h4 className="font-bold text-lg mb-2">{advice.title}</h4>
                <p className="text-base leading-relaxed opacity-90 font-medium">
                  {advice.desc}
                </p>
              </motion.div>
            </div>

            {/* Hourly Forecast */}
            <motion.div 
              variants={itemVariants}
              className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100/80"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Dự báo 24 giờ tới</h3>
              </div>
              
              <div 
                ref={scrollRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                className={`flex gap-4 overflow-x-auto pb-4 pt-2 -mx-4 px-4 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`}
              >
                {activeWeather.hourly.map((hour, idx) => (
                  <motion.div 
                    key={idx} 
                    whileHover={{ y: -5, scale: 1.02 }}
                    className={`flex flex-col items-center justify-between min-w-[100px] p-5 rounded-2xl border transition-all ${
                      idx === 0 
                        ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-transparent shadow-lg shadow-emerald-500/20' 
                        : 'bg-white border-gray-100 hover:border-emerald-100 hover:shadow-md'
                    }`}
                  >
                    <span className={`text-base font-semibold ${idx === 0 ? 'text-white/90' : 'text-gray-500'}`}>{hour.time}</span>
                    <div className="my-5">
                      {getWeatherIcon(hour.type, `w-12 h-12 ${idx === 0 ? 'text-white' : ''}`)}
                    </div>
                    <span className={`text-3xl font-bold ${idx === 0 ? 'text-white' : 'text-gray-900'}`}>{hour.temp}°</span>
                    
                    <div className="w-full mt-4 space-y-2">
                      <div className={`flex items-center justify-center gap-1.5 text-sm font-medium ${idx === 0 ? 'text-emerald-100' : 'text-blue-500'}`}>
                        <Umbrella size={16} /> {hour.pop}%
                      </div>
                      <div className={`flex items-center justify-center gap-1.5 text-sm font-medium ${idx === 0 ? 'text-white/80' : 'text-gray-400'}`}>
                        <Wind size={16} /> {hour.wind}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* One Call API Bento Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Wind */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100/80 hover:shadow-md transition-all hover:-translate-y-1">
                <div className="flex items-center gap-3 text-gray-500 mb-4">
                  <Wind size={24} className="text-blue-500" />
                  <span className="text-base font-semibold">Gió & Giật</span>
                </div>
                <div className="text-3xl font-bold text-gray-900">{activeWeather.current.wind_speed} <span className="text-base font-medium text-gray-500">m/s</span></div>
                <div className="text-sm font-medium text-gray-500 mt-3 flex items-center gap-1.5">
                  <Compass size={18} /> {getWindDirection(activeWeather.current.wind_deg)} • Giật {activeWeather.current.wind_gust}
                </div>
              </div>

              {/* Moisture */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100/80 hover:shadow-md transition-all hover:-translate-y-1">
                <div className="flex items-center gap-3 text-gray-500 mb-4">
                  <Droplets size={24} className="text-teal-500" />
                  <span className="text-base font-semibold">Độ ẩm & Sương</span>
                </div>
                <div className="text-3xl font-bold text-gray-900">{activeWeather.current.humidity}%</div>
                <div className="text-sm font-medium text-gray-500 mt-3 flex items-center gap-1.5">
                  <Thermometer size={18} /> Điểm sương: {activeWeather.current.dew_point}°C
                </div>
              </div>

              {/* Atmosphere */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100/80 hover:shadow-md transition-all hover:-translate-y-1">
                <div className="flex items-center gap-3 text-gray-500 mb-4">
                  <Gauge size={24} className="text-purple-500" />
                  <span className="text-base font-semibold">Áp suất & Mây</span>
                </div>
                <div className="text-3xl font-bold text-gray-900">{activeWeather.current.pressure} <span className="text-base font-medium text-gray-500">hPa</span></div>
                <div className="text-sm font-medium text-gray-500 mt-3 flex items-center gap-1.5">
                  <Cloud size={18} /> Mây che phủ: {activeWeather.current.clouds}%
                </div>
              </div>

              {/* Sun & Visibility */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100/80 hover:shadow-md transition-all hover:-translate-y-1">
                <div className="flex items-center gap-3 text-gray-500 mb-4">
                  <ThermometerSun size={24} className="text-orange-500" />
                  <span className="text-base font-semibold">UV & Tầm nhìn</span>
                </div>
                <div className="text-3xl font-bold text-gray-900">{activeWeather.current.uvi} <span className="text-base font-medium text-red-500">(Rất cao)</span></div>
                <div className="text-sm font-medium text-gray-500 mt-3 flex items-center gap-1.5">
                  <Eye size={18} /> Tầm nhìn: {activeWeather.current.visibility / 1000} km
                </div>
              </div>
            </motion.div>

            {/* 8-Day Forecast */}
            <motion.div 
              variants={itemVariants}
              className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100/80"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">Dự báo 8 ngày</h3>
              <div className="flex flex-col">
                {activeWeather.daily.map((day, idx) => (
                  <div 
                    key={idx} 
                    className="group flex flex-col md:flex-row md:items-center justify-between py-5 border-b border-gray-100/60 last:border-0 gap-4 hover:bg-gray-50/50 transition-colors rounded-xl px-4 -mx-4"
                  >
                    <div className="flex items-center gap-4 w-full md:w-2/12">
                      <span className={`font-semibold text-lg ${idx === 0 ? 'text-emerald-600' : 'text-gray-700'}`}>{day.day}</span>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-2/12">
                      {getWeatherIcon(day.type, "w-8 h-8")}
                      {day.pop > 30 && <span className="text-sm font-bold text-blue-500">{day.pop}%</span>}
                    </div>
                    <div className="flex-1 text-sm text-gray-600 font-medium leading-relaxed">
                      {day.summary} <span className="text-gray-400 hidden lg:inline">• {day.tip}</span>
                    </div>
                    <div className="flex items-center md:justify-end gap-4 w-full md:w-2/12">
                      <span className="font-bold text-gray-900 text-xl">{day.max}°</span>
                      <span className="text-gray-400 font-medium text-lg">{day.min}°</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Xem thêm button */}
            <div className="flex justify-center pt-4 pb-2">
              <button
                onClick={() => setShowMore(!showMore)}
                className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-full text-gray-700 font-medium hover:bg-gray-50 hover:text-primary transition-colors shadow-sm"
              >
                {showMore ? (
                  <>Thu gọn <ChevronUp size={20} /></>
                ) : (
                  <>Xem thêm <ChevronDown size={20} /></>
                )}
              </button>
            </div>

            <AnimatePresence>
              {showMore && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-6 pt-2 pb-6">
                    {/* Other Locations */}
                    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100/80">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900">Thời tiết khu vực khác</h3>
                        <select 
                          value={selectedRegion}
                          onChange={(e) => setSelectedRegion(e.target.value)}
                          className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-primary focus:border-primary block p-2.5 font-medium outline-none cursor-pointer"
                        >
                          {regions.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {filteredLocations.map((loc, idx) => (
                          <motion.div 
                            key={idx} 
                            onClick={() => handleLocationSelect(loc)}
                            whileHover={{ scale: 1.02, y: -2 }}
                            className="flex items-center justify-between p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer"
                          >
                            <div>
                              <h4 className="font-bold text-gray-900 text-lg">{loc.name}</h4>
                              <p className="text-sm text-gray-500 font-medium mt-1">{loc.description}</p>
                              <div className="flex items-center gap-1 mt-2 text-xs font-semibold text-teal-600">
                                <Droplets size={14} /> Độ ẩm: {loc.humidity}%
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              {getWeatherIcon(loc.type, "w-10 h-10")}
                              <span className="text-2xl font-bold text-gray-900">{loc.temp}°</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

        </div>
      </motion.div>
    </div>
  );
}
