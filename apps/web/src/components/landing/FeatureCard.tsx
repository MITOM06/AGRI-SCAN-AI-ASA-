"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@agri-scan/shared";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

export function FeatureCard({
  icon,
  title,
  description,
  color,
}: FeatureCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="p-8 rounded-3xl border border-gray-100 bg-white shadow-sm hover:shadow-xl transition-all"
    >
      <div
        className={cn(
          "w-16 h-16 rounded-2xl flex items-center justify-center mb-6",
          color,
        )}
      >
        {icon}
      </div>
      <h4 className="text-xl font-bold text-gray-900 mb-3">{title}</h4>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </motion.div>
  );
}
