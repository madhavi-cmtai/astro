import HeroSection from "@/components/home/hero-section";
import CardSection  from "@/components/home/card-section";
import AboutSection from "@/components/home/about-section";
import WhyChooseUsSection from "@/components/home/why-choose-us";
import TestimonialSection from "@/components/home/testimonial-section";
import ContactSection from "@/components/home/contact-section";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <div className="min-h-screen flex flex-col items-center justify-center overflow-hidden ">
      <CardSection/>
      <AboutSection />
      <WhyChooseUsSection />
      <TestimonialSection />
      <ContactSection />
      </div>
    </div>
  );  
}
