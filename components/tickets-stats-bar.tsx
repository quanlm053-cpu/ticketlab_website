"use client";

import { useEffect, useState } from "react";
import { TicketIcon, TrendingUp, Users, Crown } from "lucide-react";
import { ticketsApi } from "@/lib/api";

interface TicketsStats {
  totalTickets: number;
  totalRevenue: number;
  totalCustomers: number;
  topTicket: string;
  topTicketSold: number;
  topBuyer: string;
  topBuyerCount: number;
}

export function TicketsStatsBar() {
  const [stats, setStats] = useState<TicketsStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await ticketsApi.getStats();
        console.log("Stats data received:", data);
        setStats(data.stats || data); // Support both { stats: {...} } and direct {...}
      } catch (error) {
        console.error("Failed to fetch tickets stats:", error);
        console.error("Error details:", {
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="rounded-lg bg-[#f5f5f5] p-4 text-center">
        <p className="text-[#666666]">Đang tải thống kê...</p>
      </div>
    );
  }

  const formatPrice = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toLocaleString("vi-VN");
  };

  return (
    <div className="mb-8 rounded-lg bg-[#ffffff] shadow-sm overflow-hidden border border-[#e0e0e0]">
      {/* Row 1 - 4 main metrics */}
      <div className="grid gap-6 sm:grid-cols-4 p-6">
        {/* Total Tickets */}
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-[#e8f5ff] p-3">
            <TicketIcon className="h-6 w-6 text-[#2d5f5d]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#666666]">Tổng vé</p>
            <p className="mt-1 text-2xl font-bold text-[#2d5f5d]">
              {stats.totalTickets}
            </p>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-[#e8f5ff] p-3">
            <TrendingUp className="h-6 w-6 text-[#2d5f5d]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#666666]">Doanh thu</p>
            <p className="mt-1 text-2xl font-bold text-[#2d5f5d]">
              {formatPrice(stats.totalRevenue)} đ
            </p>
          </div>
        </div>

        {/* Total Customers */}
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-[#e8f5ff] p-3">
            <Users className="h-6 w-6 text-[#2d5f5d]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#666666]">Khách hàng</p>
            <p className="mt-1 text-2xl font-bold text-[#2d5f5d]">
              {stats.totalCustomers}
            </p>
          </div>
        </div>

        {/* Top Ticket Type */}
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-[#fff3e0] p-3">
            <span className="text-xl font-bold text-[#c8a96e]">★</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#666666]">Loại vé bán chạy</p>
            <p className="mt-1 font-bold text-[#1a1a1a] truncate">
              {stats.topTicket}
            </p>
            <p className="text-xs text-[#666666]">{stats.topTicketSold} vé</p>
          </div>
        </div>
      </div>

      {/* Row 2 - Top Buyer */}
      <div className="border-t border-[#e0e0e0] bg-[#f9f9f9] px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-[#fff3e0] p-3">
            <Crown className="h-6 w-6 text-[#c8a96e]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#666666]">Top buyer</p>
            <p className="mt-1 text-lg font-bold text-[#1a1a1a]">
              {stats.topBuyer}
              <span className="ml-2 text-sm font-semibold text-[#2d5f5d]">
                ({stats.topBuyerCount} vé)
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
