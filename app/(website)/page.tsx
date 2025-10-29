import HeroSection from "@/components/website/home/hero-section";
import IndustryWeServe from "@/components/website/home/industry-we-serve";  
import AllInOne from "@/components/website/home/all-iin-one";
import Testimonial from "@/components/website/home/testimonial";
import WhyChooseUs from "@/components/website/home/why-choose-us";
import HowWeAre from "@/components/website/home/how-we-are";
import VehicleMarquee from '@/components/website/home/vehicle-marquee';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home | Location Track",
  description: "Home Page",
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <HowWeAre />
      <WhyChooseUs />
      <AllInOne />
      <VehicleMarquee />
      <IndustryWeServe />
      <Testimonial />
    </>
  );
} 