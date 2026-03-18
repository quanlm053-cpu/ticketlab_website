"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { eventsApi } from "@/lib/api";
import { NavbarAuthenticated } from "@/components/navbar-authenticated";
import { Footer } from "@/components/footer";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";

const categories = [
  { id: "music", name: "Nhạc sống" },
  { id: "festival", name: "Lễ hội" },
  { id: "exhibition", name: "Triển lãm" },
  { id: "sports", name: "Thể thao" },
];

export default function SearchPage() {
  return (
    <Suspense>
      <SearchPageContent />
    </Suspense>
  );
}

function SearchPageContent() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState("music");
  const [searchQuery, setSearchQuery] = useState("");
  const [allEvents, setAllEvents] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/dang-nhap");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    const queryParam = searchParams.get("q");
    if (categoryParam) {
      setActiveCategory(categoryParam);
    }
    if (queryParam) {
      setSearchQuery(queryParam);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await eventsApi.getAll(activeCategory);
        const events = data.events || [];
        setAllEvents(events);
      } catch {
        setAllEvents([]);
      }
    };
    fetchEvents();
  }, [activeCategory]);

  useEffect(() => {
    let filtered = allEvents;
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (e) =>
          e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (e.location && e.location.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    setResults(filtered);
  }, [searchQuery, allEvents]);

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    setSearchQuery("");
    router.replace(`/tim-kiem?category=${categoryId}`, { scroll: false });
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#f0f0f0]">
      <NavbarAuthenticated />

      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        {/* Trending Banner */}
        <div className="mb-10 rounded-2xl bg-[#2d5f5d] px-8 py-10 lg:px-12 lg:py-12">
          <h1 className="mb-3 text-3xl font-bold italic text-[#ffffff] lg:text-4xl">
            Sự kiện xu hướng!
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-[#ffffff]/80 lg:text-base">
            Khám phá những sự kiện hấp dẫn nhất và không bỏ lỡ những trải nghiệm tuyệt vời
          </p>
        </div>

        {/* Category Tabs */}
        <div className="mb-8 flex flex-wrap gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`rounded-full px-6 py-2.5 text-sm font-medium transition-colors ${
                activeCategory === cat.id
                  ? "bg-[#2d5f5d] text-[#ffffff]"
                  : "border border-[#999999] text-[#666666] hover:border-[#2d5f5d] hover:text-[#2d5f5d]"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        {results.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((event) => (
              <div
                key={event.event_id}
                className="overflow-hidden rounded-lg bg-[#ffffff] shadow-sm transition-shadow hover:shadow-md"
              >
                <Link
                  href={`/chi-tiet-su-kien/${event.event_id}`}
                  className="group block"
                >
                  <div className="relative h-52 overflow-hidden">
                    {event.image ? (
                      <Image
                        src={event.image}
                        alt={event.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-[#f5f5f5] text-[#999]">Không có ảnh</div>
                    )}
                  </div>
                </Link>
                <div className="p-5">
                  <h3 className="text-base font-bold text-[#1a1a1a]">
                    {event.name}
                  </h3>
                  <p className="mt-1.5 text-sm text-[#888888]">
                    {event.event_date} {"\u2022"} {event.location}
                  </p>
                  <p className="mt-3 text-base font-bold text-[#c0392b]">
                    {(event.price || 0).toLocaleString("vi-VN")} đ
                  </p>
                  <Link
                    href={`/chi-tiet-su-kien/${event.event_id}`}
                    className="mt-4 block w-full rounded-full bg-[#2d5f5d] py-2.5 text-center text-sm font-semibold text-[#ffffff] transition-colors hover:bg-[#245250]"
                  >
                    Mua vé
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg bg-[#ffffff] p-12 text-center shadow-sm">
            <Search className="mx-auto h-12 w-12 text-[#c8a96e]/30" />
            <p className="mt-4 text-lg font-semibold text-[#666666]">
              Không tìm thấy sự kiện nào
            </p>
            <p className="mt-2 text-sm text-[#999999]">
              Hãy thử thay đổi danh mục khác
            </p>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
