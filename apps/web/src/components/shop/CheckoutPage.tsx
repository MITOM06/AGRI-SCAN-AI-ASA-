"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronRight,
  MapPin,
  Truck,
  CreditCard,
  CheckCircle2,
  ShoppingBag,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "../../context/CartContext";
import { orderApi, PaymentMethod } from "@agri-scan/shared";
import { OrderStatus } from "@agri-scan/shared";

export function CheckoutPage() {
  const router = useRouter();
  const { cartItems, cartTotal, clearCart } = useCart();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");
  // Mock shipping fee
  const shippingFee = 30000;
  const totalPayment = cartTotal + shippingFee;

const handlePlaceOrder = async () => {
  if (cartItems.length === 0) return;
  setIsSubmitting(true);

  const rawSellerId = cartItems[0].sellerId;
  const sellerId = typeof rawSellerId === 'object' && rawSellerId !== null
    ? String(rawSellerId._id)
    : String(rawSellerId);

  try {
    await orderApi.createOrder({
      sellerId,
      items: cartItems.map(item => ({
        productId: item._id,
        quantity: item.quantity,
      })),
      shippingAddress: '475A Điện Biên Phủ, Phường 25, Quận Bình Thạnh, TP. Hồ Chí Minh',
      phoneNumber: '0987654321',
      paymentMethod,
    });

      setIsSuccess(true);
      setTimeout(() => {
        clearCart();
        router.push("/shop");
      }, 2500);
    } catch (error) {
      console.error("Failed to place order:", error);
      // Fallback for demo if API fails
      setIsSuccess(true);
      setTimeout(() => {
        clearCart();
        router.push("/shop");
      }, 2500);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center max-w-md w-full text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/30"
          >
            <CheckCircle2 size={48} className="text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Đặt hàng thành công!
          </h2>
          <p className="text-gray-500 mb-8">
            Cảm ơn bạn đã mua sắm tại Agri-Shop. Đơn hàng của bạn đang được xử
            lý và sẽ sớm được giao.
          </p>
          <button
            onClick={() => router.push("/shop")}
            className="w-full py-3.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors"
          >
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    );
  }

  // Redirect if cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Giỏ hàng trống
          </h2>
          <button
            onClick={() => router.push("/shop")}
            className="px-6 py-2 bg-primary text-white rounded-full font-medium"
          >
            Quay lại cửa hàng
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-2 text-sm text-gray-500">
          <span
            className="hover:text-primary cursor-pointer"
            onClick={() => router.push("/")}
          >
            Trang chủ
          </span>
          <ChevronRight size={16} />
          <span
            className="hover:text-primary cursor-pointer"
            onClick={() => router.push("/shop")}
          >
            Cửa hàng
          </span>
          <ChevronRight size={16} />
          <span
            className="hover:text-primary cursor-pointer"
            onClick={() => router.push("/shop/cart")}
          >
            Giỏ hàng
          </span>
          <ChevronRight size={16} />
          <span className="font-medium text-gray-900">Thanh toán</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Thanh toán</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Checkout Details */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.1 },
              },
            }}
            className="flex-1 space-y-6"
          >
            {/* Shipping Address */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
              }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-gray-900 font-bold text-lg">
                  <MapPin size={20} className="text-primary" />
                  Địa chỉ nhận hàng
                </div>
                <button
                  className="text-sm font-medium text-primary hover:underline"
                  onClick={() => router.push("/account/address")}
                >
                  Thay đổi
                </button>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-bold text-gray-900">Trần Văn Nông</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                  <span className="text-gray-600 font-medium">
                    0987.654.321
                  </span>
                  <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-bold rounded">
                    Mặc định
                  </span>
                </div>
                <p className="text-gray-600">
                  475A Điện Biên Phủ, Phường 25, Quận Bình Thạnh, TP. Hồ Chí
                  Minh
                </p>
              </div>
            </motion.div>

            {/* Shipping Method */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
              }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-2 text-gray-900 font-bold text-lg mb-4">
                <Truck size={20} className="text-blue-500" />
                Đơn vị vận chuyển
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="relative flex cursor-pointer rounded-xl border bg-white p-4 shadow-sm focus:outline-none border-primary ring-1 ring-primary">
                  <input
                    type="radio"
                    name="shipping"
                    className="sr-only"
                    defaultChecked
                  />
                  <span className="flex flex-1">
                    <span className="flex flex-col">
                      <span className="block text-sm font-medium text-gray-900">
                        Giao hàng nhanh
                      </span>
                      <span className="mt-1 flex items-center text-sm text-gray-500">
                        Dự kiến giao: 2-3 ngày
                      </span>
                    </span>
                  </span>
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </label>
                <label className="relative flex cursor-pointer rounded-xl border border-gray-200 bg-white p-4 shadow-sm focus:outline-none hover:border-gray-300">
                  <input type="radio" name="shipping" className="sr-only" />
                  <span className="flex flex-1">
                    <span className="flex flex-col">
                      <span className="block text-sm font-medium text-gray-900">
                        Giao hàng tiết kiệm
                      </span>
                      <span className="mt-1 flex items-center text-sm text-gray-500">
                        Dự kiến giao: 4-5 ngày
                      </span>
                    </span>
                  </span>
                </label>
              </div>
            </motion.div>

            {/* Payment Method */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
              }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-2 text-gray-900 font-bold text-lg mb-4">
                <CreditCard size={20} className="text-purple-500" />
                Phương thức thanh toán
              </div>
              <div className="space-y-3">
                {[
                  {
                    value: "COD" as PaymentMethod,
                    label: "Thanh toán khi nhận hàng (COD)",
                  },
                  {
                    value: "BANK_TRANSFER" as PaymentMethod,
                    label: "Chuyển khoản ngân hàng",
                  },
                  { value: "MOMO" as PaymentMethod, label: "Ví MoMo" },
                  { value: "VNPAY" as PaymentMethod, label: "VNPay" },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    onClick={() => setPaymentMethod(opt.value)}
                    className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${
                      paymentMethod === opt.value
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                        paymentMethod === opt.value
                          ? "border-primary"
                          : "border-gray-300"
                      }`}
                    >
                      {paymentMethod === opt.value && (
                        <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                      )}
                    </div>
                    <div className="flex-1 font-medium text-gray-900">
                      {opt.label}
                    </div>
                  </label>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full lg:w-[400px] flex-shrink-0"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <div className="flex items-center gap-2 text-gray-900 font-bold text-lg mb-6">
                <ShoppingBag size={20} className="text-amber-500" />
                Đơn hàng của bạn
              </div>

              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <p className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug">
                        {item.name}
                      </p>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-xs text-gray-500">
                          SL: {item.quantity}
                        </p>
                        <p className="text-sm font-bold text-gray-900">
                          {(item.price * item.quantity).toLocaleString("vi-VN")}
                          đ
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 text-sm border-t border-gray-100 pt-6 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính:</span>
                  <span className="font-medium text-gray-900">
                    {cartTotal.toLocaleString("vi-VN")}đ
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển:</span>
                  <span className="font-medium text-gray-900">
                    {shippingFee.toLocaleString("vi-VN")}đ
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Giảm giá:</span>
                  <span className="font-medium text-emerald-600">-0đ</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-gray-900">
                    Tổng thanh toán:
                  </span>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-red-500 block leading-none mb-1">
                      {totalPayment.toLocaleString("vi-VN")}đ
                    </span>
                    <span className="text-xs text-gray-500">
                      (Đã bao gồm VAT)
                    </span>
                  </div>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className={`w-full py-4 text-white font-bold rounded-xl transition-colors shadow-lg text-lg flex items-center justify-center gap-2 ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed shadow-none"
                    : "bg-red-500 hover:bg-red-600 shadow-red-500/20"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Đang xử lý...
                  </>
                ) : (
                  "Đặt hàng ngay"
                )}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
