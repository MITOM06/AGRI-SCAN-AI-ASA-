"use client";

import React from "react";
import {
  Shield,
  Lock,
  Eye,
  Database,
  UserCheck,
  AlertTriangle,
} from "lucide-react";
import { motion } from "framer-motion";
import { useT } from "@/context/I18nContext";

export default function PrivacyPage() {
  const t = useT();

  // Mỗi mục = 1 icon + 1 tiêu đề + hoặc danh sách gạch đầu dòng, hoặc 1 đoạn văn.
  // Gom lại thành dữ liệu để phần JSX không phải lặp 5 lần cùng một khối.
  const sections: {
    icon: React.ReactNode;
    titleKey: string;
    itemKeys?: string[];
    bodyKey?: string;
  }[] = [
    {
      icon: <Database className="w-6 h-6 text-primary" />,
      titleKey: "privacy.s1Title",
      itemKeys: [
        "privacy.s1Item1",
        "privacy.s1Item2",
        "privacy.s1Item3",
        "privacy.s1Item4",
      ],
    },
    {
      icon: <Eye className="w-6 h-6 text-primary" />,
      titleKey: "privacy.s2Title",
      itemKeys: [
        "privacy.s2Item1",
        "privacy.s2Item2",
        "privacy.s2Item3",
        "privacy.s2Item4",
      ],
    },
    {
      icon: <Lock className="w-6 h-6 text-primary" />,
      titleKey: "privacy.s3Title",
      bodyKey: "privacy.s3Body",
    },
    {
      icon: <UserCheck className="w-6 h-6 text-primary" />,
      titleKey: "privacy.s4Title",
      itemKeys: ["privacy.s4Item1", "privacy.s4Item2", "privacy.s4Item3"],
    },
    {
      icon: <AlertTriangle className="w-6 h-6 text-primary" />,
      titleKey: "privacy.s5Title",
      bodyKey: "privacy.s5Body",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="bg-primary/5 px-8 py-12 border-b border-primary/10 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
            {t("privacy.title")}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {t("privacy.intro")}
          </p>
          <p className="text-sm text-gray-400 mt-4">
            {t("privacy.lastUpdated")}
          </p>
        </div>

        <div className="p-8 md:p-12 space-y-10">
          {sections.map((section) => (
            <section key={section.titleKey}>
              <div className="flex items-center gap-3 mb-4">
                {section.icon}
                <h2 className="text-2xl font-bold text-gray-900">
                  {t(section.titleKey)}
                </h2>
              </div>
              <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed">
                {section.itemKeys ? (
                  <ul className="list-disc pl-5 space-y-2">
                    {section.itemKeys.map((key) => (
                      <li key={key}>{t(key)}</li>
                    ))}
                  </ul>
                ) : (
                  <p>{t(section.bodyKey!)}</p>
                )}
              </div>
            </section>
          ))}

          <div className="mt-12 p-6 bg-gray-50 rounded-2xl border border-gray-100 text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {t("privacy.ctaTitle")}
            </h3>
            <p className="text-gray-600 mb-4">{t("privacy.ctaDesc")}</p>
            <a
              href="/feedback"
              className="inline-flex items-center justify-center px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
            >
              {t("privacy.ctaButton")}
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
