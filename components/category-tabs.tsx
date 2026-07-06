"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { eventsApi } from "@/lib/api";
import Image from "next/image";

const categories = [
  { id: "music", name: "Nhạc sống" },
  { id: "festival", name: "Lễ hội" },
  { id: "exhibition", name: "Triển lãm" },
  { id: "sports", name: "Thể thao" },
];

interface CategoryTabsProps {
  onCategoryChange?: (category: string) => void;
}

export function CategoryTabs({ onCategoryChange }: CategoryTabsProps) {
  const [activeCategory, setActiveCategory] = useState("music");
  const [categoryEvents, setCategoryEvents] = useState<any[]>([]);

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    onCategoryChange?.(categoryId);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await eventsApi.getAll(activeCategory);
        setCategoryEvents(data.events || []);
      } catch {
        setCategoryEvents([]);
      }
    };
    fetchEvents();
  }, [activeCategory]);

  return (
    <section className="bg-[#f5f5f5] py-12">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-12 rounded-2xl bg-gradient-to-r from-[#2d5f5d] to-[#3d7f7d] p-8 text-[#ffffff]">
          <h2 className="mb-2 text-4xl font-bold">Sự kiện xu hướng!</h2>
          <p className="max-w-2xl text-[#ffffff]/80">
            Khám phá những sự kiện hấp dẫn nhất và không bỏ lỡ những trải
            nghiệm tuyệt vời
          </p>
        </div>

        <div className="mb-8">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`whitespace-nowrap rounded-full px-6 py-2 font-medium transition-colors ${
                  activeCategory === cat.id
                    ? "bg-[#2d5f5d] text-[#ffffff]"
                    : "border border-[#2d5f5d] text-[#2d5f5d] hover:bg-[#2d5f5d]/10"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categoryEvents.slice(0, 6).map((event) => (
            <Link
              key={event.event_id}
              href={`/chi-tiet-su-kien/${event.event_id}`}
              className="group"
            >
              <div className="overflow-hidden rounded-lg border border-[#e0e0e0] bg-[#ffffff] transition-all hover:shadow-lg">
                <div className="relative h-48 overflow-hidden bg-[#f5f5f5]">
                  {event.image ? (
                    <Image
                      src={event.image}
                      alt={event.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[#999]">Không có ảnh</div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="line-clamp-2 font-semibold text-[#1a1a1a]">
                    {event.name}
                  </h3>
                  <p className="mt-2 text-sm text-[#666666]">
                    {event.event_date} • {event.location}
                  </p>
                  <p className="mt-3 font-bold text-[#2d5f5d]">
                    {(event.price || 0).toLocaleString("vi-VN")} đ
                  </p>
                  <button className="mt-4 w-full rounded-lg bg-[#2d5f5d] py-2 text-sm font-semibold text-[#ffffff] transition-colors hover:bg-[#245250]">
                    Mua vé
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex justify-center">
          <Link
            href={`/tim-kiem?category=${activeCategory}`}
            className="flex items-center gap-2 rounded-full border border-[#2d5f5d] px-8 py-3 font-semibold text-[#2d5f5d] transition-colors hover:bg-[#2d5f5d] hover:text-[#ffffff]"
          >
            Xem thêm
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
