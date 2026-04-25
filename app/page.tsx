import HeroSection from "@/components/sections/HeroSection";
import StripBanner from "@/components/sections/StripBanner";
import ServicesSection from "@/components/sections/ServicesSection";
import WhyUsSection from "@/components/sections/WhyUsSection";
import GalleryPreviewSection from "@/components/sections/GalleryPreviewSection";
import AdsSection from "@/components/sections/AdsSection";
import ProcessSection from "@/components/sections/ProcessSection";
import ReviewsSection from "@/components/sections/ReviewsSection";
import ContactSection from "@/components/sections/ContactSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StripBanner />
      <ServicesSection />
      <AdsSection />
      <WhyUsSection />
      <GalleryPreviewSection />
      <ProcessSection />
      <ReviewsSection />
      <ContactSection />
    </>
  );
}
