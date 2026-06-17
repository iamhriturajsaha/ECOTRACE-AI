/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react-hooks/set-state-in-effect, react/no-unescaped-entities */
"use client";

import { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Leaf, TreePine, Droplet, Search, ShieldCheck, Cpu, Loader2, CheckCircle2 } from "lucide-react";
import { AnimatedLogo } from "@/components/ui/AnimatedLogo";

export function Hero() {
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // Parallax & Cursor tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for the cursor follower
  const smoothMouseX = useSpring(mouseX, { stiffness: 150, damping: 15, mass: 0.5 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 150, damping: 15, mass: 0.5 });

  const rotateX = useTransform(mouseY, [-500, 500], [15, -15]);
  const rotateY = useTransform(mouseX, [-500, 500], [-15, 15]);

  // Antigravity physics transformations
  const icon1X = useTransform(smoothMouseX, v => -v * 0.05);
  const icon1Y = useTransform(smoothMouseY, v => -v * 0.05);
  const icon2X = useTransform(smoothMouseX, v => -v * 0.08);
  const icon2Y = useTransform(smoothMouseY, v => -v * 0.08);
  const icon3X = useTransform(smoothMouseX, v => -v * 0.06);
  const icon3Y = useTransform(smoothMouseY, v => -v * 0.06);
  const icon4X = useTransform(smoothMouseX, v => -v * 0.1);
  const icon4Y = useTransform(smoothMouseY, v => -v * 0.1);

  // Motion sensor constraint for the Xenomorph sphere
  const sphereX = useTransform(smoothMouseX, v => v * 0.1);
  const sphereY = useTransform(smoothMouseY, v => v * 0.1);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  useEffect(() => {
    setMounted(true);
    setParticles(
      Array.from({ length: 5 }).map((_, i) => ({
        id: i,
        width: Math.random() * 300 + 100,
        height: Math.random() * 300 + 100,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        x: [0, Math.random() * 100 - 50, 0],
        y: [0, Math.random() * 100 - 50, 0],
        duration: Math.random() * 10 + 10,
      }))
    );
  }, []);

  const [resultData, setResultData] = useState<{emissions: number, recommendation: string} | null>(null);

  const handleCalculate = async (e?: React.FormEvent, overrideQuery?: string) => {
    if (e) e.preventDefault();
    const queryToUse = overrideQuery || query;
    if (!queryToUse.trim()) return;
    
    setIsCalculating(true);
    setShowResult(false);
    setResultData(null);
    
    try {
      const res = await fetch("/api/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: queryToUse })
      });
      
      if (!res.ok) throw new Error("Failed to calculate");
      
      const data = await res.json();
      setResultData(data);
    } catch (error) {
      console.error(error);
      // Fallback display if error
      setResultData({ emissions: 0, recommendation: "Error calculating emissions" });
    } finally {
      setIsCalculating(false);
      setShowResult(true);
    }
  };

  const handlePillClick = (text: string) => {
    setQuery(text);
    handleCalculate(undefined, text);
  };

  return (
    <section 
      className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-32 bg-transparent min-h-screen"
      style={{ perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        mouseX.set(0);
        mouseY.set(0);
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background/20 to-background/50 pointer-events-none"></div>
      
      {/* Interactive Cursor Follower (Xenomorph Sphere) */}
      {mounted && (
        <motion.div 
          className="pointer-events-none absolute left-1/2 top-1/2 z-0 hidden md:block"
          style={{ x: sphereX, y: sphereY }}
        >
          <div 
            className="absolute -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] rounded-full mix-blend-normal"
            style={{
              background: "radial-gradient(circle at 35% 25%, #10b981 0%, #064e3b 15%, #0f172a 40%, #020617 80%, #000000 100%)",
              boxShadow: "inset -40px -40px 80px rgba(0,0,0,0.9), inset 20px 20px 50px rgba(255,255,255,0.15), inset 0 0 20px rgba(16,185,129,0.3), 0 0 100px rgba(16,185,129,0.2)",
              filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.8))"
            }}
          />
        </motion.div>
      )}

      {/* Animated floating particles in background */}
      {mounted && (
        <>
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            {particles.map((p) => (
              <motion.div
                key={p.id}
                className="absolute bg-primary/20 rounded-full blur-3xl"
                style={{ width: p.width, height: p.height, left: p.left, top: p.top }}
                animate={{ x: p.x, y: p.y }}
                transition={{ duration: p.duration, repeat: Infinity, ease: "linear" }}
              />
            ))}
          </div>
          
          {/* Floating Eco Icons with slight magnetic repulsion from cursor */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40 z-0">
            <motion.div 
              className="absolute left-[10%] top-[20%] text-primary"
              style={{ x: icon1X, y: icon1Y }}
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            >
              <Leaf size={48} />
            </motion.div>
            <motion.div 
              className="absolute right-[15%] top-[15%] text-emerald-500"
              style={{ x: icon2X, y: icon2Y }}
              animate={{ rotate: [0, -15, 10, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            >
              <TreePine size={64} />
            </motion.div>
            <motion.div 
              className="absolute left-[20%] bottom-[20%] text-accent"
              style={{ x: icon3X, y: icon3Y }}
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            >
              <Droplet size={40} />
            </motion.div>
            <motion.div 
              className="absolute right-[20%] bottom-[30%] text-primary"
              style={{ x: icon4X, y: icon4Y }}
              animate={{ rotate: [0, -10, 15, 0] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            >
              <Leaf size={56} />
            </motion.div>
          </div>
        </>
      )}

      <div className="container relative mx-auto px-4 text-center z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="mx-auto flex justify-center mb-8"
        >
          <motion.div 
            className="relative"
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          >
            <div className="absolute inset-0 bg-primary/30 rounded-full blur-3xl animate-pulse transform -translate-z-10" />
            <div className="relative z-10 hover:scale-105 transition-transform duration-300 drop-shadow-2xl cursor-pointer">
              <AnimatedLogo size={256} />
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.1, ease: "easeOut" }}
          className="mx-auto max-w-4xl"
        >
          <div className="mb-6 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary backdrop-blur-sm shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <Leaf className="mr-2 h-4 w-4" />
            AI-Powered Sustainability
          </div>
          <h1 className="mb-6 text-6xl font-black tracking-tighter sm:text-7xl lg:text-8xl text-foreground">
            Your Carbon Footprint, <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-400 to-accent drop-shadow-sm">
              Solved.
            </span>
          </h1>
          <p className="mb-10 text-xl text-muted-foreground sm:text-2xl font-medium max-w-2xl mx-auto leading-relaxed">
            The enterprise-grade platform to calculate, analyze, and offset your emissions with intelligent AI insights.
          </p>
          
          {/* Functional Google-style Omnibox */}
          <div className="max-w-2xl mx-auto mb-12 relative z-20">
            <form onSubmit={handleCalculate} className="relative flex items-center w-full h-16 rounded-full bg-white border border-gray-200 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_25px_-4px_rgba(0,0,0,0.15)] transition-shadow duration-300 px-6 group focus-within:border-emerald-400 focus-within:ring-4 focus-within:ring-emerald-400/20">
              <Search className="h-6 w-6 text-gray-400 mr-3" />
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-lg text-gray-900 placeholder:text-gray-400"
                placeholder="Ask EcoTrace AI: 'Flight from NY to LA'..."
              />
              <div className="hidden sm:flex items-center gap-2">
                <Button 
                  type="submit" 
                  onClick={(e) => handleCalculate(e)}
                  disabled={isCalculating || !query.trim()}
                  className="rounded-full bg-primary hover:bg-primary/90 shadow-md ml-2 px-6 font-bold"
                >
                  {isCalculating ? <Loader2 className="h-5 w-5 animate-spin" /> : "Calculate"}
                </Button>
              </div>
            </form>
            
            {/* Action Pills */}
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              {["Recent trip", "Weekly commute", "Monthly electricity"].map((pill) => (
                <button 
                  key={pill}
                  onClick={() => handlePillClick(pill)}
                  className="px-4 py-1.5 rounded-full bg-card/60 backdrop-blur-md border border-white/10 text-sm font-medium text-muted-foreground hover:bg-card hover:text-emerald-400 hover:border-emerald-500/50 transition-all shadow-sm hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                >
                  {pill}
                </button>
              ))}
            </div>
          </div>

          {/* Google Integrations */}
          <div className="mt-16 pt-8 border-t border-border/50">
            <p className="text-sm font-semibold text-muted-foreground mb-6 uppercase tracking-wider">Works seamlessly with your ecosystem</p>
            <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
              <Link href="https://maps.google.com" target="_blank" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all hover:scale-105 grayscale hover:grayscale-0 cursor-pointer">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="font-semibold text-sm">Google Maps</span>
              </Link>
              <Link href="https://fit.google.com" target="_blank" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all hover:scale-105 grayscale hover:grayscale-0 cursor-pointer">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="font-semibold text-sm">Google Fit</span>
              </Link>
              <Link href="https://workspace.google.com" target="_blank" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all hover:scale-105 grayscale hover:grayscale-0 cursor-pointer">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="font-semibold text-sm">Workspace</span>
              </Link>
            </div>
            
            <div className="mt-8 flex items-center justify-center gap-2 text-xs font-semibold text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              PROTECTED BY ENTERPRISE-GRADE SECURITY
            </div>
          </div>
        </motion.div>
      </div>

      {/* AI Processing Modal Overlay */}
      <AnimatePresence>
        {(isCalculating || showResult) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md px-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-card w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden"
            >
              <div className="p-8 text-center space-y-6">
                {isCalculating ? (
                  <>
                    <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
                      <div className="absolute inset-0 border-4 border-emerald-100 rounded-full"></div>
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent"
                      ></motion.div>
                      <Cpu className="h-10 w-10 text-emerald-600 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-2">EcoTrace AI is analyzing...</h3>
                      <p className="text-muted-foreground">Running highly scalable emission calculations on your query: <br/><span className="font-semibold text-foreground">"{query}"</span></p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mx-auto w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-2">Analysis Complete</h3>
                      <div className="p-4 bg-muted rounded-2xl mb-6 text-left space-y-3">
                        <div className="flex justify-between items-center border-b pb-2">
                          <span className="text-sm text-muted-foreground">Estimated Emissions</span>
                          <span className="font-bold text-lg text-rose-500">{resultData?.emissions || 0} kg CO₂</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">AI Recommendation</span>
                          <span className="font-bold text-sm text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">{resultData?.recommendation || "N/A"}</span>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <Button variant="outline" className="flex-1 rounded-xl h-12" onClick={() => setShowResult(false)}>
                          Close
                        </Button>
                        <Link href="/dashboard" className="flex-1">
                          <Button className="w-full rounded-xl h-12 bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-emerald-500/20">
                            Save to Profile
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
