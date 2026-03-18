import React from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  Camera,
  Droplets,
  Sun,
  Activity,
  Apple,
  Flower2,
  Scissors,
  CheckCircle2,
} from "lucide-react";
import type { IMyGardenPlant } from "@agri-scan/shared";

interface TrackingViewProps {
  selectedPlant: IMyGardenPlant | null;
  setStep: (
    step: "OVERVIEW" | "UPLOAD" | "ANALYZING" | "RESULT" | "TRACKING",
  ) => void;
  setIsUpdatingTracked: (isUpdating: boolean) => void;
}

export function TrackingView({
  selectedPlant,
  setStep,
  setIsUpdatingTracked,
}: TrackingViewProps) {
  if (!selectedPlant) return null;
  const plant = selectedPlant;
  const stages = plant.growthStages;
  const currentStageIndex = plant.currentStageIndex;

  // Custom parameters based on group
  const params =
    plant.plantGroup === "FRUIT"
      ? [
          {
            icon: Droplets,
            color: "text-blue-500",
            label: "Độ ẩm đất",
            value: "65%",
          },
          {
            icon: Sun,
            color: "text-amber-500",
            label: "Ánh sáng",
            value: "8h/ngày",
          },
          {
            icon: Activity,
            color: "text-emerald-500",
            label: "Dinh dưỡng",
            value: "Cần Kali",
          },
          {
            icon: Apple,
            color: "text-orange-500",
            label: "Tỷ lệ đậu",
            value: "Cao",
          },
        ]
      : plant.plantGroup === "FLOWER"
        ? [
            {
              icon: Droplets,
              color: "text-blue-500",
              label: "Độ ẩm đất",
              value: "70%",
            },
            {
              icon: Sun,
              color: "text-amber-500",
              label: "Ánh sáng",
              value: "6h/ngày",
            },
            {
              icon: Activity,
              color: "text-emerald-500",
              label: "Dinh dưỡng",
              value: "Cần Lân",
            },
            {
              icon: Flower2,
              color: "text-pink-500",
              label: "Kích cỡ nụ",
              value: "Đang lớn",
            },
          ]
        : [
            {
              icon: Droplets,
              color: "text-blue-500",
              label: "Độ ẩm không khí",
              value: "80%",
            },
            {
              icon: Sun,
              color: "text-amber-500",
              label: "Ánh sáng",
              value: "Tán xạ",
            },
            {
              icon: Activity,
              color: "text-emerald-500",
              label: "Dinh dưỡng",
              value: "Cần Đạm",
            },
            {
              icon: Scissors,
              color: "text-purple-500",
              label: "Tình trạng tán",
              value: "Cần tỉa",
            },
          ];

  return (
    <motion.div
      key="tracking"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-6xl mx-auto px-4 py-8 md:py-12"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setStep("OVERVIEW")}
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:scale-105 transition-all shadow-sm border border-gray-100 shrink-0"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Theo dõi: {plant.customName}
            </h1>
            <p className="text-gray-500 font-medium mt-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Cập nhật theo thời gian thực
            </p>
          </div>
        </div>

        {/* Daily Photo Prompt */}
        <div className="bg-emerald-50/80 border border-emerald-100 rounded-2xl p-3.5 md:p-4 flex items-center gap-3 md:gap-4 w-full md:w-auto shadow-sm backdrop-blur-sm">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-100/50 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
            <Camera size={20} className="md:w-6 md:h-6" strokeWidth={2} />
          </div>
          <div className="pr-2 md:pr-4">
            <p className="font-bold text-gray-900 text-sm md:text-[15px] mb-0.5">
              Cập nhật trạng thái
            </p>
            <p className="text-xs md:text-[13px] text-gray-500">
              Chụp ảnh 1 lần/ngày để AI phân tích
            </p>
          </div>
          <button
            onClick={() => {
              setIsUpdatingTracked(true);
              setStep("UPLOAD");
            }}
            className="ml-auto bg-emerald-500 text-white px-4 md:px-5 py-2 md:py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-600 transition-all shadow-md shadow-emerald-500/20 whitespace-nowrap active:scale-95"
          >
            Chụp ngay
          </button>
        </div>
      </div>

      {/* Center Hub */}
      <div className="relative w-full max-w-5xl mx-auto h-[500px] md:h-[600px] flex items-center justify-center mb-16">
        
        {/* LỖI ĐÃ ĐƯỢC FIX Ở ĐÂY: Dây nối SVG sẽ hiển thị rõ nét */}
        <svg 
          viewBox="0 0 100 100" 
          preserveAspectRatio="none" 
          className="absolute inset-0 w-full h-full z-0 pointer-events-none hidden md:block"
        >
          <defs>
            <linearGradient id="line-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="line-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="line-grad-3" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="line-grad-4" x1="100%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.6" />
            </linearGradient>
          </defs>

          {/* Top Left */}
          <path
            d="M 25 25 Q 35 50 50 50"
            fill="none"
            stroke="url(#line-grad-1)"
            strokeWidth="3"
            strokeDasharray="6 6"
            vectorEffect="non-scaling-stroke"
            className="animate-[dash_20s_linear_infinite]"
          />
          {/* Top Right */}
          <path
            d="M 75 25 Q 65 50 50 50"
            fill="none"
            stroke="url(#line-grad-2)"
            strokeWidth="3"
            strokeDasharray="6 6"
            vectorEffect="non-scaling-stroke"
            className="animate-[dash_20s_linear_infinite]"
          />
          {/* Bottom Left */}
          <path
            d="M 25 75 Q 35 50 50 50"
            fill="none"
            stroke="url(#line-grad-3)"
            strokeWidth="3"
            strokeDasharray="6 6"
            vectorEffect="non-scaling-stroke"
            className="animate-[dash_20s_linear_infinite]"
          />
          {/* Bottom Right */}
          <path
            d="M 75 75 Q 65 50 50 50"
            fill="none"
            stroke="url(#line-grad-4)"
            strokeWidth="3"
            strokeDasharray="6 6"
            vectorEffect="non-scaling-stroke"
            className="animate-[dash_20s_linear_infinite]"
          />
        </svg>

        {/* Center Image */}
        <div className="w-56 h-56 md:w-72 md:h-72 rounded-full p-3 bg-white shadow-[0_0_50px_rgba(16,185,129,0.15)] z-10 relative group">
          <img
            src={plant.plantId?.images?.[0]}
            className="w-full h-full rounded-full object-cover group-hover:scale-105 transition-transform duration-500"
            alt={plant.customName}
          />
          <div className="absolute inset-0 rounded-full border-[6px] border-emerald-100"></div>
          <div
            className="absolute inset-0 rounded-full border-[6px] border-emerald-400 border-t-transparent animate-spin"
            style={{ animationDuration: "3s" }}
          ></div>
        </div>

        {/* Floating Stats */}
        {[
          {
            pos: "top-10 left-4 md:top-20 md:left-24",
            anim: "animate-[bounce_4s_infinite]",
            delay: "0s",
          },
          {
            pos: "top-10 right-4 md:top-20 md:right-24",
            anim: "animate-[bounce_5s_infinite]",
            delay: "1s",
          },
          {
            pos: "bottom-10 left-4 md:bottom-20 md:left-24",
            anim: "animate-[bounce_4.5s_infinite]",
            delay: "0.5s",
          },
          {
            pos: "bottom-10 right-4 md:bottom-20 md:right-24",
            anim: "animate-[bounce_5.5s_infinite]",
            delay: "1.5s",
          },
        ].map((config, index) => {
          const Icon = params[index].icon;
          return (
            <div
              key={index}
              className={`absolute ${config.pos} bg-white/90 backdrop-blur-md p-4 md:p-5 rounded-3xl shadow-xl border border-gray-100 flex items-center gap-4 ${config.anim} hover:scale-105 transition-transform cursor-default z-20`}
              style={{ animationDelay: config.delay }}
            >
              <div
                className={`w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center shadow-inner`}
              >
                <Icon className={params[index].color} size={24} />
              </div>
              <div>
                <p className="text-[10px] md:text-xs text-gray-400 uppercase font-extrabold tracking-wider mb-0.5">
                  {params[index].label}
                </p>
                <p className="font-black text-base md:text-lg text-gray-900">
                  {params[index].value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Roadmap / Timeline */}
      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-gray-200/50 border border-gray-100 max-w-5xl mx-auto relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-emerald-50 to-transparent rounded-bl-full -z-10"></div>

        <h3 className="text-2xl font-bold text-gray-900 mb-12 text-center">
          Lộ trình sinh trưởng
        </h3>

        <div className="relative px-4 md:px-10">
          {/* Line */}
          <div className="absolute top-5 md:top-6 left-10 right-10 h-1.5 bg-gray-100 rounded-full z-0"></div>
          {/* Active Line */}
          <div
            className="absolute top-5 md:top-6 left-10 h-1.5 bg-emerald-500 rounded-full z-0 transition-all duration-1000"
            style={{
              width: `calc(${(currentStageIndex / (stages.length - 1)) * 100}% - 20px)`,
            }}
          ></div>

          {/* Nodes */}
          <div className="flex justify-between relative z-10">
            {stages.map((stage, idx) => {
              const isPast = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;
              return (
                <div
                  key={stage}
                  className="flex flex-col items-center w-16 md:w-24"
                >
                  <div
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mb-4 transition-all duration-500 shadow-sm ${
                      isCurrent
                        ? "bg-emerald-500 text-white ring-8 ring-emerald-100 scale-110"
                        : isPast
                          ? "bg-emerald-500 text-white"
                          : "bg-white border-4 border-gray-100 text-gray-300"
                    }`}
                  >
                    {isPast ? (
                      <CheckCircle2 size={20} />
                    ) : (
                      <span className="text-sm md:text-base font-bold">
                        {idx + 1}
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-xs md:text-sm font-bold text-center leading-tight ${isCurrent ? "text-emerald-600" : isPast ? "text-gray-800" : "text-gray-400"}`}
                  >
                    {stage}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}