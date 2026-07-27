import React from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Search } from "lucide-react-native";

import { styles } from "../../styles/admin.styles";
import { useT } from "../../context/I18nContext";

interface UsersTabProps {
  loading: boolean;
  refreshing: boolean;
  users: any[];
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  onSearch: () => void;
}

export function UsersTab({
  loading,
  refreshing,
  users,
  searchQuery,
  onSearchQueryChange,
  onSearch,
}: UsersTabProps) {
  const t = useT();

  return (
    <View style={styles.tabContent}>
      <View style={styles.searchBar}>
        <Search size={20} color="#94a3b8" />
        <TextInput
          style={styles.searchInput}
          placeholder={t("admin.mSearchPlaceholder")}
          value={searchQuery}
          onChangeText={onSearchQueryChange}
        />
        <TouchableOpacity style={styles.searchBtn} onPress={onSearch}>
          <Text style={styles.searchBtnText}>{t("common.search")}</Text>
        </TouchableOpacity>
      </View>

      {loading && !refreshing ? (
        <ActivityIndicator
          size="large"
          color="#16a34a"
          style={{ marginTop: 50 }}
        />
      ) : (
        users.map((user, idx) => (
          <View key={idx} style={styles.userCard}>
            <View style={styles.userHeader}>
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
                </Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName} numberOfLines={1}>
                  {user.fullName || t("admin.mNoNameYet")}
                </Text>
                <Text style={styles.userEmail} numberOfLines={1}>
                  {user.email}
                </Text>
              </View>
            </View>

            <View style={styles.userTags}>
              <View style={styles.tagRole}>
                <Text style={styles.tagRoleText}>{user.role}</Text>
              </View>
              <View
                style={[
                  styles.tagPlan,
                  user.plan === "VIP"
                    ? { backgroundColor: "#fef3c7" }
                    : user.plan === "PREMIUM"
                      ? { backgroundColor: "#dcfce3" }
                      : {},
                ]}
              >
                <Text
                  style={[
                    styles.tagPlanText,
                    user.plan === "VIP"
                      ? { color: "#d97706" }
                      : user.plan === "PREMIUM"
                        ? { color: "#16a34a" }
                        : {},
                  ]}
                >
                  {user.plan}
                </Text>
              </View>
              <Text style={styles.userDate}>
                {new Date(user.createdAt).toLocaleDateString("vi-VN")}
              </Text>
            </View>
          </View>
        ))
      )}
    </View>
  );
}
