"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Sprout, Activity, Users } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@agri-scan/shared";

export function LandingPage() {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-bg-soft min-h-[90vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-green-100/50 to-transparent transform skew-x-12 translate-x-20" />
          <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-tr from-yellow-100/30 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-green-100 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-medium text-gray-600">
                  AI Innovation Contest 2026
                </span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-[1.1] tracking-tight">
                Bác Sĩ <br />
                <span className="text-primary">Cây Trồng</span> <br />
                Thông Minh
              </h1>

              <p className="text-xl text-gray-600 max-w-lg leading-relaxed">
                Chẩn đoán bệnh cây trồng tức thì bằng AI. Nhận phác đồ điều trị
                khoa học và lộ trình chăm sóc bền vững chỉ với một lần quét.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/scanner"
                  className="px-8 py-4 bg-primary text-white rounded-full font-semibold text-lg hover:bg-primary-dark transition-all shadow-lg shadow-primary/30 flex items-center gap-2 group"
                >
                  Chẩn đoán ngay
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <button className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-full font-semibold text-lg hover:bg-gray-50 transition-all">
                  Tìm hiểu thêm
                </button>
              </div>

              <div className="flex items-center gap-8 pt-8 border-t border-gray-200/50">
                <div>
                  <p className="text-3xl font-bold text-gray-900">98%</p>
                  <p className="text-sm text-gray-500">Độ chính xác</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">2s</p>
                  <p className="text-sm text-gray-500">Thời gian xử lý</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">500+</p>
                  <p className="text-sm text-gray-500">Loại bệnh</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
                <img
                  src="https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="Farmer using technology"
                  className="w-full h-auto object-cover"
                />

                {/* Floating Card 1 */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="absolute top-8 right-8 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg max-w-[200px]"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-green-100 rounded-lg text-green-600">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Trạng thái</p>
                      <p className="font-bold text-gray-900">Đã bảo vệ</p>
                    </div>
                  </div>
                </motion.div>

                {/* Floating Card 2 */}
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                      <Activity size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        Phân tích AI
                      </p>
                      <p className="text-xs text-gray-500">
                        Đang xử lý dữ liệu...
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-primary font-semibold tracking-wide uppercase mb-2">
              Giải Pháp Toàn Diện
            </h2>
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              Công nghệ tiên phong cho nông nghiệp bền vững
            </h3>
            <p className="text-gray-600 text-lg">
              Hệ thống tích hợp đa tính năng giúp bạn quản lý vườn cây một cách
              khoa học và hiệu quả nhất.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <ShieldCheck size={32} />,
                title: "AI Diagnosis",
                desc: "Nhận diện bệnh cây qua ảnh chụp tức thời với độ chính xác cao nhờ mô hình Computer Vision tiên tiến.",
                color: "bg-blue-50 text-blue-600",
              },
              {
                icon: <Sprout size={32} />,
                title: "Smart Treatment",
                desc: "Đưa ra phác đồ điều trị chi tiết, ưu tiên các giải pháp sinh học và thân thiện với môi trường.",
                color: "bg-green-50 text-green-600",
              },
              {
                icon: <Users size={32} />,
                title: "Community Knowledge",
                desc: "Thư viện mở về kỹ thuật canh tác và cộng đồng chuyên gia hỗ trợ giải đáp thắc mắc.",
                color: "bg-orange-50 text-orange-600",
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="p-8 rounded-3xl border border-gray-100 bg-white shadow-sm hover:shadow-xl transition-all"
              >
                <div
                  className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center mb-6",
                    feature.color,
                  )}
                >
                  {feature.icon}
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h4>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
