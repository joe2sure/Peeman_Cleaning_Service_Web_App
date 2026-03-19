import HeroSection from "@/components/sections/HeroSection";
import ServicesSection from "@/components/sections/ServicesSection";
import WhyUsSection from "@/components/sections/WhyUsSection";
import ProcessSection from "@/components/sections/ProcessSection";
import ReviewsSection from "@/components/sections/ReviewsSection";
import ContactSection from "@/components/sections/ContactSection";
import StripBanner from "@/components/sections/StripBanner";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StripBanner />
      <ServicesSection />
      <WhyUsSection />
      <ProcessSection />
      <ReviewsSection />
      <ContactSection />
    </>
  );
}
