"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { NavbarAuthenticated } from "@/components/navbar-authenticated";
import { Footer } from "@/components/footer";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle } from "lucide-react";

export default function PaymentConfirmationPage() {
  const { isAuthenticated, lastCompletedOrder } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/dang-nhap");
      return;
    }
    if (!lastCompletedOrder) {
      router.push("/trang-chu");
    }
  }, [isAuthenticated, lastCompletedOrder, router]);

  if (!isAuthenticated || !lastCompletedOrder) {
    return null;
  }

  const order = lastCompletedOrder;

  return (
    <main className="min-h-screen bg-[#f0f0f0]">
      <NavbarAuthenticated />

      <div className="mx-auto max-w-2xl px-4 py-10 lg:px-8">
        {/* Banner heading */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold italic text-[#2d5f5d] lg:text-4xl">
            Thanh toán thành công!
          </h1>
        </div>

        {/* Card */}
        <div className="overflow-hidden rounded-2xl bg-[#ffffff] shadow-sm">
          {/* Event banner image */}
          {order?.eventImage && (
            <div className="relative h-48 w-full">
              <Image
                src={order.eventImage}
                alt={order.eventName}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/30 to-transparent" />
            </div>
          )}

          <div className="px-6 py-8 lg:px-10">
            {/* Success icon */}
            <div className="flex justify-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>

            {/* Success heading */}
            <h2 className="mt-4 text-center text-2xl font-bold text-[#1a1a1a] lg:text-3xl">
              Đặt vé thành công!
            </h2>
            <p className="mt-2 text-center text-sm text-[#666666]">
              Cảm ơn bạn đã đặt vé. Vui lòng hoàn tất thanh toán để nhận vé.
            </p>

            {/* Divider */}
            <div className="my-6 border-t border-[#e0e0e0]" />

            {/* Order info */}
            <div>
              <h3 className="text-base font-bold text-[#1a1a1a]">
                Thông tin đơn hàng
              </h3>
              <div className="mt-4 space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#666666]">
                    Mã đơn hàng:
                  </span>
                  <span className="font-semibold text-[#1a1a1a]">
                    #{order?.orderId || "TL000000"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666666]">
                    Sự kiện:
                  </span>
                  <span className="font-semibold text-[#1a1a1a]">
                    {order?.eventName || "---"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666666]">
                    Thời gian:
                  </span>
                  <span className="font-semibold text-[#1a1a1a]">
                    {order ? `${order.startTime} - ${order.date}` : "---"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666666]">
                    Loại vé:
                  </span>
                  <span className="font-semibold text-[#1a1a1a]">
                    {order
                      ? `${order.ticketType} (x${order.quantity})`
                      : "---"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666666]">
                    Tổng tiền:
                  </span>
                  <span className="font-bold text-[#c0392b]">
                    {order
                      ? `${order.totalPrice.toLocaleString("vi-VN")}đ`
                      : "---"}
                  </span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="my-6 border-t border-[#e0e0e0]" />

            {/* Payment instructions */}
            <div>
              <h3 className="text-base font-bold text-[#1a1a1a]">
                Hướng dẫn thanh toán
              </h3>
              <div className="mt-4 space-y-2.5 text-sm">
                <div>
                  <span className="font-semibold text-[#1a1a1a]">
                    Phương thức: 
                  </span>
                  <span className="text-[#666666]">
                    Thanh toán trực tiếp
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-[#1a1a1a]">
                    Địa điểm: 
                  </span>
                  <span className="text-[#666666]">
                    {order
                      ? `Quầy vé ${order.venue}`
                      : "---"}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-[#1a1a1a]">
                    Thời hạn: 
                  </span>
                  <span className="text-[#666666]">
                    {order
                      ? `Trước 12:00 ngày ${order.date}`
                      : "---"}
                  </span>
                </div>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-[#999999]">
                Vui lòng mang theo mã đơn hàng và CMND/CCCD khi thanh toán.
              </p>
            </div>

            {/* Divider */}
            <div className="my-6 border-t border-[#e0e0e0]" />

            {/* Action buttons */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/trang-chu"
                className="flex-1 rounded-full border-2 border-[#2d5f5d] px-6 py-3 text-center text-sm font-semibold text-[#2d5f5d] transition-colors hover:bg-[#2d5f5d] hover:text-[#ffffff]"
              >
                Về trang chủ
              </Link>
              <Link
                href="/quan-ly-ve"
                className="flex-1 rounded-full border-2 border-[#2d5f5d] px-6 py-3 text-center text-sm font-semibold text-[#2d5f5d] transition-colors hover:bg-[#2d5f5d] hover:text-[#ffffff]"
              >
                Xem chi tiết đơn hàng
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
