"use client";

import React from "react";
import { HeroSection } from "./HeroSection";
import { FeaturesSection } from "./FeaturesSection";

export function LandingPage() {
  return (
    <div className="pt-16">
      <HeroSection />
      <FeaturesSection />
    </div>
  );
}
