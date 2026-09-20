import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-32 max-w-4xl">
        <div className="space-y-12">
          <div className="text-center space-y-6">
            <h1 className="text-5xl font-black tracking-tight text-foreground">About <span className="text-emerald-500">EcoTrace AI</span></h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              We are on a mission to empower individuals and organizations to understand, track, and reduce their carbon footprint through the power of artificial intelligence.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Our Vision</h2>
              <p className="text-muted-foreground">
                To create a world where environmental impact is transparent, actionable, and seamlessly integrated into daily decision-making for millions of people.
              </p>
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">The Technology</h2>
              <p className="text-muted-foreground">
                Powered by cutting-edge generative AI and massive environmental datasets, EcoTrace provides personalized recommendations that are tailored specifically to your lifestyle and local environment.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
