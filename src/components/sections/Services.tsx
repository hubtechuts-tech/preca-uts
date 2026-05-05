import PrecaPricingSection from "@/components/ui/preca-pricing-section";

export function Services() {
  return (
    <section id="services" className="bg-gradient-to-b from-muted/30 to-muted/60 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <PrecaPricingSection />
    </section>
  );
}
