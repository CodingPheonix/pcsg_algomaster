import Image from "next/image";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import { prisma } from "./db/prisma";

// console.log(process.env.DATABASE_HOST)
// console.log(process.env.DATABASE_USER)
// console.log(process.env.DATABASE_PASSWORD)
// console.log(process.env.DATABASE_NAME)

(async () => {
  try {
    await prisma.$connect();
    console.log("✅ DB connection successful");
  } catch (err) {
    console.error("❌ DB connection failed:", err);
  } finally {
    await prisma.$disconnect();
  }
})();

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
