"use client";

import React from "react";
import { ShieldCheck, Sprout, Users } from "lucide-react";
import { FeatureCard } from "./FeatureCard";
import { useT } from "@/context/I18nContext";

export function FeaturesSection() {
  const t = useT();

  const features = [
    {
      key: "diagnosis",
      icon: <ShieldCheck size={32} />,
      title: t("landing.featureDiagnosisTitle"),
      description: t("landing.featureDiagnosisDesc"),
      color: "bg-blue-50 text-blue-600",
    },
    {
      key: "treatment",
      icon: <Sprout size={32} />,
      title: t("landing.featureTreatmentTitle"),
      description: t("landing.featureTreatmentDesc"),
      color: "bg-green-50 text-green-600",
    },
    {
      key: "community",
      icon: <Users size={32} />,
      title: t("landing.featureCommunityTitle"),
      description: t("landing.featureCommunityDesc"),
      color: "bg-orange-50 text-orange-600",
    },
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-primary font-semibold tracking-wide uppercase mb-2 text-sm sm:text-base">
            {t("landing.featuresEyebrow")}
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {t("landing.featuresTitle")}
          </h3>
          <p className="text-gray-600 text-base sm:text-lg">
            {t("landing.featuresSubtitle")}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature) => (
            <FeatureCard
              key={feature.key}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              color={feature.color}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
