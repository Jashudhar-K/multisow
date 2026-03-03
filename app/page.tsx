import HeroSection from '@/components/landing/HeroSection';
import StrataSection from '@/components/landing/StrataSection';
import FohemSection from '@/components/landing/FohemSection';
import MetricsSection from '@/components/landing/MetricsSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import PresetsSection from '@/components/landing/PresetsSection';
import ExplainSection from '@/components/landing/ExplainSection';
import TrustSection from '@/components/landing/TrustSection';
import CTASection from '@/components/landing/CTASection';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <StrataSection />
      <FohemSection />
      <MetricsSection />
      <HowItWorksSection />
      <PresetsSection />
      <ExplainSection />
      <TrustSection />
      <CTASection />
    </div>
  );
}
