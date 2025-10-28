import Hero from "@/sections/Hero";
import Pricing from "@/sections/Pricing";
import HowItWork from "@/sections/HowItWork";
import About from "@/sections/About";
import SimpleStep from "@/sections/SimpleStep";
import CTA from "@/sections/CTA";
import Testimonials from "@/sections/Testimonail";
import FAQ from "@/sections/FAQ";

export default function Home() {
  return (
    <>
      <Hero />
      <HowItWork />
      <About />
      <SimpleStep />
      <CTA />
      <Testimonials />
      <Pricing />
      <FAQ />
    </>
  );
}
