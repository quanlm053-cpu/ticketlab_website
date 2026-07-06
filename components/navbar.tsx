"use client";

import { Search } from "lucide-react";
import Link from "next/link";

export function Navbar() {
  return (
    <header className="bg-[#2d5f5d] text-[#ffffff]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-[#c8a96e] text-sm font-bold text-[#1a1a1a]">
            TL
          </div>
          <span className="text-lg font-bold tracking-wide text-[#ffffff]">TicketLab</span>
        </div>

        {/* Search bar - hidden on mobile */}
        <div className="hidden items-center gap-2 rounded-full bg-[#ffffff]/20 px-4 py-1.5 md:flex">
          <Search className="h-4 w-4 text-[#ffffff]/70" />
          <input
            type="text"
            placeholder="Search..."
            className="w-40 bg-transparent text-sm text-[#ffffff] placeholder-[#ffffff]/60 outline-none"
          />
        </div>

        {/* Navigation */}
        <nav className="hidden items-center gap-6 text-sm md:flex">
          <a href="#" className="text-[#ffffff]/90 transition-colors hover:text-[#ffffff]">
            Cộng đồng
          </a>
          <a href="#" className="text-[#ffffff]/90 transition-colors hover:text-[#ffffff]">
            Liên hệ
          </a>
        </nav>

        {/* Auth buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/dang-ky"
            className="rounded-full border border-[#c8a96e] px-5 py-1.5 text-sm font-medium text-[#c8a96e] transition-colors hover:bg-[#c8a96e] hover:text-[#1a1a1a]"
          >
            {"Dang ky"}
          </Link>
          <Link
            href="/dang-nhap"
            className="rounded-full bg-[#c8a96e] px-5 py-1.5 text-sm font-medium text-[#1a1a1a] transition-colors hover:bg-[#b89a5e]"
          >
            {"Dang nhap"}
          </Link>
        </div>
      </div>
    </header>
  );
}
