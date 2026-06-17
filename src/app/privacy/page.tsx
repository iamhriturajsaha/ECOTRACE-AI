import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="flex min-h-screen flex-col relative overflow-hidden bg-background">
      {/* Background Gradient */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background/20 to-background/50 pointer-events-none -z-10" />

      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-32 max-w-4xl relative z-10">
        <div className="bg-card/80 backdrop-blur-md rounded-3xl p-8 md:p-12 border shadow-sm">
          <h1 className="text-4xl md:text-5xl font-black mb-6 text-foreground tracking-tight">Privacy Policy</h1>
          <p className="text-muted-foreground mb-10 font-medium">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="space-y-8 text-muted-foreground leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">1. Information We Collect</h2>
              <p>We collect information you provide directly to us when you create an account, update your profile, or use our intelligent carbon-tracking features. This may include your name, email address, and transportation data.</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">2. How We Use Your Information</h2>
              <p>We use the information we collect to operate our AI platform, provide intelligent recommendations, maintain your personal dashboard, and secure our systems.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">3. Data Security</h2>
              <p>EcoTrace AI relies on enterprise-grade security. We use encryption (like bcrypt) and secure protocols to protect your personal data from unauthorized access or alteration.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">4. Third-Party Integrations</h2>
              <p>If you choose to link third-party services (such as Google Fit or Maps), we only process the data explicitly authorized by you and required for footprint calculation.</p>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
