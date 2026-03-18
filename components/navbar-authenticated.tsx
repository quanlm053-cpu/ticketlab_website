"use client";

import { Search, LogOut, Ticket, User, Menu } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/lib/store";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function NavbarAuthenticated() {
  const { user, logout } = useAuthStore();
  const [showMenu, setShowMenu] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="bg-[#2d5f5d] text-[#ffffff]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-[#c8a96e] text-sm font-bold text-[#1a1a1a]">
            TL
          </div>
          <span className="hidden text-lg font-bold tracking-wide sm:inline">
            TicketLab
          </span>
        </Link>

        {/* Center: Search bar */}
        <div className="flex-1 mx-4 max-w-xs">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (searchInput.trim()) {
                router.push(`/tim-kiem?q=${encodeURIComponent(searchInput)}`);
              }
            }}
            className="relative"
          >
            <input
              type="text"
              placeholder="Search..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full rounded-full border border-[#c8a96e]/30 bg-[#ffffff]/10 px-4 py-2 text-sm text-[#ffffff] placeholder-[#ffffff]/60 outline-none transition-colors focus:border-[#c8a96e]"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#ffffff]/60 transition-colors hover:text-[#c8a96e]"
            >
              <Search className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* Right: Nav links + User menu */}
        <div className="flex items-center gap-4">
          <nav className="hidden gap-6 sm:flex">
            <Link
              href="/"
              className="text-sm font-medium text-[#ffffff]/80 transition-colors hover:text-[#c8a96e]"
            >
              Trang chủ
            </Link>
            <Link
              href="/tim-kiem"
              className="text-sm font-medium text-[#ffffff]/80 transition-colors hover:text-[#c8a96e]"
            >
              Liên hệ
            </Link>
            <Link
              href="/tim-kiem"
              className="text-sm font-medium text-[#ffffff]/80 transition-colors hover:text-[#c8a96e]"
            >
              Điều khoản
            </Link>
          </nav>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gradient-to-b from-[#c8a96e] to-[#8b6914] shadow-md transition-opacity hover:opacity-90"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#ffffff]">
                <User className="h-3.5 w-3.5 text-[#ffffff]" />
              </div>
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg border border-[#c8a96e]/30 bg-[#2d5f5d] shadow-lg">
                <div className="border-b border-[#c8a96e]/30 px-4 py-3">
                  <p className="text-sm font-semibold text-[#ffffff]">
                    {user?.name}
                  </p>
                  <p className="text-xs text-[#ffffff]/60">{user?.email}</p>
                </div>

                <Link
                  href="/quan-ly-ve"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-[#ffffff]/80 transition-colors hover:bg-[#245250] hover:text-[#c8a96e]"
                >
                  <Ticket className="h-4 w-4" />
                  Quản lý vé
                </Link>

                <Link
                  href="/tai-khoan"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-[#ffffff]/80 transition-colors hover:bg-[#245250] hover:text-[#c8a96e]"
                >
                  <User className="h-4 w-4" />
                  Tài khoản
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-left text-sm text-red-400 transition-colors hover:bg-[#245250]"
                >
                  <LogOut className="h-4 w-4" />
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
