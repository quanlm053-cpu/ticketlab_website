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
            Thanh to\u00E1n \u0111\u01A1n h\u00E0ng
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
              {"\u0110\u1EB7t v\u00E9 th\u00E0nh c\u00F4ng!"}
            </h2>
            <p className="mt-2 text-center text-sm text-[#666666]">
              {"C\u1EA3m \u01A1n b\u1EA1n \u0111\u00E3 \u0111\u1EB7t v\u00E9. Vui l\u00F2ng ho\u00E0n t\u1EA5t thanh to\u00E1n \u0111\u1EC3 nh\u1EADn v\u00E9."}
            </p>

            {/* Divider */}
            <div className="my-6 border-t border-[#e0e0e0]" />

            {/* Order info */}
            <div>
              <h3 className="text-base font-bold text-[#1a1a1a]">
                {"Th\u00F4ng tin \u0111\u01A1n h\u00E0ng"}
              </h3>
              <div className="mt-4 space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#666666]">
                    {"M\u00E3 \u0111\u01A1n h\u00E0ng:"}
                  </span>
                  <span className="font-semibold text-[#1a1a1a]">
                    #{order?.orderId || "TL000000"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666666]">
                    {"S\u1EF1 ki\u1EC7n:"}
                  </span>
                  <span className="font-semibold text-[#1a1a1a]">
                    {order?.eventName || "---"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666666]">
                    {"Th\u1EDDi gian:"}
                  </span>
                  <span className="font-semibold text-[#1a1a1a]">
                    {order ? `${order.startTime} - ${order.date}` : "---"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666666]">
                    {"Lo\u1EA1i v\u00E9:"}
                  </span>
                  <span className="font-semibold text-[#1a1a1a]">
                    {order
                      ? `${order.ticketType} (x${order.quantity})`
                      : "---"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666666]">
                    {"T\u1ED5ng ti\u1EC1n:"}
                  </span>
                  <span className="font-bold text-[#c0392b]">
                    {order
                      ? `${order.totalPrice.toLocaleString("vi-VN")}\u0111`
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
                {"H\u01B0\u1EDBng d\u1EABn thanh to\u00E1n"}
              </h3>
              <div className="mt-4 space-y-2.5 text-sm">
                <div>
                  <span className="font-semibold text-[#1a1a1a]">
                    {"Ph\u01B0\u01A1ng th\u1EE9c: "}
                  </span>
                  <span className="text-[#666666]">
                    {"Thanh to\u00E1n tr\u1EF1c ti\u1EBFp"}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-[#1a1a1a]">
                    {"\u0110\u1ECBa \u0111i\u1EC3m: "}
                  </span>
                  <span className="text-[#666666]">
                    {order
                      ? `Qu\u1EA7y v\u00E9 ${order.venue}`
                      : "---"}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-[#1a1a1a]">
                    {"Th\u1EDDi h\u1EA1n: "}
                  </span>
                  <span className="text-[#666666]">
                    {order
                      ? `Tr\u01B0\u1EDBc 12:00 ng\u00E0y ${order.date}`
                      : "---"}
                  </span>
                </div>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-[#999999]">
                {"Vui l\u00F2ng mang theo m\u00E3 \u0111\u01A1n h\u00E0ng v\u00E0 CMND/CCCD khi thanh to\u00E1n."}
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
                {"V\u1EC1 trang ch\u1EE7"}
              </Link>
              <Link
                href="/quan-ly-ve"
                className="flex-1 rounded-full border-2 border-[#2d5f5d] px-6 py-3 text-center text-sm font-semibold text-[#2d5f5d] transition-colors hover:bg-[#2d5f5d] hover:text-[#ffffff]"
              >
                {"Xem chi ti\u1EBFt \u0111\u01A1n h\u00E0ng"}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
