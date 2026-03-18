"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { adminApi } from "@/lib/api";
import { LogOut, TicketIcon, Calendar, Loader2 } from "lucide-react";
import Link from "next/link";

interface Stats {
  totalEvents: number;
  totalTicketsSold: number;
  totalRevenue: number;
}

export default function AdminDashboard() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/dang-nhap");
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminApi.getStats();
        setStats(data.stats);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };
    if (isAuthenticated && user?.role === "admin") {
      fetchStats();
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated || user?.role !== "admin") {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push("/dang-nhap");
  };

  const formatRevenue = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(0)} Tr`;
    }
    return value.toLocaleString("vi-VN");
  };

  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <header className="bg-[#2d5f5d]">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-[#c8a96e] text-sm font-bold text-[#1a1a1a]">
              TL
            </div>
            <h1 className="text-xl font-bold text-[#ffffff]">TicketLab Admin</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#ffffff]/80">{user?.name}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-[#ffffff] transition-colors hover:bg-red-700"
            >
              <LogOut className="h-4 w-4" />
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Dashboard Title */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-[#1a1a1a]">Dashboard</h2>
          <p className="mt-2 text-[#666666]">
            Chào mừng đến với trang quản lý TicketLab
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-10 grid gap-6 sm:grid-cols-3">
          <div className="rounded-lg bg-[#ffffff] p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#666666]">Tổng sự kiện</p>
                <p className="mt-2 text-3xl font-bold text-[#2d5f5d]">
                  {loading ? <Loader2 className="h-8 w-8 animate-spin" /> : stats?.totalEvents ?? 0}
                </p>
              </div>
              <div className="rounded-lg bg-[#e8f5ff] p-3">
                <Calendar className="h-6 w-6 text-[#2d5f5d]" />
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-[#ffffff] p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#666666]">Tổng vé bán</p>
                <p className="mt-2 text-3xl font-bold text-[#2d5f5d]">
                  {loading ? <Loader2 className="h-8 w-8 animate-spin" /> : stats?.totalTicketsSold ?? 0}
                </p>
              </div>
              <div className="rounded-lg bg-[#e8f5ff] p-3">
                <TicketIcon className="h-6 w-6 text-[#2d5f5d]" />
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-[#ffffff] p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#666666]">Doanh thu</p>
                <p className="mt-2 text-3xl font-bold text-[#2d5f5d]">
                  {loading ? <Loader2 className="h-8 w-8 animate-spin" /> : formatRevenue(stats?.totalRevenue ?? 0)}
                </p>
              </div>
              <div className="rounded-lg bg-[#e8f5ff] p-3">
                <Calendar className="h-6 w-6 text-[#2d5f5d]" />
              </div>
            </div>
          </div>
        </div>

        {/* Management Sections */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Ticket Management */}
          <Link href="/admin/quan-ly-ve">
            <div className="group cursor-pointer rounded-lg bg-[#ffffff] p-8 shadow-sm transition-all hover:shadow-lg hover:border-[#2d5f5d] border-2 border-transparent">
              <div className="flex items-start justify-between">
                <div>
                  <TicketIcon className="h-12 w-12 text-[#2d5f5d] mb-4" />
                  <h3 className="text-2xl font-bold text-[#1a1a1a]">
                    Quản lý vé
                  </h3>
                  <p className="mt-2 text-[#666666]">
                    Quản lý tất cả các vé được bán
                  </p>
                </div>
              </div>
              <div className="mt-6 inline-block rounded-lg bg-[#2d5f5d] px-6 py-2 text-sm font-semibold text-[#ffffff] transition-colors group-hover:bg-[#245250]">
                Truy cập →
              </div>
            </div>
          </Link>

          {/* Event Management */}
          <Link href="/admin/quan-ly-su-kien">
            <div className="group cursor-pointer rounded-lg bg-[#ffffff] p-8 shadow-sm transition-all hover:shadow-lg hover:border-[#2d5f5d] border-2 border-transparent">
              <div className="flex items-start justify-between">
                <div>
                  <Calendar className="h-12 w-12 text-[#2d5f5d] mb-4" />
                  <h3 className="text-2xl font-bold text-[#1a1a1a]">
                    Quản lý sự kiện
                  </h3>
                  <p className="mt-2 text-[#666666]">
                    Quản lý các sự kiện và thông tin chi tiết
                  </p>
                </div>
              </div>
              <div className="mt-6 inline-block rounded-lg bg-[#2d5f5d] px-6 py-2 text-sm font-semibold text-[#ffffff] transition-colors group-hover:bg-[#245250]">
                Truy cập →
              </div>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
