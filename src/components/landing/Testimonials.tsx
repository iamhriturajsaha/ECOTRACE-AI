"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "EcoTrace AI completely changed how I view my daily habits. The AI insights are incredibly specific and actually doable.",
    author: "Sarah J.",
    role: "UX Designer",
  },
  {
    quote: "The visualizer makes it so satisfying to see my footprint shrink. The gamification aspect keeps me coming back every day.",
    author: "Michael T.",
    role: "Software Engineer",
  },
  {
    quote: "Beautiful interface, seamless experience. It feels like a premium app while solving one of the world's biggest problems.",
    author: "Elena R.",
    role: "Product Manager",
  },
];

export function Testimonials() {
  // Duplicate array 4 times to create a robust seamless loop
  const infiniteTestimonials = [...testimonials, ...testimonials, ...testimonials, ...testimonials];

  return (
    <section className="py-32 bg-muted/10 backdrop-blur-sm overflow-hidden relative z-10">
      <div className="container mx-auto px-4 relative z-10 mb-16">
        <h2 className="text-4xl md:text-5xl font-black text-center tracking-tight text-foreground">Loved by sustainability <span className="text-emerald-500">enthusiasts</span></h2>
      </div>

      <div className="relative w-full overflow-hidden flex">
        {/* Gradient Masks */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-muted/20 to-transparent z-20 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-muted/20 to-transparent z-20 pointer-events-none"></div>

        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 60, ease: "linear", repeat: Infinity }}
          className="flex gap-8 w-max px-4"
        >
          {infiniteTestimonials.map((testimonial, i) => (
            <div
              key={i}
              className="w-[350px] sm:w-[400px] p-8 rounded-[2rem] bg-card/50 backdrop-blur-md border border-white/10 shadow-lg relative flex-shrink-0"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, idx) => (
                  <Star key={idx} className="h-5 w-5 fill-emerald-500 text-emerald-500 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                ))}
              </div>
              <p className="text-lg mb-8 italic text-foreground/90 leading-relaxed">"{testimonial.quote}"</p>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                  {testimonial.author.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-foreground">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
