import React from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  Trash2,
  Apple,
  Flower2,
  Leaf,
  ScanLine,
  Sun,
  Droplets,
  Thermometer,
  Activity,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Calendar,
  Scissors,
  Sparkles,
  Plus,
} from "lucide-react";
import type { IMyGardenPlant } from "@agri-scan/shared";
import { containerVariants, itemVariants } from "@/utils/animation";
import { useT } from "@/context/I18nContext";

interface ResultViewProps {
  selectedPlant: IMyGardenPlant | null;
  isViewingTracked: boolean;
  handleReset: () => void;
  handleRemovePlant: (id: string) => void;
  handleAddToGarden: () => void;
}

export function ResultView({
  selectedPlant,
  isViewingTracked,
  handleReset,
  handleRemovePlant,
  handleAddToGarden,
}: ResultViewProps) {
  const t = useT();

  if (!selectedPlant) return null;

  const displayName =
    selectedPlant.customName?.trim() ||
    selectedPlant.plantInfo?.commonName?.trim() ||
    selectedPlant.aiLabel?.trim() ||
    t("myGarden.defaultPlantName");

  const subTitle =
    selectedPlant.plantInfo?.commonName?.trim() ||
    selectedPlant.aiLabel?.trim() ||
    t("myGarden.noDetailYet");

  const imageSrc =
    selectedPlant.imageUrl ||
    selectedPlant.plantInfo?.images?.[0] ||
    "/placeholder-plant.png";

  const conditionText =
    selectedPlant.currentCondition?.trim() || t("myGarden.noDiagnosisYet");

  // So khớp trên GIÁ TRỊ dữ liệu (nhiều biến thể) — không dùng nhãn đã dịch
  const isHealthy = [
    "khỏe mạnh",
    "khoe manh",
    "healthy",
    "normal",
  ].includes(conditionText.toLowerCase());

  const health: "GOOD" | "NEEDS_ATTENTION" = isHealthy
    ? "GOOD"
    : "NEEDS_ATTENTION";

  const getHealthColors = (value: "GOOD" | "NEEDS_ATTENTION" | "BAD") => {
    if (value === "GOOD") {
      return {
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        text: "text-emerald-800",
        icon: "text-emerald-500",
        glow: "shadow-emerald-500/20",
      };
    }

    if (value === "NEEDS_ATTENTION") {
      return {
        bg: "bg-amber-50",
        border: "border-amber-200",
        text: "text-amber-800",
        icon: "text-amber-500",
        glow: "shadow-amber-500/20",
      };
    }

    return {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-800",
      icon: "text-red-500",
      glow: "shadow-red-500/20",
    };
  };

  const healthStyle = getHealthColors(health);

  const renderFruitSpecific = () => (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-orange-100 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-orange-100/50 to-transparent rounded-bl-full -z-10 transition-transform duration-700 group-hover:scale-110"></div>
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 shadow-inner">
            <Calendar size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {t("myGarden.expectedFruitDate")}
          </h2>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm font-bold text-gray-400 mb-4 px-2">
            <span>{t("myGarden.stageSeeding")}</span>
            <span className="text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
              {t("myGarden.stageFloweringNow")}
            </span>
            <span>{t("myGarden.stageHarvest")}</span>
          </div>
          <div className="h-6 bg-gray-100 rounded-full overflow-hidden shadow-inner p-1">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "60%" }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
              className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full relative shadow-sm"
            >
              <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-r from-transparent to-white/40 animate-pulse rounded-r-full"></div>
            </motion.div>
          </div>
          <p className="text-center mt-6 text-gray-600 text-lg">
            {t("myGarden.harvestInPrefix")}{" "}
            <span className="font-extrabold text-orange-600 text-2xl mx-1">
              25-30
            </span>{" "}
            {t("myGarden.daysLeftSuffix")}
          </p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Apple size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {t("myGarden.fruitTipsTitle")}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              step: 1,
              title: t("myGarden.fruitTip1Title"),
              desc: t("myGarden.fruitTip1Desc"),
            },
            {
              step: 2,
              title: t("myGarden.fruitTip2Title"),
              desc: t("myGarden.fruitTip2Desc"),
            },
            {
              step: 3,
              title: t("myGarden.fruitTip3Title"),
              desc: t("myGarden.fruitTip3Desc"),
            },
            {
              step: 4,
              title: t("myGarden.fruitTip4Title"),
              desc: t("myGarden.fruitTip4Desc"),
            },
          ].map((item) => (
            <div
              key={item.step}
              className="p-6 border border-gray-100 rounded-3xl hover:border-orange-200 hover:shadow-lg hover:shadow-orange-500/5 transition-all bg-white group"
            >
              <h3 className="font-bold text-gray-900 text-lg mb-3 flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center text-sm group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  {item.step}
                </span>
                {item.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderFlowerSpecific = () => (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-pink-100 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-pink-100/50 to-transparent rounded-bl-full -z-10 transition-transform duration-700 group-hover:scale-110"></div>
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-pink-100 flex items-center justify-center text-pink-600 shadow-inner">
            <Calendar size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {t("myGarden.expectedBloomDate")}
          </h2>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm font-bold text-gray-400 mb-4 px-2">
            <span>{t("myGarden.stageSprouting")}</span>
            <span className="text-pink-600 bg-pink-50 px-3 py-1 rounded-full">
              {t("myGarden.stageBuddingNow")}
            </span>
            <span>{t("myGarden.stageFullBloom")}</span>
          </div>
          <div className="h-6 bg-gray-100 rounded-full overflow-hidden shadow-inner p-1">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "80%" }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
              className="h-full bg-gradient-to-r from-pink-400 to-rose-500 rounded-full relative shadow-sm"
            >
              <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-r from-transparent to-white/40 animate-pulse rounded-r-full"></div>
            </motion.div>
          </div>
          <p className="text-center mt-6 text-gray-600 text-lg">
            {t("myGarden.bloomInPrefix")}{" "}
            <span className="font-extrabold text-pink-600 text-2xl mx-1">
              5-7
            </span>{" "}
            {t("myGarden.daysLeftSuffix")}
          </p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-600">
            <Flower2 size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {t("myGarden.flowerTipsTitle")}
          </h2>
        </div>

        <div className="space-y-4">
          {[
            {
              icon: Sun,
              color: "text-amber-500",
              bg: "bg-amber-50",
              title: t("myGarden.flowerTip1Title"),
              desc: t("myGarden.flowerTip1Desc"),
            },
            {
              icon: Droplets,
              color: "text-blue-500",
              bg: "bg-blue-50",
              title: t("myGarden.flowerTip2Title"),
              desc: t("myGarden.flowerTip2Desc"),
            },
            {
              icon: Sparkles,
              color: "text-purple-500",
              bg: "bg-purple-50",
              title: t("myGarden.flowerTip3Title"),
              desc: t("myGarden.flowerTip3Desc"),
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex gap-6 p-6 bg-gray-50/50 border border-gray-100 rounded-3xl hover:bg-white hover:shadow-md hover:border-pink-100 transition-all group"
            >
              <div
                className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center shadow-sm shrink-0 group-hover:scale-110 transition-transform`}
              >
                <item.icon size={28} className={item.color} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderOrnamentalSpecific = () => (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-emerald-100 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-emerald-100/50 to-transparent rounded-bl-full -z-10 transition-transform duration-700 group-hover:scale-110"></div>
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner">
            <Scissors size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {t("myGarden.pruningTitle")}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="relative rounded-3xl overflow-hidden mb-6 shadow-md group-hover:shadow-xl transition-shadow">
              <img
                src="https://images.unsplash.com/photo-1599598425947-330026296904?auto=format&fit=crop&q=80&w=600"
                alt="Pruning guide"
                className="w-full h-56 object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <span className="text-white font-bold flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400" />{" "}
                  {t("myGarden.pruningCorrectSpot")}
                </span>
              </div>
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">
              {t("myGarden.pruningIdealAngle")}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {t("myGarden.pruningIdealAngleDesc")}
            </p>
          </div>
          <div className="space-y-4 flex flex-col justify-center">
            {[
              {
                title: t("myGarden.pruningTip1Title"),
                desc: t("myGarden.pruningTip1Desc"),
              },
              {
                title: t("myGarden.pruningTip2Title"),
                desc: t("myGarden.pruningTip2Desc"),
              },
              {
                title: t("myGarden.pruningTip3Title"),
                desc: t("myGarden.pruningTip3Desc"),
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-4 border border-gray-100 rounded-2xl hover:border-emerald-200 hover:bg-emerald-50/30 transition-colors"
              >
                <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600">
            <Leaf size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {t("myGarden.leafCareTitle")}
          </h2>
        </div>

        <div className="grid gap-4">
          {[
            {
              icon: Droplets,
              color: "text-teal-600",
              bg: "bg-teal-100",
              title: t("myGarden.leafTip1Title"),
              desc: t("myGarden.leafTip1Desc"),
            },
            {
              icon: Sun,
              color: "text-amber-500",
              bg: "bg-amber-100",
              title: t("myGarden.leafTip2Title"),
              desc: t("myGarden.leafTip2Desc"),
            },
            {
              icon: Sparkles,
              color: "text-emerald-500",
              bg: "bg-emerald-100",
              title: t("myGarden.leafTip3Title"),
              desc: t("myGarden.leafTip3Desc"),
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex gap-5 items-start p-5 rounded-2xl hover:bg-gray-50 transition-colors"
            >
              <div
                className={`w-12 h-12 rounded-xl ${item.bg} ${item.color} flex items-center justify-center shrink-0 shadow-sm`}
              >
                <item.icon size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      key="result"
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-6xl mx-auto px-4 py-8"
    >
      <div className="flex justify-between items-center mb-8">
        <motion.button
          variants={itemVariants}
          onClick={handleReset}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold transition-colors group bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 w-fit"
        >
          <ChevronLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          {isViewingTracked
            ? t("myGarden.backToGarden")
            : t("myGarden.scanAnother")}
        </motion.button>

        {isViewingTracked && (
          <motion.button
            variants={itemVariants}
            onClick={() => handleRemovePlant(selectedPlant._id)}
            className="flex items-center gap-2 text-red-500 hover:text-red-700 hover:bg-red-50 font-bold transition-colors px-4 py-2 rounded-full"
          >
            <Trash2 size={18} /> {t("myGarden.removeFromGarden")}
          </motion.button>
        )}
      </div>

      <motion.div
        variants={itemVariants}
        className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden mb-10 relative"
      >
        <div
          className="absolute top-0 right-0 w-1/2 h-full opacity-10 blur-3xl pointer-events-none"
          style={{
            backgroundImage: `url(${imageSrc})`,
            backgroundSize: "cover",
          }}
        ></div>

        <div className="flex flex-col md:flex-row relative z-10">
          <div className="md:w-2/5 h-80 md:h-auto relative p-4">
            <div className="w-full h-full rounded-[2rem] overflow-hidden shadow-inner relative group">
              <img
                src={imageSrc}
                alt={displayName}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80"></div>
              <div className="absolute bottom-6 left-6 px-4 py-2 bg-white/95 backdrop-blur-md rounded-full text-sm font-bold text-gray-900 shadow-xl flex items-center gap-2">
                {selectedPlant.userGoal === "GET_FRUIT" && (
                  <>
                    <Apple size={16} className="text-orange-500" />{" "}
                    {t("myGarden.groupFruit")}
                  </>
                )}
                {selectedPlant.userGoal === "GET_FLOWER" && (
                  <>
                    <Flower2 size={16} className="text-pink-500" />{" "}
                    {t("myGarden.groupFlower")}
                  </>
                )}
                {(selectedPlant.userGoal === "MAINTAIN" ||
                  selectedPlant.userGoal === "HEAL_DISEASE") && (
                  <>
                    <Leaf size={16} className="text-emerald-500" />{" "}
                    {t("myGarden.groupOrnamental")}
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12 md:w-3/5 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-3 mb-4"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                <ScanLine size={16} className="text-emerald-600" />
              </div>
              <span className="text-emerald-600 font-bold text-sm tracking-widest uppercase">
                {t("myGarden.identified")}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3"
            >
              {displayName}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-gray-500 text-xl italic mb-10 font-serif"
            >
              {subTitle}
            </motion.p>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {[
                {
                  icon: Sun,
                  color: "text-amber-500",
                  bg: "bg-amber-50",
                  label: t("myGarden.labelLight"),
                  value: "Cao",
                },
                {
                  icon: Droplets,
                  color: "text-blue-500",
                  bg: "bg-blue-50",
                  label: t("myGarden.labelWatering"),
                  value: t("myGarden.valueEveryTwoDays"),
                },
                {
                  icon: Thermometer,
                  color: "text-red-400",
                  bg: "bg-red-50",
                  label: t("myGarden.labelTemperature"),
                  value: "22-28°C",
                },
                {
                  icon: Activity,
                  color: "text-emerald-500",
                  bg: "bg-emerald-50",
                  label: t("myGarden.labelDifficulty"),
                  value: t("myGarden.valueMedium"),
                },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="bg-white border border-gray-100 p-5 rounded-3xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group"
                >
                  <div
                    className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <item.icon size={24} className={item.color} />
                  </div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">
                    {item.label}
                  </p>
                  <p className="font-extrabold text-gray-900 text-lg">
                    {item.value}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div variants={itemVariants} className="lg:col-span-1 space-y-8">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gray-900 flex items-center justify-center text-white shadow-lg shadow-gray-900/20">
                <Activity size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {t("myGarden.diagnosis")}
              </h2>
            </div>

            <div
              className={`p-6 rounded-3xl mb-8 border shadow-lg ${healthStyle.bg} ${healthStyle.border} ${healthStyle.glow}`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm ${healthStyle.icon}`}
                >
                  {health === "GOOD" ? (
                    <CheckCircle2 size={24} />
                  ) : (
                    <AlertCircle size={24} />
                  )}
                </div>
                <div>
                  <p
                    className={`text-xl font-extrabold mb-2 ${healthStyle.text}`}
                  >
                    {health === "GOOD"
                      ? t("myGarden.plantHealthy")
                      : t("myGarden.needsAttention")}
                  </p>
                  <p
                    className={`text-sm leading-relaxed ${healthStyle.text} opacity-90 font-medium`}
                  >
                    {conditionText}
                  </p>
                </div>
              </div>
            </div>

            {health !== "GOOD" && (
              <div className="space-y-5">
                <h3 className="font-bold text-gray-900 text-lg">
                  {t("myGarden.treatmentPlan")}
                </h3>
                <ul className="space-y-4">
                  <li className="flex gap-4 items-start group">
                    <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-primary group-hover:text-white transition-colors flex items-center justify-center font-bold text-gray-900 shrink-0 mt-0.5">
                      1
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {t("myGarden.treatmentStep1")}
                    </p>
                  </li>
                  <li className="flex gap-4 items-start group">
                    <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-primary group-hover:text-white transition-colors flex items-center justify-center font-bold text-gray-900 shrink-0 mt-0.5">
                      2
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {t("myGarden.treatmentStep2")}
                    </p>
                  </li>
                  <li className="flex gap-4 items-start group">
                    <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-primary group-hover:text-white transition-colors flex items-center justify-center font-bold text-gray-900 shrink-0 mt-0.5">
                      3
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {t("myGarden.treatmentStep3")}
                    </p>
                  </li>
                </ul>

                <button className="w-full mt-6 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 transition-all hover:shadow-lg hover:shadow-gray-900/20 flex items-center justify-center gap-2 group">
                  {t("myGarden.buyTreatment")}
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </div>
            )}

            {!isViewingTracked && (
              <div className="mt-8 pt-8 border-t border-gray-100">
                <button
                  onClick={handleAddToGarden}
                  className="w-full py-4 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95"
                >
                  <Plus size={20} /> {t("myGarden.addToMyGarden")}
                </button>
                <p className="text-center text-sm text-gray-500 mt-3">
                  {t("myGarden.addToMyGardenHint")}
                </p>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="lg:col-span-2">
          {selectedPlant.userGoal === "GET_FRUIT" && renderFruitSpecific()}
          {selectedPlant.userGoal === "GET_FLOWER" && renderFlowerSpecific()}
          {(selectedPlant.userGoal === "MAINTAIN" ||
            selectedPlant.userGoal === "HEAL_DISEASE") &&
            renderOrnamentalSpecific()}
        </motion.div>
      </div>
    </motion.div>
  );
}