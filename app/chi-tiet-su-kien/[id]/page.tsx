"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { eventsApi } from "@/lib/api";
import { NavbarAuthenticated } from "@/components/navbar-authenticated";
import { Footer } from "@/components/footer";
import Image from "next/image";
import { MapPin, Calendar, Clock, ChevronLeft, Users, Loader2 } from "lucide-react";

export default function EventDetailsPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const params = useParams();
  const eventId = Number(params.id);
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedTicketType, setSelectedTicketType] = useState<string>("");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/dang-nhap");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await eventsApi.getById(eventId);
        const ev = data.event;
        // Parse ticketTypes if it's a JSON string
        if (ev.ticketTypes && typeof ev.ticketTypes === "string") {
          try { ev.ticketTypes = JSON.parse(ev.ticketTypes); } catch { ev.ticketTypes = []; }
        }
        if (!ev.ticketTypes) ev.ticketTypes = [];
        setEvent(ev);
        if (ev.ticketTypes.length > 0) {
          setSelectedTicketType(ev.ticketTypes[0].name);
        }
      } catch (error) {
        console.error("Failed to fetch event:", error);
      } finally {
        setLoading(false);
      }
    };
    if (eventId) fetchEvent();
  }, [eventId]);

  if (!isAuthenticated) return null;

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f5f5f5]">
        <NavbarAuthenticated />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-[#2d5f5d]" />
        </div>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="min-h-screen bg-[#f5f5f5]">
        <NavbarAuthenticated />
        <div className="mx-auto max-w-7xl px-4 py-20 text-center">
          <p className="text-lg text-[#666]">Không tìm thấy sự kiện</p>
        </div>
      </main>
    );
  }

  const ticketTypes = event.ticketTypes || [];
  const selectedType = ticketTypes.find((t: any) => t.name === selectedTicketType);
  const totalPrice = (selectedType?.price || 0) * quantity;

  const handleBooking = () => {
    const booking = {
      eventId: event.event_id,
      eventName: event.name,
      ticketType: selectedTicketType,
      quantity,
      totalPrice,
    };
    useAuthStore.setState({ bookingCart: booking });
    router.push(`/dat-ve/${event.event_id}`);
  };

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
            {event.image && (
              <div className="relative h-80 overflow-hidden rounded-lg">
                <Image src={event.image} alt={event.name} fill className="object-cover" />
              </div>
            )}

            <div className="mt-8 rounded-lg bg-[#ffffff] p-6 border border-[#e0e0e0]">
              <h1 className="text-3xl font-bold text-[#1a1a1a]">{event.name}</h1>
              <p className="mt-3 text-[#666666]">{event.category}</p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="flex gap-3 rounded-lg bg-[#f5f5f5] p-4">
                  <Calendar className="h-5 w-5 text-[#2d5f5d]" />
                  <div>
                    <p className="text-xs text-[#666666]">Ngày</p>
                    <p className="font-semibold text-[#1a1a1a]">{event.event_date}</p>
                  </div>
                </div>
                <div className="flex gap-3 rounded-lg bg-[#f5f5f5] p-4">
                  <MapPin className="h-5 w-5 text-[#2d5f5d]" />
                  <div>
                    <p className="text-xs text-[#666666]">Địa điểm</p>
                    <p className="font-semibold text-[#1a1a1a]">{event.location}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-xl font-bold text-[#1a1a1a]">Mô tả</h2>
                <p className="mt-4 text-[#666666] leading-relaxed">{event.description}</p>
              </div>
            </div>
          </div>

          {/* Booking sidebar */}
          <div className="h-fit rounded-lg bg-[#ffffff] p-6 border border-[#e0e0e0] sticky top-20">
            <h2 className="text-xl font-bold text-[#1a1a1a]">Chọn vé</h2>

            {ticketTypes.length > 0 ? (
              <div className="mt-6 space-y-3">
                {ticketTypes.map((ticket: any) => (
                  <button
                    key={ticket.name}
                    onClick={() => setSelectedTicketType(ticket.name)}
                    className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
                      selectedTicketType === ticket.name
                        ? "border-[#2d5f5d] bg-[#f5f5f5]"
                        : "border-[#e0e0e0] hover:border-[#c8a96e]"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-[#1a1a1a]">{ticket.name}</p>
                        <p className="text-sm text-[#666666]">Còn {ticket.quantity} vé</p>
                      </div>
                      <p className="font-bold text-[#2d5f5d]">
                        {(ticket.price || 0).toLocaleString("vi-VN")} đ
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="mt-6">
                <p className="text-[#666]">Giá vé: <span className="font-bold text-[#2d5f5d]">{(event.price || 0).toLocaleString("vi-VN")} đ</span></p>
              </div>
            )}

            <div className="mt-6">
              <label className="block text-sm font-semibold text-[#1a1a1a]">Số lượng</label>
              <div className="mt-2 flex items-center gap-2 rounded-lg border border-[#e0e0e0] bg-[#f5f5f5] p-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-8 w-8 items-center justify-center text-[#2d5f5d] hover:bg-[#e0e0e0] rounded"
                >
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="flex-1 bg-transparent text-center font-semibold text-[#1a1a1a] outline-none"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex h-8 w-8 items-center justify-center text-[#2d5f5d] hover:bg-[#e0e0e0] rounded"
                >
                  +
                </button>
              </div>
            </div>

            <div className="mt-6 border-t border-[#e0e0e0] pt-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[#666666]">Tổng cộng:</span>
                <span className="text-2xl font-bold text-[#2d5f5d]">
                  {totalPrice.toLocaleString("vi-VN")} đ
                </span>
              </div>
              <button
                onClick={handleBooking}
                className="w-full rounded-lg bg-[#2d5f5d] py-3 text-base font-semibold text-[#ffffff] transition-colors hover:bg-[#245250]"
              >
                Tiếp tục
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
