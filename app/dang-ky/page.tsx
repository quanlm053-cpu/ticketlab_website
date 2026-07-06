"use client";

import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const register = useAuthStore((state) => state.register);

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
      {/* Dark overlay */}
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
            {"Dang Ky"}
          </h1>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setError("");

              if (password !== confirmPassword) {
                setError("Passwords do not match");
                return;
              }

              try {
                await register(name, email, password);
                router.push("/");
              } catch (err) {
                setError(
                  err instanceof Error ? err.message : "Registration failed"
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

            {/* Full name */}
            <div className="relative">
              <input
                type="text"
                placeholder={"Ho va Ten"}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-lg border border-[#ffffff]/30 bg-[#ffffff]/10 px-4 py-3 pr-12 text-[#ffffff] placeholder-[#ffffff]/60 outline-none transition-colors focus:border-[#c8a96e] focus:ring-1 focus:ring-[#c8a96e]"
              />
              <User className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#ffffff]/50" />
            </div>

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
                placeholder={"Mat Khau"}
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

            {/* Confirm password */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder={"Nhap lai mat khau"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-[#ffffff]/30 bg-[#ffffff]/10 px-4 py-3 pr-12 text-[#ffffff] placeholder-[#ffffff]/60 outline-none transition-colors focus:border-[#c8a96e] focus:ring-1 focus:ring-[#c8a96e]"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#ffffff]/50 transition-colors hover:text-[#ffffff]/80"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Lock className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Terms checkbox */}
            <label className="flex cursor-pointer items-start gap-3 text-sm text-[#ffffff]/70">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[#2d5f5d]"
              />
              <span>
                {"Toi da doc va chap nhan dong y "}
                <a
                  href="#"
                  className="font-medium text-[#c8a96e] underline-offset-2 hover:underline"
                >
                  {"Dieu khoan & dieu kien"}
                </a>
              </span>
            </label>

            {/* Divider */}
            <div className="my-1 h-px bg-[#ffffff]/20" />

            {/* Submit */}
            <button
              type="submit"
              disabled={!agreed}
              className="w-full rounded-lg bg-[#2d5f5d] py-3 text-base font-semibold text-[#ffffff] transition-colors hover:bg-[#245250] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {"Dang ky"}
            </button>
          </form>

          {/* Link to login */}
          <p className="mt-6 text-center text-sm text-[#ffffff]/70">
            {"Da co tai khoan? "}
            <Link
              href="/dang-nhap"
              className="font-medium text-[#c8a96e] underline-offset-2 hover:underline"
            >
              {"Dang nhap"}
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
