"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const heroImages = [
  "/images/hero-1.jpg",
  "/images/hero-2.jpg",
  "/images/hero-3.jpg",
];

export function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <section className="bg-[#2d5f5d] text-[#ffffff]">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 lg:flex-row lg:items-center lg:px-8 lg:py-20">
        {/* Left content */}
        <div className="flex-1">
          <h1 className="mb-4 text-4xl font-bold italic text-[#ffffff] lg:text-5xl">Sự kiện</h1>
          <p className="mb-8 max-w-md text-sm leading-relaxed text-[#ffffff]/80">
            Khám phá những trải nghiệm hấp dẫn, không để bạn bỏ lỡ bất kỳ sự kiện nào. Đặt vé dễ dàng cho các
            sự kiện tại TP.HCM, Hà Nội, Đà Nẵng và nhiều thành phố khác. Sự kiện của bạn, vé của bạn, tất cả
            chỉ cần một cú nhấp chuột.
          </p>
          <Link
            href="/tim-kiem"
            className="inline-block rounded-full border-2 border-[#c8a96e] px-8 py-3 text-sm font-semibold text-[#c8a96e] transition-colors hover:bg-[#c8a96e] hover:text-[#1a1a1a]"
          >
            Chi tiết sự kiện
          </Link>
        </div>

        {/* Right images */}
        <div className="flex flex-1 items-center justify-center gap-3">
          {heroImages.map((src, i) => (
            <div
              key={i}
              className={`overflow-hidden rounded-2xl ${
                i === 1 ? "h-56 w-40 lg:h-64 lg:w-48" : "h-48 w-32 lg:h-56 lg:w-40"
              }`}
            >
              <Image
                src={src}
                alt={`Sự kiện nổi bật ${i + 1}`}
                width={300}
                height={400}
                loading={i === 1 ? "eager" : "lazy"}
                priority={i === 1}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 pb-8">
        {[0, 1, 2, 3].map((i) => (
          <button
            key={i}
            onClick={() => setActiveSlide(i)}
            className={`h-2 w-2 rounded-full transition-colors ${
              i === activeSlide ? "bg-[#c8a96e]" : "bg-[#ffffff]/40"
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
