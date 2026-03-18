"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { eventsApi, ordersApi } from "@/lib/api";
import { NavbarAuthenticated } from "@/components/navbar-authenticated";
import { Footer } from "@/components/footer";
import { ChevronLeft, CreditCard, AlertCircle } from "lucide-react";

export default function PaymentPage() {
  const { isAuthenticated, bookingCart } = useAuthStore();
  const router = useRouter();
  const [event, setEvent] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/dang-nhap");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!bookingCart && !isProcessing) {
      router.push("/trang-chu");
    }
  }, [bookingCart, router, isProcessing]);

  useEffect(() => {
    const fetchEvent = async () => {
      if (bookingCart) {
        try {
          const data = await eventsApi.getById(bookingCart.eventId);
          setEvent(data.event);
        } catch (error) {
          console.error("Failed to fetch event:", error);
        }
      }
    };
    fetchEvent();
  }, [bookingCart]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setIsProcessing(true);

    try {
      if (bookingCart && event) {
        const orderData = {
          event_id: bookingCart.eventId,
          ticket_type_name: bookingCart.ticketType,
          quantity: bookingCart.quantity,
          total_price: bookingCart.totalPrice,
          payment_method: paymentMethod,
        };

        const result = await ordersApi.create(orderData);

        const completedOrder = {
          orderId: result.order?.order_id ? String(result.order.order_id) : `TL${Math.floor(100000 + Math.random() * 900000)}`,
          eventId: String(bookingCart.eventId),
          eventName: event.name,
          eventImage: event.image || "",
          ticketType: bookingCart.ticketType,
          quantity: bookingCart.quantity,
          totalPrice: bookingCart.totalPrice,
          date: event.event_date || "",
          location: event.location || "",
          venue: event.location || "",
          address: event.location || "",
          startTime: "",
        };
        useAuthStore.getState().completeOrder(completedOrder);
      }

      router.push("/xac-nhan-thanh-toan");
    } catch (error) {
      console.error('Payment error:', error);
      alert('Thanh toán thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || (!bookingCart && !isProcessing) || !event) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      <NavbarAuthenticated />

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-[#2d5f5d] transition-colors hover:text-[#c8a96e]"
        >
          <ChevronLeft className="h-5 w-5" />
          Quay lại
        </button>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-lg bg-[#ffffff] p-6 border border-[#e0e0e0]">
              <h1 className="text-2xl font-bold text-[#1a1a1a]">
                Phương thức thanh toán
              </h1>

              <div className="mt-6 flex gap-3 rounded-lg bg-yellow-50 p-4 border border-yellow-200">
                <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0" />
                <p className="text-sm text-yellow-800">
                  Đây là mô phỏng thanh toán. Sử dụng số thẻ 4111 1111 1111 1111 để test.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div className="space-y-3">
                  <div
                    onClick={() => setPaymentMethod("credit-card")}
                    className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                      paymentMethod === "credit-card"
                        ? "border-[#2d5f5d] bg-[#f5f5f5]"
                        : "border-[#e0e0e0] hover:border-[#c8a96e]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5" />
                      <span className="font-semibold text-[#1a1a1a]">Thẻ tín dụng / Ghi nợ</span>
                    </div>
                  </div>

                  <div
                    onClick={() => setPaymentMethod("bank-transfer")}
                    className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                      paymentMethod === "bank-transfer"
                        ? "border-[#2d5f5d] bg-[#f5f5f5]"
                        : "border-[#e0e0e0] hover:border-[#c8a96e]"
                    }`}
                  >
                    <span className="font-semibold text-[#1a1a1a]">Chuyển khoản ngân hàng</span>
                  </div>

                  <div
                    onClick={() => setPaymentMethod("ewallet")}
                    className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                      paymentMethod === "ewallet"
                        ? "border-[#2d5f5d] bg-[#f5f5f5]"
                        : "border-[#e0e0e0] hover:border-[#c8a96e]"
                    }`}
                  >
                    <span className="font-semibold text-[#1a1a1a]">Ví điện tử (Momo, ZaloPay)</span>
                  </div>
                </div>

                {paymentMethod === "credit-card" && (
                  <div className="space-y-4 border-t border-[#e0e0e0] pt-6">
                    <div>
                      <label className="block text-sm font-semibold text-[#1a1a1a]">Số thẻ</label>
                      <input
                        type="text"
                        placeholder="4111 1111 1111 1111"
                        maxLength={19}
                        value={formData.cardNumber}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\s+/g, "");
                          value = value.replace(/(\d{4})(?=\d)/g, "$1 ").slice(0, 19);
                          setFormData({ ...formData, cardNumber: value });
                        }}
                        required
                        className="mt-2 w-full rounded-lg border border-[#e0e0e0] bg-[#f5f5f5] px-4 py-3 text-[#1a1a1a] outline-none transition-colors focus:border-[#c8a96e] focus:bg-[#ffffff]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#1a1a1a]">Chủ thẻ</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={formData.cardHolder}
                        onChange={(e) => setFormData({ ...formData, cardHolder: e.target.value })}
                        required
                        className="mt-2 w-full rounded-lg border border-[#e0e0e0] bg-[#f5f5f5] px-4 py-3 text-[#1a1a1a] outline-none transition-colors focus:border-[#c8a96e] focus:bg-[#ffffff]"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-sm font-semibold text-[#1a1a1a]">Tháng</label>
                        <select
                          value={formData.expiryMonth}
                          onChange={(e) => setFormData({ ...formData, expiryMonth: e.target.value })}
                          required
                          className="mt-2 w-full rounded-lg border border-[#e0e0e0] bg-[#f5f5f5] px-3 py-3 text-[#1a1a1a] outline-none transition-colors focus:border-[#c8a96e] focus:bg-[#ffffff]"
                        >
                          <option value="">Chọn</option>
                          {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={String(i + 1)}>
                              {String(i + 1).padStart(2, "0")}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-[#1a1a1a]">Năm</label>
                        <select
                          value={formData.expiryYear}
                          onChange={(e) => setFormData({ ...formData, expiryYear: e.target.value })}
                          required
                          className="mt-2 w-full rounded-lg border border-[#e0e0e0] bg-[#f5f5f5] px-3 py-3 text-[#1a1a1a] outline-none transition-colors focus:border-[#c8a96e] focus:bg-[#ffffff]"
                        >
                          <option value="">Chọn</option>
                          {Array.from({ length: 10 }, (_, i) => {
                            const year = new Date().getFullYear() + i;
                            return (
                              <option key={year} value={String(year)}>{year}</option>
                            );
                          })}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-[#1a1a1a]">CVV</label>
                        <input
                          type="text"
                          placeholder="123"
                          maxLength={3}
                          value={formData.cvv}
                          onChange={(e) => setFormData({ ...formData, cvv: e.target.value.replace(/\D/g, "") })}
                          required
                          className="mt-2 w-full rounded-lg border border-[#e0e0e0] bg-[#f5f5f5] px-3 py-3 text-[#1a1a1a] outline-none transition-colors focus:border-[#c8a96e] focus:bg-[#ffffff]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-[#2d5f5d] py-3 text-base font-semibold text-[#ffffff] transition-colors hover:bg-[#245250] disabled:opacity-50"
                >
                  {loading
                    ? "Đang xử lý thanh toán..."
                    : `Thanh toán ${bookingCart?.totalPrice?.toLocaleString("vi-VN") ?? ""} đ`}
                </button>
              </form>
            </div>
          </div>

          {/* Order summary */}
          <div className="h-fit rounded-lg bg-[#ffffff] p-6 border border-[#e0e0e0] sticky top-20">
            <h2 className="text-lg font-bold text-[#1a1a1a]">Tóm tắt đơn hàng</h2>

            <div className="mt-6 space-y-4 border-b border-[#e0e0e0] pb-6">
              <div>
                <p className="font-semibold text-[#1a1a1a]">{event.name}</p>
                <p className="mt-2 text-sm text-[#666666]">{event.event_date}</p>
              </div>

              <div className="rounded-lg bg-[#f5f5f5] p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#666666]">{bookingCart?.ticketType}</span>
                  <span className="font-semibold text-[#1a1a1a]">x {bookingCart?.quantity}</span>
                </div>
                <div className="border-t border-[#e0e0e0] pt-2 flex justify-between">
                  <span className="text-[#666666]">Giá</span>
                  <span className="font-semibold text-[#1a1a1a]">
                    {bookingCart?.totalPrice?.toLocaleString("vi-VN")} đ
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-between items-center">
              <span className="font-semibold text-[#1a1a1a]">Tổng cộng:</span>
              <span className="text-2xl font-bold text-[#2d5f5d]">
                {bookingCart?.totalPrice?.toLocaleString("vi-VN")} đ
              </span>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
