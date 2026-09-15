import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import HeroSlider from "@/components/sections/hero-slider";
import ProductShowcase from "@/components/sections/product-showcase";
import InfoSections from "@/components/sections/info-sections";
import DiscountGenerator from "@/components/sections/discount-generator";
import SchoolRegistration from "@/components/sections/school-registration";
import FaqSection from "@/components/sections/faq-section";
import AnimateOnScroll from "@/components/animate-on-scroll";
import BookDemoModal from "@/components/book-demo-modal";

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh">
      <Header />
      <main className="flex-1">
        <HeroSlider />
        <AnimateOnScroll>
          <ProductShowcase />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <InfoSections />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <DiscountGenerator />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <SchoolRegistration />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <FaqSection />
        </AnimateOnScroll>
      </main>
      <Footer />
      <BookDemoModal />
    </div>
  );
}
