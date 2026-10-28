import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AboutSection from "@/components/AboutSection";
import MarketsSection from "@/components/MarketsSection";
import HeroSection from "@/components/HeroSection";
import handsBg from "@/assets/hands_clay_objects_clean_skin.jpg";
import { usePageMeta } from "@/hooks/usePageMeta";

const About = () => {
  const { t } = useLanguage();
  const { forceDark } = useTheme();

  usePageMeta({
    title: t.about.title,
    description: t.about.body,
    path: "/about",
  });

  useEffect(() => {
    forceDark(true);
    return () => forceDark(false);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <AboutSection />

      <MarketsSection />

      <HeroSection bgImageSrc={handsBg} showMessageCard hideAboutLink hideDescription />

      <Footer />
    </div>
  );
};

export default About;
