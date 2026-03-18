"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { NavbarAuthenticated } from "@/components/navbar-authenticated";
import { Footer } from "@/components/footer";
import Image from "next/image";
import { Calendar, MapPin, Ticket, ChevronRight } from "lucide-react";

export default function TicketManagementPage() {
  const { isAuthenticated, userTickets } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/dang-nhap");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      <NavbarAuthenticated />

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <h1 className="text-3xl font-bold text-[#1a1a1a]">Quản lý vé</h1>
        <p className="mt-2 text-[#666666]">
          Xem và quản lý tất cả các vé của bạn
        </p>

        {userTickets.length > 0 ? (
          <div className="mt-8">
            {/* Tabs */}
            <div className="mb-6 flex gap-4 border-b border-[#e0e0e0]">
              <button className="border-b-2 border-[#2d5f5d] px-4 py-2 font-semibold text-[#2d5f5d]">
                Sắp diễn ra ({userTickets.length})
              </button>
              <button className="border-b-2 border-transparent px-4 py-2 font-medium text-[#666666] hover:text-[#2d5f5d]">
                Đã kết thúc
              </button>
            </div>

            {/* Tickets list */}
            <div className="space-y-4">
              {userTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="rounded-lg bg-[#ffffff] p-6 border border-[#e0e0e0] transition-all hover:shadow-lg"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    {/* Ticket info */}
                    <div className="flex gap-4 flex-1">
                      <div className="relative h-24 w-24 overflow-hidden rounded-lg bg-[#f5f5f5] shrink-0">
                        <Image
                          src={ticket.eventImage}
                          alt={ticket.eventName}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <h3 className="line-clamp-2 text-lg font-bold text-[#1a1a1a]">
                          {ticket.eventName}
                        </h3>

                        <div className="mt-3 space-y-1">
                          <div className="flex items-center gap-2 text-sm text-[#666666]">
                            <Ticket className="h-4 w-4" />
                            <span>{ticket.ticketType}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-[#666666]">
                            <Calendar className="h-4 w-4" />
                            <span>{ticket.date}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-[#666666]">
                            <MapPin className="h-4 w-4" />
                            <span>{ticket.location}</span>
                          </div>
                        </div>

                        <p className="mt-3 text-xs text-[#999999]">
                          Mua lúc: {ticket.purchaseDate}
                        </p>
                      </div>
                    </div>

                    {/* Price and action */}
                    <div className="flex flex-col items-end justify-between gap-4 sm:items-end">
                      <div className="text-right">
                        <p className="text-sm text-[#666666]">Giá tiền</p>
                        <p className="text-2xl font-bold text-[#2d5f5d]">
                          {ticket.price.toLocaleString("vi-VN")} đ
                        </p>
                      </div>

                      <button className="flex items-center gap-2 rounded-lg bg-[#2d5f5d] px-4 py-2 text-sm font-semibold text-[#ffffff] transition-colors hover:bg-[#245250]">
                        Xem chi tiết
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-12 rounded-lg bg-[#ffffff] p-12 text-center border border-[#e0e0e0]">
            <Ticket className="mx-auto h-16 w-16 text-[#c8a96e]/30" />
            <h2 className="mt-4 text-xl font-bold text-[#1a1a1a]">
              Chưa có vé nào
            </h2>
            <p className="mt-2 text-[#666666]">
              Bạn chưa đặt vé cho sự kiện nào. Hãy khám phá các sự kiện hấp
              dẫn!
            </p>
            <button
              onClick={() => router.push("/trang-chu")}
              className="mt-6 rounded-lg bg-[#2d5f5d] px-6 py-3 font-semibold text-[#ffffff] transition-colors hover:bg-[#245250]"
            >
              Khám phá sự kiện
            </button>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
