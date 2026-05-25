import { Benefits } from "@/components/home/Benefits";
import { Footer } from "@/components/home/Footer";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Navbar } from "@/components/home/Navbar";
import { SolarSimulation } from "@/components/home/SolarSimulation";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Benefits />
        <HowItWorks />
        <SolarSimulation />
      </main>
      <Footer />
    </>
  );
}
