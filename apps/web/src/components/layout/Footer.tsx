/**
 * Footer Component - Footer cho website
 */

import Link from "next/link";
import { APP_NAME, APP_VERSION } from "@agri-scan/shared";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">🌿</span>
              <span className="text-xl font-bold text-white">{APP_NAME}</span>
            </div>
            <p className="text-gray-400 mb-4">
              Bác sĩ cây trồng thông minh - Ứng dụng AI giúp chẩn đoán bệnh cây
              nhanh chóng và đề xuất phác đồ điều trị hiệu quả.
            </p>
            <p className="text-sm text-gray-500">Version {APP_VERSION}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Tính năng</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/scan"
                  className="hover:text-green-400 transition-colors"
                >
                  Chẩn đoán bằng AI
                </Link>
              </li>
              <li>
                <Link
                  href="/plants"
                  className="hover:text-green-400 transition-colors"
                >
                  Từ điển cây trồng
                </Link>
              </li>
              <li>
                <Link
                  href="/diseases"
                  className="hover:text-green-400 transition-colors"
                >
                  Từ điển bệnh lý
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Hỗ trợ</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="hover:text-green-400 transition-colors"
                >
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-green-400 transition-colors"
                >
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-green-400 transition-colors"
                >
                  Câu hỏi thường gặp
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
          <p>
            © {currentYear} {APP_NAME}. Website & AI Innovation Contest 2026 -
            HUTECH.
          </p>
        </div>
      </div>
    </footer>
  );
}
