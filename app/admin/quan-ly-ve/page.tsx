"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { ticketsApi } from "@/lib/api";
import { LogOut, ArrowLeft, Eye, Loader2 } from "lucide-react";
import Link from "next/link";

interface AdminTicket {
  ticket_id: number;
  ticket_code: string;
  event_name: string;
  customer_name: string;
  customer_email: string;
  ticket_type_name: string;
  ticket_price: number;
  event_date: string;
}

export default function AdminTicketManagement() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const [tickets, setTickets] = useState<AdminTicket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/dang-nhap");
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await ticketsApi.getAll();
        setTickets(data.tickets || []);
      } catch (error) {
        console.error("Failed to fetch tickets:", error);
      } finally {
        setLoading(false);
      }
    };
    if (isAuthenticated && user?.role === "admin") {
      fetchTickets();
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated || user?.role !== "admin") {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push("/dang-nhap");
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
        {/* Back button */}
        <Link
          href="/admin/dashboard"
          className="mb-6 flex items-center gap-2 text-[#2d5f5d] transition-colors hover:text-[#245250]"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại Dashboard
        </Link>

        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[#1a1a1a]">Quản lý vé</h2>
          <p className="mt-2 text-[#666666]">
            Danh sách tất cả các vé đã được bán
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[#2d5f5d]" />
            <span className="ml-3 text-[#666666]">Đang tải...</span>
          </div>
        ) : tickets.length === 0 ? (
          <div className="rounded-lg bg-[#ffffff] p-12 text-center shadow-sm">
            <p className="text-lg font-semibold text-[#666666]">
              Chưa có vé nào được bán
            </p>
          </div>
        ) : (
          /* Table */
          <div className="overflow-hidden rounded-lg bg-[#ffffff] shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#e0e0e0] bg-[#f9f9f9]">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#1a1a1a]">
                      Mã vé
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#1a1a1a]">
                      Sự kiện
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#1a1a1a]">
                      Khách hàng
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#1a1a1a]">
                      Loại vé
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#1a1a1a]">
                      Giá
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#1a1a1a]">
                      Ngày sự kiện
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#1a1a1a]">
                      Trạng thái
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket) => (
                    <tr
                      key={ticket.ticket_id}
                      className="border-b border-[#e0e0e0] hover:bg-[#f9f9f9]"
                    >
                      <td className="px-6 py-4 text-sm text-[#1a1a1a] font-medium">
                        {ticket.ticket_code}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#666666]">
                        {ticket.event_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#666666]">
                        {ticket.customer_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#666666]">
                        {ticket.ticket_type_name || "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#666666] font-semibold">
                        {(ticket.ticket_price || 0).toLocaleString("vi-VN")} đ
                      </td>
                      <td className="px-6 py-4 text-sm text-[#666666]">
                        {ticket.event_date}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                          Đã bán
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
