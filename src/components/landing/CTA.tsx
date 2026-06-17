"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-green-600"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-green-500/50 via-green-600 to-green-700"></div>
      <div className="container relative mx-auto px-4 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl"
        >
          <h2 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">Ready to make a difference?</h2>
          <p className="mb-10 text-xl text-white/80">
            Join thousands of users who are already reducing their carbon footprint and building a sustainable future.
          </p>
          <Link href="/dashboard">
            <Button size="lg" variant="secondary" className="h-16 px-10 text-xl font-bold text-green-700 hover:text-green-800 rounded-2xl bg-white hover:bg-gray-50 shadow-2xl hover:shadow-white/20 hover:-translate-y-1 transition-all">
              Start Your Journey <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
