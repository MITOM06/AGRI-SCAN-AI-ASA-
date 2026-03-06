"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Filter, ChevronDown, ChevronUp } from "lucide-react";
import { treeData, Tree } from "../data/treeData";

export function TreeDictionary() {
  const [selectedTree, setSelectedTree] = useState<Tree | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedGrowthRates, setSelectedGrowthRates] = useState<string[]>([]);
  const [selectedLights, setSelectedLights] = useState<string[]>([]);
  const [selectedWaters, setSelectedWaters] = useState<string[]>([]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter options
  const categories = [
    "Cây bóng mát",
    "Cây cảnh quan",
    "Cây lấy gỗ",
    "Cây ăn quả",
    "Cây tâm linh",
    "Cây phong thủy",
  ];
  const growthRates = ["Nhanh", "Trung bình", "Chậm"];
  const lights = ["Ưa sáng", "Ưa bóng", "Bán phần"];
  const waters = ["Ít", "Trung bình", "Nhiều"];

  const toggleFilter = (
    item: string,
    current: string[],
    setter: (val: string[]) => void,
  ) => {
    if (current.includes(item)) {
      setter(current.filter((i) => i !== item));
    } else {
      setter([...current, item]);
    }
  };

  const filteredTrees = useMemo(() => {
    return treeData.filter((tree) => {
      const matchesSearch =
        tree.commonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tree.scientificName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategories.length === 0 ||
        tree.category.some((cat) => selectedCategories.includes(cat));

      const matchesGrowthRate =
        selectedGrowthRates.length === 0 ||
        selectedGrowthRates.includes(tree.growthRate);

      const matchesLight =
        selectedLights.length === 0 || selectedLights.includes(tree.light);

      const matchesWater =
        selectedWaters.length === 0 || selectedWaters.includes(tree.water);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesGrowthRate &&
        matchesLight &&
        matchesWater
      );
    });
  }, [
    searchTerm,
    selectedCategories,
    selectedGrowthRates,
    selectedLights,
    selectedWaters,
  ]);

  const FilterSection = ({
    title,
    items,
    selected,
    setter,
  }: {
    title: string;
    items: string[];
    selected: string[];
    setter: (val: string[]) => void;
  }) => (
    <div className="mb-6">
      <h3 className="font-semibold text-gray-900 mb-3">{title}</h3>
      <div className="space-y-2">
        {items.map((item) => (
          <label
            key={item}
            className="flex items-center space-x-2 cursor-pointer group"
          >
            <div
              className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selected.includes(item) ? "bg-emerald-500 border-emerald-500" : "border-gray-300 group-hover:border-emerald-400"}`}
            >
              {selected.includes(item) && (
                <div className="w-2.5 h-2.5 bg-white rounded-sm" />
              )}
            </div>
            <input
              type="checkbox"
              className="hidden"
              checked={selected.includes(item)}
              onChange={() => toggleFilter(item, selected, setter)}
            />
            <span
              className={`text-sm ${selected.includes(item) ? "text-gray-900 font-medium" : "text-gray-600"}`}
            >
              {item}
            </span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Từ Điển Cây Trồng
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Khám phá thế giới thực vật phong phú với thông tin chi tiết về đặc
            điểm, công dụng và cách chăm sóc.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Toggle */}
          <button
            className="lg:hidden flex items-center justify-center space-x-2 w-full py-3 bg-white border border-gray-200 rounded-xl shadow-sm text-gray-700 font-medium"
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
          >
            <Filter size={20} />
            <span>Bộ lọc</span>
            {isMobileFilterOpen ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </button>

          {/* Sidebar Filters */}
          <div
            className={`lg:w-64 shrink-0 ${isMobileFilterOpen ? "block" : "hidden lg:block"}`}
          >
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto no-scrollbar">
              <div className="flex items-center space-x-2 mb-6 pb-4 border-b border-gray-100">
                <Filter size={20} className="text-emerald-600" />
                <h2 className="font-bold text-lg text-gray-900">Bộ lọc</h2>
              </div>

              <FilterSection
                title="Loại cây"
                items={categories}
                selected={selectedCategories}
                setter={setSelectedCategories}
              />
              <FilterSection
                title="Tốc độ sinh trưởng"
                items={growthRates}
                selected={selectedGrowthRates}
                setter={setSelectedGrowthRates}
              />
              <FilterSection
                title="Nhu cầu ánh sáng"
                items={lights}
                selected={selectedLights}
                setter={setSelectedLights}
              />
              <FilterSection
                title="Nhu cầu nước"
                items={waters}
                selected={selectedWaters}
                setter={setSelectedWaters}
              />

              {(selectedCategories.length > 0 ||
                selectedGrowthRates.length > 0 ||
                selectedLights.length > 0 ||
                selectedWaters.length > 0) && (
                <button
                  onClick={() => {
                    setSelectedCategories([]);
                    setSelectedGrowthRates([]);
                    setSelectedLights([]);
                    setSelectedWaters([]);
                  }}
                  className="w-full py-2 text-sm text-red-500 hover:text-red-600 font-medium border border-red-100 hover:border-red-200 rounded-lg transition-colors mt-2"
                >
                  Xóa bộ lọc
                </button>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search Bar */}
            <div className="mb-8 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm shadow-sm transition duration-150 ease-in-out"
                placeholder="Tìm kiếm theo tên cây hoặc tên khoa học..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTrees.map((tree) => (
                <motion.div
                  key={tree.id}
                  layoutId={`card-${tree.id}`}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden cursor-pointer group border border-gray-100 flex flex-col h-full"
                  onClick={() => setSelectedTree(tree)}
                  whileHover={{ y: -4 }}
                >
                  <div className="aspect-w-16 aspect-h-10 h-48 overflow-hidden relative">
                    <motion.img
                      layoutId={`image-${tree.id}`}
                      src={tree.images[0]}
                      alt={tree.commonName}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 flex flex-wrap gap-1 justify-end">
                      {tree.category.slice(0, 1).map((cat) => (
                        <span
                          key={cat}
                          className="bg-black/50 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded-full"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <motion.h3
                      layoutId={`title-${tree.id}`}
                      className="text-lg font-bold text-gray-900 mb-1"
                    >
                      {tree.commonName}
                    </motion.h3>
                    <p className="text-xs text-emerald-600 font-medium italic mb-3">
                      {tree.scientificName}
                    </p>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">
                      {tree.description}
                    </p>

                    <div className="flex items-center gap-2 text-xs text-gray-500 pt-3 border-t border-gray-50">
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        {tree.growthRate}
                      </span>
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        {tree.light}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredTrees.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
                <p className="text-gray-500 text-lg">
                  Không tìm thấy cây nào phù hợp.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategories([]);
                    setSelectedGrowthRates([]);
                    setSelectedLights([]);
                    setSelectedWaters([]);
                  }}
                  className="mt-4 text-emerald-600 font-medium hover:underline"
                >
                  Xóa tất cả bộ lọc
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Modal Popup */}
        <AnimatePresence>
          {selectedTree && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                onClick={() => setSelectedTree(null)}
              />
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <motion.div
                  layoutId={`card-${selectedTree.id}`}
                  className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row pointer-events-auto relative"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTree(null);
                    }}
                    className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors backdrop-blur-md"
                  >
                    <X size={20} />
                  </button>

                  <div className="w-full md:w-1/2 h-64 md:h-auto relative">
                    <motion.img
                      layoutId={`image-${selectedTree.id}`}
                      src={selectedTree.images[0]}
                      alt={selectedTree.commonName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                      {selectedTree.category.map((cat) => (
                        <span
                          key={cat}
                          className="bg-black/50 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="w-full md:w-1/2 p-8 overflow-y-auto max-h-[60vh] md:max-h-[90vh] no-scrollbar">
                    <motion.h2
                      layoutId={`title-${selectedTree.id}`}
                      className="text-3xl font-bold text-gray-900 mb-2"
                    >
                      {selectedTree.commonName}
                    </motion.h2>
                    <p className="text-lg text-emerald-600 font-medium italic mb-6 border-b border-gray-100 pb-4">
                      {selectedTree.scientificName}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="text-xs text-gray-400 uppercase font-bold block mb-1">
                          Tốc độ lớn
                        </span>
                        <span className="text-gray-800 font-medium">
                          {selectedTree.growthRate}
                        </span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="text-xs text-gray-400 uppercase font-bold block mb-1">
                          Ánh sáng
                        </span>
                        <span className="text-gray-800 font-medium">
                          {selectedTree.light}
                        </span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="text-xs text-gray-400 uppercase font-bold block mb-1">
                          Nước
                        </span>
                        <span className="text-gray-800 font-medium">
                          {selectedTree.water}
                        </span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="text-xs text-gray-400 uppercase font-bold block mb-1">
                          Họ
                        </span>
                        <span
                          className="text-gray-800 font-medium truncate"
                          title={selectedTree.family}
                        >
                          {selectedTree.family}
                        </span>
                      </div>
                    </div>

                    {/* Additional Info Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-gray-100">
                      {selectedTree.height && (
                        <div>
                          <span className="text-xs text-gray-400 uppercase font-bold block mb-1">
                            Chiều cao
                          </span>
                          <span className="text-gray-700 text-sm">
                            {selectedTree.height}
                          </span>
                        </div>
                      )}
                      {selectedTree.floweringTime && (
                        <div>
                          <span className="text-xs text-gray-400 uppercase font-bold block mb-1">
                            Mùa ra hoa
                          </span>
                          <span className="text-gray-700 text-sm">
                            {selectedTree.floweringTime}
                          </span>
                        </div>
                      )}
                      {selectedTree.suitableLocation && (
                        <div className="col-span-2">
                          <span className="text-xs text-gray-400 uppercase font-bold block mb-1">
                            Vị trí trồng
                          </span>
                          <span className="text-gray-700 text-sm">
                            {selectedTree.suitableLocation}
                          </span>
                        </div>
                      )}
                      {selectedTree.soil && (
                        <div className="col-span-2">
                          <span className="text-xs text-gray-400 uppercase font-bold block mb-1">
                            Loại đất
                          </span>
                          <span className="text-gray-700 text-sm">
                            {selectedTree.soil}
                          </span>
                        </div>
                      )}
                      {selectedTree.commonDiseases && (
                        <div className="col-span-2">
                          <span className="text-xs text-gray-400 uppercase font-bold block mb-1">
                            Bệnh thường gặp
                          </span>
                          <span className="text-red-600 text-sm font-medium">
                            {selectedTree.commonDiseases}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                          Mô tả
                        </h4>
                        <p className="text-gray-700 leading-relaxed">
                          {selectedTree.description}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                          Công dụng
                        </h4>
                        <p className="text-gray-700 leading-relaxed">
                          {selectedTree.uses}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                          Cách chăm sóc
                        </h4>
                        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                          <p className="text-emerald-800 leading-relaxed">
                            {selectedTree.care}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
