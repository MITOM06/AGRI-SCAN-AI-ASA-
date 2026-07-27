import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import {
  Search,
  Filter,
  X,
  ChevronLeft,
  Droplet,
  Sun,
  TrendingUp,
  Leaf,
} from "lucide-react-native";

// 🔥 IMPORT API THẬT
import { plantApi } from "@agri-scan/shared";
import { useT } from "../context/I18nContext";

import { styles } from "../styles/tree-dictionary.styles";
// `value` là DỮ LIỆU thật trong MongoDB (plant.growthRate, plant.light, ...) nên
// PHẢI giữ nguyên tiếng Việt — bộ lọc so khớp bằng chuỗi này. Chỉ `labelKey`
// được dịch. Giống hệt cách làm ở web (TreeDictionary.tsx).
const CATEGORIES = [
  { value: "Cây bóng mát", labelKey: "encyclopedia.typeShade" },
  { value: "Cây cảnh quan", labelKey: "encyclopedia.typeLandscape" },
  { value: "Cây lấy gỗ", labelKey: "encyclopedia.typeTimber" },
  { value: "Cây ăn quả", labelKey: "encyclopedia.typeFruit" },
  { value: "Cây tâm linh", labelKey: "encyclopedia.typeSpiritual" },
  { value: "Cây phong thủy", labelKey: "encyclopedia.typeFengShui" },
];
const GROWTH_RATES = [
  { value: "Nhanh", labelKey: "encyclopedia.growthFast" },
  { value: "Trung bình", labelKey: "encyclopedia.growthMedium" },
  { value: "Chậm", labelKey: "encyclopedia.growthSlow" },
];
const LIGHTS = [
  { value: "Ưa sáng", labelKey: "encyclopedia.lightFull" },
  { value: "Ưa bóng", labelKey: "encyclopedia.lightShade" },
  { value: "Bán phần", labelKey: "encyclopedia.lightPartial" },
];
const WATERS = [
  { value: "Ít", labelKey: "encyclopedia.waterLow" },
  { value: "Trung bình", labelKey: "encyclopedia.waterMedium" },
  { value: "Nhiều", labelKey: "encyclopedia.waterHigh" },
];

