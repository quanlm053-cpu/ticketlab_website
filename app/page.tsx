"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { TrendingBanner } from "@/components/trending-banner";
import { EventsSection } from "@/components/events-section";
import { Footer } from "@/components/footer";

export default function Home() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/trang-chu");
    }
  }, [isAuthenticated, router]);

  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <TrendingBanner />
      <EventsSection />
      <Footer />
    </main>
  );
}
