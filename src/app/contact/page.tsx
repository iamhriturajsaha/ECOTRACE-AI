"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      // Reset after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-32 max-w-2xl">
        <div className="space-y-12">
          <div className="text-center space-y-6">
            <h1 className="text-5xl font-black tracking-tight text-foreground">Get in <span className="text-emerald-500">Touch</span></h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Have questions about our enterprise plans, API integrations, or just want to say hi? We'd love to hear from you.
            </p>
          </div>
          
          <div className="p-8 rounded-3xl bg-card border shadow-sm relative overflow-hidden">
            {isSubmitted ? (
              <div className="absolute inset-0 bg-emerald-50/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
                <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-emerald-800 mb-2">Message Sent!</h3>
                <p className="text-emerald-600/80 font-medium">Thank you for reaching out. Our team will get back to you shortly.</p>
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-6 relative z-0">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <input required type="text" className="w-full h-12 px-4 rounded-xl border bg-background text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <input required type="email" className="w-full h-12 px-4 rounded-xl border bg-background text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="john@example.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <textarea required className="w-full h-32 p-4 rounded-xl border bg-background text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none" placeholder="How can we help you?"></textarea>
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full h-12 text-lg rounded-xl font-bold transition-all">
                {isSubmitting ? "Sending..." : (
                  <>
                    Send Message <Send className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
