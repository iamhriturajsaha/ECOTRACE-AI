import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { CarbonVisualizer } from "@/components/landing/CarbonVisualizer";
import { Testimonials } from "@/components/landing/Testimonials";
import { CTA } from "@/components/landing/CTA";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen relative">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <CarbonVisualizer />
        <Features />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
