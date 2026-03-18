"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { NavbarAuthenticated } from "@/components/navbar-authenticated";
import { HeroSection } from "@/components/hero-section";
import { TrendingBanner } from "@/components/trending-banner";
import { EventsSection } from "@/components/events-section";
import { Footer } from "@/components/footer";

export default function AuthenticatedHomePage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/dang-nhap");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="min-h-screen">
      <NavbarAuthenticated />
      <HeroSection />
      <TrendingBanner />
      <EventsSection />
      <Footer />
    </main>
  );
}
