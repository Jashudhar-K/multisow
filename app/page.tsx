import HeroSection from '@/components/landing/HeroSection';
import StrataSection from '@/components/landing/StrataSection';
import FohemSection from '@/components/landing/FohemSection';
import { MetricsSection, TrustSection } from '@/components/landing/LandingSections';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import PresetsSection from '@/components/landing/PresetsSection';
import ExplainSection from '@/components/landing/ExplainSection';
import CTASection from '@/components/landing/CTASection';

export const dynamic = 'force-static';
export const revalidate = 3600;

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
