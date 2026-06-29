import { HeroSection } from './sections/HeroSection';
import { Marquee } from './sections/Marquee';
import { TechStackBar } from './sections/TechStackBar';
import { FeaturesSection } from './sections/FeaturesSection';
import { HowItWorksSection } from './sections/HowItWorksSection';
import { StatsSection } from './sections/StatsSection';
import { ShowcaseSection } from './sections/ShowcaseSection';
import { TestimonialsSection } from './sections/TestimonialsSection';
import { FAQSection } from './sections/FAQSection';
import { FooterSection } from './sections/FooterSection';
import { AuroraBackground } from '../../components/ui/AuroraBackground';
import { GrainOverlay } from '../../components/ui/GrainOverlay';

export function Landing() {
  return (
    <div className="min-h-screen bg-surface text-white overflow-x-hidden">
      {/* ── Ambient background: calm aurora mesh + film grain (alethia-style) ── */}
      <div className="fixed inset-0 grid-bg pointer-events-none opacity-40" style={{ zIndex: 0 }} />
      <AuroraBackground />
      <GrainOverlay />

      {/* ── Sections ── */}
      <HeroSection />
      <Marquee />
      <TechStackBar />

      <FeaturesSection />
      <HowItWorksSection />
      <StatsSection />
      <ShowcaseSection />
      <TestimonialsSection />
      <FAQSection />
      <FooterSection />
    </div>
  );
}
