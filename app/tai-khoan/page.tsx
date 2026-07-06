"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { NavbarAuthenticated } from "@/components/navbar-authenticated";
import { Footer } from "@/components/footer";
import Image from "next/image";
import { User, Mail, Edit2 } from "lucide-react";

export default function AccountPage() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/dang-nhap");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      <NavbarAuthenticated />

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <h1 className="text-3xl font-bold text-[#1a1a1a]">Tài khoản</h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Profile card */}
          <div className="rounded-lg bg-[#ffffff] p-6 border border-[#e0e0e0]">
            <h2 className="text-lg font-bold text-[#1a1a1a]">Thông tin cá nhân</h2>

            <div className="mt-6 text-center">
              <div className="mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full border-4 border-[#c8a96e]">
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={96}
                    height={96}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#f5f5f5]">
                    <User className="h-12 w-12 text-[#c8a96e]" />
                  </div>
                )}
              </div>

              <h3 className="text-lg font-bold text-[#1a1a1a]">{user.name}</h3>
              <p className="mt-2 text-sm text-[#666666]">{user.email}</p>

              <button className="mt-6 flex items-center justify-center gap-2 w-full rounded-lg border border-[#2d5f5d] px-4 py-2 font-semibold text-[#2d5f5d] transition-colors hover:bg-[#f5f5f5]">
                <Edit2 className="h-4 w-4" />
                Chỉnh sửa
              </button>
            </div>
          </div>

          {/* Account details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact info */}
            <div className="rounded-lg bg-[#ffffff] p-6 border border-[#e0e0e0]">
              <h2 className="text-lg font-bold text-[#1a1a1a]">Thông tin liên hệ</h2>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#1a1a1a]">
                    Tên đầy đủ
                  </label>
                  <input
                    type="text"
                    value={user.name}
                    disabled
                    className="mt-2 w-full rounded-lg border border-[#e0e0e0] bg-[#f5f5f5] px-4 py-3 text-[#1a1a1a] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#1a1a1a]">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="mt-2 w-full rounded-lg border border-[#e0e0e0] bg-[#f5f5f5] px-4 py-3 text-[#1a1a1a] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="rounded-lg bg-[#ffffff] p-6 border border-[#e0e0e0]">
              <h2 className="text-lg font-bold text-[#1a1a1a]">Bảo mật</h2>

              <button className="mt-6 rounded-lg border border-[#2d5f5d] px-4 py-2 font-semibold text-[#2d5f5d] transition-colors hover:bg-[#f5f5f5]">
                Đổi mật khẩu
              </button>
            </div>

            {/* Preferences */}
            <div className="rounded-lg bg-[#ffffff] p-6 border border-[#e0e0e0]">
              <h2 className="text-lg font-bold text-[#1a1a1a]">Tuỳ chọn</h2>

              <div className="mt-6 space-y-4">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 accent-[#2d5f5d]"
                  />
                  <span className="text-sm text-[#1a1a1a]">
                    Nhận email thông báo về các sự kiện mới
                  </span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 accent-[#2d5f5d]"
                  />
                  <span className="text-sm text-[#1a1a1a]">
                    Nhận thông báo về giảm giá và khuyến mãi
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
