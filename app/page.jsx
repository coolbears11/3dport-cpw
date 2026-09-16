import SiteNavigation from "@/components/SiteNavigation";
import HeroVideo from "@/components/HeroVideo";
import DividerSection from "@/components/DividerSection";
import ThreeExperience from "@/components/ThreeExperience";
import SystemsSection from "@/components/SystemsSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <SiteNavigation />
      <main>
        <HeroVideo />
        <DividerSection />
        <ThreeExperience />
        <SystemsSection />
        <Footer />
      </main>
    </>
  );
}
