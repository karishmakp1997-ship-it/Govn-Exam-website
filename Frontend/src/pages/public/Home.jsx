import { useScrollReveal } from '../../hooks/useScrollReveal';
import Hero from '../../components/home/Hero';
import ExamsMatchingProfile from '../../components/home/ExamsMatchingProfile';
import HowItWorks from '../../components/home/HowItWorks';
import FeaturesGrid from '../../components/home/FeaturesGrid';
import MockTestTeaser from '../../components/home/MockTestTeaser';
import LatestUpdates from '../../components/home/LatestUpdates';
import PreparationMaterials from '../../components/home/PreparationMaterials';
import Testimonials from '../../components/home/Testimonials';
import PricingPreview from '../../components/home/PricingPreview';
import FinalCTA from '../../components/home/FinalCTA';

function Home() {
  useScrollReveal();

  return (
    <>
      <Hero />
      <ExamsMatchingProfile />
      <HowItWorks />
      <FeaturesGrid />
      <MockTestTeaser />
      <LatestUpdates />
      <PreparationMaterials />
      <Testimonials />
      <PricingPreview />
      <FinalCTA />
    </>
  );
}

export default Home;