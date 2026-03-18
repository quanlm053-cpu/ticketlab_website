"use client";

import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { useEffect } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { login, user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/trang-chu");
      }
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Background image */}
      <Image
        src="/images/auth-bg.jpg"
        alt="Concert background"
        fill
        className="object-cover"
        priority
      />
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-[#0a0a0a]/30" />

      {/* Header */}
      <header className="relative z-10 flex items-center gap-2 px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-[#c8a96e] text-sm font-bold text-[#1a1a1a]">
            TL
          </div>
          <span className="text-lg font-bold tracking-wide text-[#ffffff]">
            TicketLab
          </span>
        </Link>
      </header>

      {/* Form container */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 pb-12">
        <div className="w-full max-w-md rounded-2xl border border-[#ffffff]/20 bg-[#ffffff]/10 p-8 shadow-2xl backdrop-blur-xl">
          <h1 className="mb-8 text-center text-3xl font-bold text-[#ffffff]">
            {"Dang nhap"}
          </h1>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setError("");
              try {
                login(email, password);
                // Redirect happens via useEffect
              } catch (err) {
                setError(
                  err instanceof Error ? err.message : "Login failed"
                );
              }
            }}
            className="flex flex-col gap-5"
          >
            {/* Error message */}
            {error && (
              <div className="rounded-lg bg-red-500/20 p-3 text-sm text-red-200">
                {error}
              </div>
            )}

            {/* Email */}
            <div className="relative">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-[#ffffff]/30 bg-[#ffffff]/10 px-4 py-3 pr-12 text-[#ffffff] placeholder-[#ffffff]/60 outline-none transition-colors focus:border-[#c8a96e] focus:ring-1 focus:ring-[#c8a96e]"
              />
              <Mail className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#ffffff]/50" />
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder={"Mat khau"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-[#ffffff]/30 bg-[#ffffff]/10 px-4 py-3 pr-12 text-[#ffffff] placeholder-[#ffffff]/60 outline-none transition-colors focus:border-[#c8a96e] focus:ring-1 focus:ring-[#c8a96e]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#ffffff]/50 transition-colors hover:text-[#ffffff]/80"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Lock className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="my-1 h-px bg-[#ffffff]/20" />

            {/* Submit */}
            <button
              type="submit"
              className="w-full rounded-lg bg-[#2d5f5d] py-3 text-base font-semibold text-[#ffffff] transition-colors hover:bg-[#245250]"
            >
              Login
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-4 rounded-lg bg-[#ffffff]/5 p-3 text-xs text-[#ffffff]/60">
            <p className="font-semibold text-[#c8a96e]">Demo Account:</p>
            <p>Email: test@example.com | Password: 123456</p>
          </div>

          {/* Link to register */}
          <p className="mt-6 text-center text-sm text-[#ffffff]/70">
            {"Chua co tai khoan? "}
            <Link
              href="/dang-ky"
              className="font-medium text-[#c8a96e] underline-offset-2 hover:underline"
            >
              {"Dang ky ngay"}
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
