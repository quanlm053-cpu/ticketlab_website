"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { eventsApi } from "@/lib/api";
import { NavbarAuthenticated } from "@/components/navbar-authenticated";
import { Footer } from "@/components/footer";
import { ChevronLeft, MapPin, Calendar, Loader2 } from "lucide-react";

export default function BookingPage() {
  const { isAuthenticated, bookingCart, user } = useAuthStore();
  const router = useRouter();
  const params = useParams();
  const eventId = Number(params.id);
  const [event, setEvent] = useState<any>(null);
  const [fullName, setFullName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/dang-nhap");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!bookingCart || bookingCart.eventId !== eventId) {
      router.push(`/chi-tiet-su-kien/${eventId}`);
    }
  }, [bookingCart, eventId, router]);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await eventsApi.getById(eventId);
        setEvent(data.event);
      } catch (error) {
        console.error("Failed to fetch event:", error);
      }
    };
    if (eventId) fetchEvent();
  }, [eventId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      useAuthStore.setState({
        bookingCart: bookingCart
          ? {
              ...bookingCart,
            }
          : null,
      });
      router.push(`/thanh-toan`);
    }, 800);
  };

  if (!isAuthenticated || !event || !bookingCart) {
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
                Thông tin người mua
              </h1>

              <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-[#1a1a1a]">Họ và tên</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="mt-2 w-full rounded-lg border border-[#e0e0e0] bg-[#f5f5f5] px-4 py-3 text-[#1a1a1a] outline-none transition-colors focus:border-[#c8a96e] focus:bg-[#ffffff]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1a1a1a]">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-2 w-full rounded-lg border border-[#e0e0e0] bg-[#f5f5f5] px-4 py-3 text-[#1a1a1a] outline-none transition-colors focus:border-[#c8a96e] focus:bg-[#ffffff]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1a1a1a]">Số điện thoại</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="mt-2 w-full rounded-lg border border-[#e0e0e0] bg-[#f5f5f5] px-4 py-3 text-[#1a1a1a] outline-none transition-colors focus:border-[#c8a96e] focus:bg-[#ffffff]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-[#2d5f5d] py-3 text-base font-semibold text-[#ffffff] transition-colors hover:bg-[#245250] disabled:opacity-50"
                >
                  {loading ? "Đang xử lý..." : "Tiếp tục thanh toán"}
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
                <div className="mt-2 flex items-center gap-2 text-sm text-[#666666]">
                  <Calendar className="h-4 w-4" />
                  {event.event_date}
                </div>
                <div className="flex items-center gap-2 text-sm text-[#666666]">
                  <MapPin className="h-4 w-4" />
                  {event.location}
                </div>
              </div>

              <div className="rounded-lg bg-[#f5f5f5] p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-[#666666]">
                    {bookingCart.ticketType} x {bookingCart.quantity}
                  </span>
                  <span className="font-semibold text-[#1a1a1a]">
                    {bookingCart.totalPrice.toLocaleString("vi-VN")} đ
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <span className="text-[#666666]">Tổng cộng:</span>
              <span className="text-2xl font-bold text-[#2d5f5d]">
                {bookingCart.totalPrice.toLocaleString("vi-VN")} đ
              </span>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
