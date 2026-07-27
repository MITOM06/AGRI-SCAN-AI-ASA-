"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  Search,
  ShoppingBag,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { orderApi } from "@agri-scan/shared";
import { IOrder, OrderStatus } from "@agri-scan/shared";
import { useT } from "@/context/I18nContext";

export function MyOrdersPage() {
  const t = useT();
  const router = useRouter();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<OrderStatus | "ALL">("ALL");

  const ORDER_STATUS = {
    PENDING: "PENDING",
    CONFIRMED: "CONFIRMED",
    SHIPPING: "SHIPPING",
    DELIVERED: "DELIVERED",
    CANCELLED: "CANCELLED",
  } as const;

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        // Thêm:
        const res = await orderApi.getMyOrders();
        const sortedData = res.data.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        setOrders(sortedData);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders =
    activeTab === "ALL"
      ? orders
      : orders.filter((order) => order.orderStatus === activeTab);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case ORDER_STATUS.PENDING:
        return (
          <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full flex items-center gap-1">
            <Clock size={12} /> {t("shop.statusPending")}
          </span>
        );
      case ORDER_STATUS.CONFIRMED:
        return (
          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full flex items-center gap-1">
            <CheckCircle2 size={12} /> {t("shop.statusConfirmed")}
          </span>
        );
      case ORDER_STATUS.SHIPPING:
        return (
          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full flex items-center gap-1">
            <Truck size={12} /> {t("shop.statusShipping")}
          </span>
        );
      case ORDER_STATUS.DELIVERED:
        return (
          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full flex items-center gap-1">
            <CheckCircle2 size={12} /> {t("shop.statusDelivered")}
          </span>
        );
      case ORDER_STATUS.CANCELLED:
        return (
          <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full flex items-center gap-1">
            <XCircle size={12} /> {t("shop.statusCancelled")}
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full flex items-center gap-1">
            <Package size={12} /> {status}
          </span>
        );
    }
  };

  // `id` là mã trạng thái so khớp với order.orderStatus — không dịch.
  const tabs = [
    { id: "ALL", label: t("common.all") },
    { id: ORDER_STATUS.PENDING, label: t("shop.statusPending") },
    { id: ORDER_STATUS.SHIPPING, label: t("shop.statusShipping") },
    { id: ORDER_STATUS.DELIVERED, label: t("shop.statusDelivered") },
    { id: ORDER_STATUS.CANCELLED, label: t("shop.statusCancelled") },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24 pt-16">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-2 text-sm text-gray-500">
          <span
            className="hover:text-primary cursor-pointer"
            onClick={() => router.push("/")}
          >
            {t("nav.home")}
          </span>
          <ChevronRight size={16} />
          <span
            className="hover:text-primary cursor-pointer"
            onClick={() => router.push("/shop")}
          >
            {t("shop.storeShort")}
          </span>
          <ChevronRight size={16} />
          <span className="font-medium text-gray-900">
            {t("shop.myOrders")}
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
            <ShoppingBag size={24} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t("shop.myOrders")}
          </h1>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 mb-6 overflow-x-auto hide-scrollbar">
          <div className="flex gap-2 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  activeTab === tab.id
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 border-dashed">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {t("shop.noOrders")}
            </h3>
            <p className="text-gray-500 mb-6">{t("shop.noOrdersDesc")}</p>
            <button
              onClick={() => router.push("/shop")}
              className="px-6 py-2 bg-primary text-white rounded-full font-medium"
            >
              {t("shop.continueShopping")}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={order._id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                {/* Order Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4 bg-gray-50/50">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-0.5">
                        {t("shop.orderCode")}
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        #{order._id?.substring(0, 8).toUpperCase()}
                      </p>
                    </div>
                    <div className="w-px h-8 bg-gray-200 hidden sm:block"></div>
                    <div className="hidden sm:block">
                      <p className="text-xs text-gray-500 font-medium mb-0.5">
                        {t("shop.orderDate")}
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString(
                              "vi-VN",
                            )
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                  <div>{getStatusBadge(order.orderStatus)}</div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                          <img
                            src={typeof item.productId === 'object' ? item.productId.images?.[0] : `https://picsum.photos/seed/${item.productId}/200/200`}
                            alt="Product"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-base font-medium text-gray-900 line-clamp-2 mb-1">
                            {typeof item.productId === 'object'
                              ? item.productId.name
                              : t("shop.productFallback", {
                                  id: String(item.productId).substring(0, 6),
                                })}
                          </h4>
                          <p className="text-sm text-gray-500 mb-2">
                            {t("shop.variantDefault")}
                          </p>
                          <div className="flex justify-between items-center">
                            <p className="text-sm font-medium text-gray-900">
                              x{item.quantity}
                            </p>
                            <p className="text-sm font-bold text-red-500">
                              {item.priceAtPurchase.toLocaleString("vi-VN")}đ
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Footer */}
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex flex-wrap justify-between items-center gap-4">
                  <div className="text-sm text-gray-600">
                    {t("shop.itemCount", { count: order.items.length })}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-gray-500 font-medium mb-0.5">
                        {t("shop.totalAmount")}
                      </p>
                      <p className="text-lg font-bold text-red-500 leading-none">
                        {order.totalAmount.toLocaleString("vi-VN")}đ
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {order.orderStatus === ORDER_STATUS.DELIVERED && (
                        <button className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90 transition-colors">
                          {t("shop.buyAgain")}
                        </button>
                      )}
                      <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-50 transition-colors">
                        {t("shop.details")}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