export default function TreeDictionaryScreen() {
  const t = useT();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // STATES QUẢN LÝ DỮ LIỆU TỪ API
  const [plants, setPlants] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // STATES CHO CHI TIẾT CÂY
  const [selectedTree, setSelectedTree] = useState<any | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  // GỌI API LẤY DANH SÁCH LẦN ĐẦU
  useEffect(() => {
    const fetchPlants = async () => {
      try {
        setIsLoading(true);
        const data = await plantApi.getAllPlants();
        if (data && data.length > 0) {
          setPlants(data);
        }
      } catch (error) {
        console.log("Lỗi tải danh sách cây:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlants();
  }, []);

  // STATES FILTER
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedGrowthRates, setSelectedGrowthRates] = useState<string[]>([]);
  const [selectedLights, setSelectedLights] = useState<string[]>([]);
  const [selectedWaters, setSelectedWaters] = useState<string[]>([]);

  // LỌC DỮ LIỆU DỰA TRÊN API (Chỉ dùng được search do danh sách rút gọn ko có chi tiết)
  const filteredTrees = useMemo(() => {
    return plants.filter((tree) => {
      const matchesSearch =
        tree.commonName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tree.scientificName?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
  }, [plants, searchTerm]);

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

  const CustomCheckbox = ({
    label,
    isSelected,
    onPress,
  }: {
    label: string;
    isSelected: boolean;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      style={styles.checkboxContainer}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.checkboxBox, isSelected && styles.checkboxSelected]}>
        {isSelected && <View style={styles.checkboxInner} />}
      </View>
      <Text
        style={[
          styles.checkboxLabel,
          isSelected && styles.checkboxLabelSelected,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  // HÀM GỌI API LẤY CHI TIẾT KHI BẤM VÀO CARD
  const handleSelectPlant = async (id: string) => {
    setIsLoadingDetail(true);
    try {
      const detail = await plantApi.getPlantById(id);
      setSelectedTree(detail);
    } catch (error) {
      console.log("Lỗi khi tải chi tiết:", error);
      Alert.alert(
        t("common.error"),
        t("encyclopedia.loadDetailFailedShort"),
      );
    } finally {
      setIsLoadingDetail(false);
    }
  };

  // CARD HIỂN THỊ ITEM
  const renderTreeCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => handleSelectPlant(item.id || item._id)}
    >
      <View style={styles.cardImageContainer}>
        <Image
          source={{
            uri: item.images?.[0] || "https://via.placeholder.com/150",
          }}
          style={styles.cardImage}
        />
        <View style={styles.cardBadgeContainer}>
          <View style={styles.cardBadge}>
            <Text style={styles.cardBadgeText}>
              {item.family || t("encyclopedia.familyFallback")}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.commonName}
        </Text>
        <Text style={styles.cardSubTitle} numberOfLines={1}>
          {item.scientificName}
        </Text>

        <View style={styles.cardTags}>
          <View
            style={[
              styles.tag,
              {
                backgroundColor:
                  item.status === "APPROVED" ? "#dcfce3" : "#fef08a",
              },
            ]}
          >
            <Text
              style={[
                styles.tagText,
                { color: item.status === "APPROVED" ? "#16a34a" : "#ca8a04" },
              ]}
            >
              {item.status === "APPROVED"
                ? t("encyclopedia.approved")
                : t("encyclopedia.pending")}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* HEADER */}
      <View
        style={[styles.header, { paddingTop: Math.max(insets.top, 10) + 10 }]}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={28} color="#111827" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>{t("encyclopedia.title")}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* SEARCH BAR & FILTER BTN */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Search size={20} color="#9ca3af" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={t("encyclopedia.searchPlaceholderShort")}
            placeholderTextColor="#9ca3af"
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchTerm("")}
              style={{ padding: 4 }}
            >
              <X size={18} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={styles.filterBtn}
          onPress={() => setIsFilterModalOpen(true)}
        >
          <Filter size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* SỐ LƯỢNG KẾT QUẢ */}
      <Text style={styles.resultCount}>
        {t("encyclopedia.resultCount", { count: filteredTrees.length })}
      </Text>

      {/* DANH SÁCH CÂY */}
      {isLoading ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#16a34a" />
          <Text style={[styles.emptyText, { marginTop: 8 }]}>
            {t("encyclopedia.loadingData")}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredTrees}
          keyExtractor={(item) =>
            item.id || item._id || Math.random().toString()
          }
          renderItem={renderTreeCard}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {t("encyclopedia.noResults")}
              </Text>
            </View>
          }
        />
      )}

      {/* LOADING OVERLAY CHI TIẾT */}
      {isLoadingDetail && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#16a34a" />
          <Text style={styles.loadingText}>
            {t("encyclopedia.loadingDetail")}
          </Text>
        </View>
      )}

      {/* ========================================== */}
      {/* MODAL 1: BỘ LỌC (BOTTOM SHEET)               */}
      {/* ========================================== */}
      <Modal
        visible={isFilterModalOpen}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.filterSheet,
              { paddingBottom: Math.max(insets.bottom, 20) },
            ]}
          >
            <View style={styles.filterHeader}>
              <Text style={styles.filterHeaderTitle}>
                {t("encyclopedia.filterSheetTitle")}
              </Text>
              <TouchableOpacity onPress={() => setIsFilterModalOpen(false)}>
                <X size={24} color="#374151" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.filterGroup}>
                <Text style={styles.filterGroupTitle}>
                  {t("encyclopedia.filterType")}
                </Text>
                {CATEGORIES.map((cat) => (
                  <CustomCheckbox
                    key={cat.value}
                    label={t(cat.labelKey)}
                    isSelected={selectedCategories.includes(cat.value)}
                    onPress={() =>
                      toggleFilter(
                        cat.value,
                        selectedCategories,
                        setSelectedCategories,
                      )
                    }
                  />
                ))}
              </View>

              <View style={styles.filterGroup}>
                <Text style={styles.filterGroupTitle}>
                  {t("encyclopedia.filterGrowth")}
                </Text>
                <View style={styles.chipRow}>
                  {GROWTH_RATES.map((rate) => (
                    <TouchableOpacity
                      key={rate.value}
                      style={[
                        styles.chip,
                        selectedGrowthRates.includes(rate.value) &&
                          styles.chipActive,
                      ]}
                      onPress={() =>
                        toggleFilter(
                          rate.value,
                          selectedGrowthRates,
                          setSelectedGrowthRates,
                        )
                      }
                    >
                      <Text
                        style={[
                          styles.chipText,
                          selectedGrowthRates.includes(rate.value) &&
                            styles.chipTextActive,
                        ]}
                      >
                        {t(rate.labelKey)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.filterGroup}>
                <Text style={styles.filterGroupTitle}>
                  {t("encyclopedia.filterLight")}
                </Text>
                <View style={styles.chipRow}>
                  {LIGHTS.map((light) => (
                    <TouchableOpacity
                      key={light.value}
                      style={[
                        styles.chip,
                        selectedLights.includes(light.value) &&
                          styles.chipActive,
                      ]}
                      onPress={() =>
                        toggleFilter(
                          light.value,
                          selectedLights,
                          setSelectedLights,
                        )
                      }
                    >
                      <Text
                        style={[
                          styles.chipText,
                          selectedLights.includes(light.value) &&
                            styles.chipTextActive,
                        ]}
                      >
                        {t(light.labelKey)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.filterGroup}>
                <Text style={styles.filterGroupTitle}>
                  {t("encyclopedia.filterWater")}
                </Text>
                <View style={styles.chipRow}>
                  {WATERS.map((water) => (
                    <TouchableOpacity
                      key={water.value}
                      style={[
                        styles.chip,
                        selectedWaters.includes(water.value) &&
                          styles.chipActive,
                      ]}
                      onPress={() =>
                        toggleFilter(
                          water.value,
                          selectedWaters,
                          setSelectedWaters,
                        )
                      }
                    >
                      <Text
                        style={[
                          styles.chipText,
                          selectedWaters.includes(water.value) &&
                            styles.chipTextActive,
                        ]}
                      >
                        {t(water.labelKey)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            <View style={styles.filterFooter}>
              <TouchableOpacity
                style={styles.clearFilterBtn}
                onPress={() => {
                  setSelectedCategories([]);
                  setSelectedGrowthRates([]);
                  setSelectedLights([]);
                  setSelectedWaters([]);
                }}
              >
                <Text style={styles.clearFilterText}>
                  {t("encyclopedia.clearFilters")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyFilterBtn}
                onPress={() => setIsFilterModalOpen(false)}
              >
                <Text style={styles.applyFilterText}>
                  {t("encyclopedia.applyFilters")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ========================================== */}
      {/* MODAL 2: CHI TIẾT CÂY DÙNG DATA API         */}
      {/* ========================================== */}
      <Modal visible={!!selectedTree} animationType="slide" transparent={false}>
        <View
          style={[styles.detailContainer, { paddingBottom: insets.bottom }]}
        >
          {selectedTree && (
            <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
              {/* Ảnh bìa */}
              <View style={styles.detailImageWrapper}>
                <Image
                  source={{
                    uri:
                      selectedTree.images?.[0] ||
                      "https://via.placeholder.com/600",
                  }}
                  style={styles.detailImage}
                />
                <TouchableOpacity
                  style={[
                    styles.closeDetailBtn,
                    { top: Math.max(insets.top, 20) },
                  ]}
                  onPress={() => setSelectedTree(null)}
                >
                  <X size={24} color="#fff" />
                </TouchableOpacity>
                <View style={styles.detailBadgeContainer}>
                  {selectedTree.category?.map((cat: string) => (
                    <View key={cat} style={styles.detailBadge}>
                      <Text style={styles.detailBadgeText}>{cat}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Thông tin */}
              <View style={styles.detailContent}>
                <Text style={styles.detailTitle}>
                  {selectedTree.commonName}
                </Text>
                <Text style={styles.detailScientific}>
                  {selectedTree.scientificName}
                </Text>

                {/* Grid đặc tính */}
                <View style={styles.propsGrid}>
                  <View style={styles.propBox}>
                    <TrendingUp size={18} color="#16a34a" />
                    <View style={styles.propTexts}>
                      <Text style={styles.propLabel}>
                        {t("encyclopedia.labelGrowthShort")}
                      </Text>
                      <Text style={styles.propVal}>
                        {selectedTree.growthRate || t("encyclopedia.valueUnknown")}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.propBox}>
                    <Sun size={18} color="#eab308" />
                    <View style={styles.propTexts}>
                      <Text style={styles.propLabel}>
                        {t("encyclopedia.labelLight")}
                      </Text>
                      <Text style={styles.propVal}>
                        {selectedTree.light || t("encyclopedia.valueUnknown")}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.propBox}>
                    <Droplet size={18} color="#3b82f6" />
                    <View style={styles.propTexts}>
                      <Text style={styles.propLabel}>
                        {t("encyclopedia.labelWater")}
                      </Text>
                      <Text style={styles.propVal}>
                        {selectedTree.water || t("encyclopedia.valueUnknown")}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.propBox}>
                    <Leaf size={18} color="#16a34a" />
                    <View style={styles.propTexts}>
                      <Text style={styles.propLabel}>
                        {t("encyclopedia.labelFamily")}
                      </Text>
                      <Text style={styles.propVal} numberOfLines={1}>
                        {selectedTree.family?.split(" ")[0] || t("encyclopedia.familyFallback")}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Các phần text mô tả */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>
                    {t("encyclopedia.labelDescription")}
                  </Text>
                  <Text style={styles.sectionText}>
                    {selectedTree.description || t("encyclopedia.valueUpdating")}
                  </Text>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>
                    {t("encyclopedia.labelUses")}
                  </Text>
                  <Text style={styles.sectionText}>
                    {selectedTree.uses || t("encyclopedia.valueUpdating")}
                  </Text>
                </View>

                <View style={[styles.section, styles.careSection]}>
                  <Text style={styles.sectionTitle}>
                    {t("encyclopedia.labelCare")}
                  </Text>
                  <Text style={styles.careText}>
                    {selectedTree.care || t("encyclopedia.valueUpdating")}
                  </Text>
                </View>

                {/* Các thông tin phụ & BỆNH THƯỜNG GẶP TỪ API */}
                {(selectedTree.height ||
                  selectedTree.soil ||
                  (selectedTree.diseasesInfo &&
                    selectedTree.diseasesInfo.length > 0)) && (
                  <View style={styles.extraInfoBox}>
                    {selectedTree.height && (
                      <Text style={styles.extraText}>
                        <Text style={styles.extraBold}>
                          {t("encyclopedia.labelHeightInline")}
                        </Text>
                        {selectedTree.height}
                      </Text>
                    )}
                    {selectedTree.soil && (
                      <Text style={styles.extraText}>
                        <Text style={styles.extraBold}>
                          {t("encyclopedia.labelSoilInline")}
                        </Text>
                        {selectedTree.soil}
                      </Text>
                    )}
                    {selectedTree.diseasesInfo &&
                      selectedTree.diseasesInfo.length > 0 && (
                        <Text style={styles.extraText}>
                          <Text style={styles.extraBold}>
                            {t("encyclopedia.labelDiseasesInline")}{" "}
                          </Text>
                          <Text style={{ color: "#dc2626" }}>
                            {selectedTree.diseasesInfo
                              .map((d: any) => d.name)
                              .join(", ")}
                          </Text>
                        </Text>
                      )}
                  </View>
                )}
              </View>
            </ScrollView>
          )}
        </View>
      </Modal>
    </View>
  );
}

// ==========================================
// STYLES
// ==========================================
