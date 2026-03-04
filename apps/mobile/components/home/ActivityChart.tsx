import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";

export const ActivityChart = () => {
  const screenWidth = Dimensions.get("window").width;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hoạt động quét 7 ngày qua</Text>
      <LineChart
        data={{
          labels: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
          datasets: [{ data: [20, 45, 28, 80, 99, 43, 50] }],
        }}
        width={screenWidth - 40}
        height={200}
        chartConfig={{
          backgroundColor: "#fff",
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(22, 163, 74, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
          style: { borderRadius: 16 },
          propsForDots: { r: "4", strokeWidth: "2", stroke: "#16a34a" },
        }}
        bezier
        style={styles.chart}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, marginVertical: 10 },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 10,
  },
  chart: { borderRadius: 16, paddingRight: 40 },
});
