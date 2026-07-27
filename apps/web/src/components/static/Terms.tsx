"use client";

import React from "react";
import {
  FileText,
  Cpu,
  AlertOctagon,
  CreditCard,
  Copyright,
  XCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { useT } from "@/context/I18nContext";

export default function TermsPage() {
  const t = useT();

  // Mỗi mục: icon + tiêu đề + (đoạn dẫn) + (danh sách gạch đầu dòng) hoặc các đoạn văn
  const sections: {
    icon: React.ReactNode;
    titleKey: string;
    leadKey?: string;
    itemKeys?: string[];
    bodyKeys?: string[];
  }[] = [
    {
      icon: <Cpu className="w-6 h-6 text-primary" />,
      titleKey: "terms.s1Title",
      leadKey: "terms.s1Body",
      itemKeys: ["terms.s1Item1", "terms.s1Item2"],
    },
    {
      icon: <AlertOctagon className="w-6 h-6 text-primary" />,
      titleKey: "terms.s2Title",
      leadKey: "terms.s2Body",
      itemKeys: ["terms.s2Item1", "terms.s2Item2"],
    },
    {
      icon: <CreditCard className="w-6 h-6 text-primary" />,
      titleKey: "terms.s3Title",
      leadKey: "terms.s3Body",
      itemKeys: ["terms.s3Item1", "terms.s3Item2", "terms.s3Item3"],
    },
    {
      icon: <Copyright className="w-6 h-6 text-primary" />,
      titleKey: "terms.s4Title",
      bodyKeys: ["terms.s4Body1", "terms.s4Body2"],
    },
    {
      icon: <XCircle className="w-6 h-6 text-primary" />,
      titleKey: "terms.s5Title",
      bodyKeys: ["terms.s5Body"],
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
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            {t("terms.title")}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("terms.intro")}
          </p>
          <div className="mt-6 text-sm text-gray-500 font-medium">
            {t("terms.effectiveFrom")}
          </div>
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
              <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed space-y-4">
                {section.leadKey && <p>{t(section.leadKey)}</p>}

                {section.itemKeys && (
                  <ul className="list-disc pl-5 space-y-2">
                    {section.itemKeys.map((key) => (
                      <li key={key}>{t(key)}</li>
                    ))}
                  </ul>
                )}

                {section.bodyKeys?.map((key) => <p key={key}>{t(key)}</p>)}
              </div>
            </section>
          ))}

          <div className="mt-12 p-6 bg-gray-50 rounded-2xl border border-gray-100 text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {t("terms.ctaTitle")}
            </h3>
            <p className="text-gray-600 mb-4">{t("terms.ctaDesc")}</p>
            <a
              href="/feedback"
              className="inline-flex items-center justify-center px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
            >
              {t("terms.ctaButton")}
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
