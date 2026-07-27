/**
 * LanguageSwitcher - Nút chuyển VI / EN cho app mobile.
 *
 * Bản song song với apps/web/src/components/common/LanguageSwitcher.tsx.
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LOCALES, LOCALE_LABELS, LOCALE_NAMES } from "@agri-scan/shared";
import { useI18n } from "../../context/I18nContext";

interface LanguageSwitcherProps {
  /** "compact" cho header, "full" hiện tên đầy đủ cho màn Cài đặt. */
  variant?: "compact" | "full";
}

export function LanguageSwitcher({ variant = "compact" }: LanguageSwitcherProps) {
  const { locale, setLocale } = useI18n();
  const isFull = variant === "full";

  return (
    <View style={styles.group}>
      {LOCALES.map((code) => {
        const isActive = code === locale;

        return (
          <TouchableOpacity
            key={code}
            onPress={() => setLocale(code)}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            style={[
              styles.button,
              isFull ? styles.buttonFull : styles.buttonCompact,
              isActive && styles.buttonActive,
            ]}
          >
            <Text
              style={[
                styles.label,
                isFull ? styles.labelFull : styles.labelCompact,
                isActive && styles.labelActive,
              ]}
            >
              {isFull ? LOCALE_NAMES[code] : LOCALE_LABELS[code]}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    padding: 2,
    borderRadius: 999,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignSelf: "flex-start",
  },
  button: {
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonCompact: { paddingHorizontal: 10, paddingVertical: 4 },
  buttonFull: { paddingHorizontal: 16, paddingVertical: 8 },
  buttonActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#0F172A",
    shadowOpacity: 0.06,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  label: { fontWeight: "700", color: "#64748B" },
  labelCompact: { fontSize: 11 },
  labelFull: { fontSize: 14 },
  labelActive: { color: "#10B981" },
});
