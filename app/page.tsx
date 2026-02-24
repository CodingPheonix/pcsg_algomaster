import Image from "next/image";
import Navbar from "./conponents/Navbar";
import HeroSection from "./conponents/HeroSection";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
      </main>
    </>
  );
}
