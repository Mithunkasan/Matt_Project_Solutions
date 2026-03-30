"use client";

import { useSession } from "next-auth/react";
import { HeroSection } from "@/components/landing/HeroSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { MissionVisionSection } from "@/components/landing/MissionVisionSection";
import { ServicesSection } from "@/components/landing/ServicesSection";
import { DomainsSection } from "@/components/landing/DomainsSection";
import { WhyChooseUsSection } from "@/components/landing/WhyChooseUsSection";
import { WhoWeServeSection } from "@/components/landing/WhoWeServeSection";
import { FinalCTASection } from "@/components/landing/FinalCTASection";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { FloatingActions } from "@/components/ui/FloatingActions";

export default function LandingPage() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950 transition-colors">
      <HeroSection session={session} />
      <StatsSection />
      <MissionVisionSection />
      <ServicesSection />
      <DomainsSection />
      <WhyChooseUsSection />
      <WhoWeServeSection />
      <FinalCTASection />
      <LandingFooter />
      <FloatingActions />
    </div>
  );
}