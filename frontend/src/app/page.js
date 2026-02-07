import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/ui/header";
import { Herosection } from "@/components/ui/herosection";
import { Features } from "@/components/ui/features";
import { Works } from "@/components/ui/howitworks";
import { Pricing } from "@/components/ui/pricing";
import { Section } from "@/components/ui/section";
import { Faq } from "@/components/faq";
import { Footer } from "@/components/ui/footer";

export default function LandingPage() {
  return (
    <div className="bg-white text-black min-h-screen">
      <Header />
      {/* Hero Section with Background SVG */}
      <Herosection />

      {/* Features Section */}
      <Features />

      {/* How It Works Section */}
      <Works />
      {/* Pricing Section */}
      <Pricing />

      {/* Testimonial Section */}
      <Section />

      {/* FAQ Section */}
      <Faq />

      {/* CTA Section */}
      <section className="container mx-auto py-20 text-center">
        <h2 className="text-4xl font-bold mb-6 tracking-tight leading-none">
          Ready to Boost Your X Presence?
        </h2>
        <p className="text-xl font-light tracking-tighter text-gray-400 mb-8 max-w-2xl mx-auto">
          Join thousands of successful businesses and startups who have
          transformed their X marketing with XBoost.
        </p>
        <Button size="lg" className="bg-blue-500 hover:bg-blue-600">
          Start Your Free Trial
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
