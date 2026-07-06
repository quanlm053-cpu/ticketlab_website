"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { EventCard } from "./event-card";
import { eventsApi } from "@/lib/api";

const categories = [
  { id: "music", name: "Nhạc sống" },
  { id: "festival", name: "Lễ hội" },
  { id: "exhibition", name: "Triển lãm" },
  { id: "sports", name: "Thể thao" },
];

export function EventsSection() {
  const [activeCategory, setActiveCategory] = useState("music");
  const [eventsList, setEventsList] = useState<any[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await eventsApi.getAll(activeCategory);
        setEventsList(data.events || []);
      } catch {
        setEventsList([]);
      }
    };
    fetchEvents();
  }, [activeCategory]);

  return (
    <section className="bg-[#ffffff] px-4 py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-8 text-center text-2xl font-bold text-[#1a1a1a] lg:text-3xl">
          Xu hướng
        </h2>

        <div className="mb-10 flex flex-wrap items-center justify-center gap-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`text-sm font-medium transition-colors ${
                cat.id === activeCategory
                  ? "text-[#2d5f5d] underline underline-offset-4"
                  : "text-[#666666] hover:text-[#2d5f5d]"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {eventsList.slice(0, 3).map((event) => (
            <EventCard
              key={event.event_id}
              eventId={String(event.event_id)}
              image={event.image}
              title={event.name}
              location={event.location}
              price={`${(event.price || 0).toLocaleString("vi-VN")}đ`}
            />
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            href={`/tim-kiem?category=${activeCategory}`}
            className="inline-block rounded-full border-2 border-[#2d5f5d] px-8 py-3 text-sm font-semibold text-[#2d5f5d] transition-colors hover:bg-[#2d5f5d] hover:text-[#ffffff]"
          >
            {'Xem th\u00EAm >>'}
          </Link>
        </div>
      </div>
    </section>
  );
}
