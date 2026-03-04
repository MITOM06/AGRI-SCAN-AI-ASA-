import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Bell } from "lucide-react-native";

export const Header = ({ name }: { name: string }) => (
  <View style={styles.container}>
    <View style={styles.userRow}>
      <Image
        source={{
          uri:
            "https://ui-avatars.com/api/?name=" +
            name +
            "&background=16a34a&color=fff",
        }}
        style={styles.avatar}
      />
      <View>
        <Text style={styles.welcome}>Chào mừng trở lại,</Text>
        <Text style={styles.name}>{name}</Text>
      </View>
    </View>
    <TouchableOpacity style={styles.iconBtn}>
      <Bell size={22} color="#374151" />
      <View style={styles.dot} />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  userRow: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 42, height: 42, borderRadius: 21, marginRight: 12 },
  welcome: { fontSize: 12, color: "#6b7280" },
  name: { fontSize: 16, fontWeight: "bold", color: "#111827" },
  iconBtn: {
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },
  dot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    backgroundColor: "#ef4444",
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#fff",
  },
});
