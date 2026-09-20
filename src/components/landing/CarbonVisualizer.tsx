/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useState, useEffect } from "react";
import { ShieldCheck, Zap, BarChart3 } from "lucide-react";

const data = [
  { name: "Jan", user: 400, average: 500 },
  { name: "Feb", user: 300, average: 500 },
  { name: "Mar", user: 200, average: 500 },
  { name: "Apr", user: 278, average: 500 },
  { name: "May", user: 189, average: 500 },
  { name: "Jun", user: 239, average: 500 },
];

export function CarbonVisualizer() {
  const [mounted, setMounted] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-500, 500], [15, -15]);
  const rotateY = useTransform(x, [-500, 500], [-15, 15]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - rect.width / 2;
    const mouseY = e.clientY - rect.top - rect.height / 2;
    x.set(mouseX);
    y.set(mouseY);
  };

  if (!mounted) return null;

  return (
    <section className="py-32 relative overflow-hidden bg-background/50 backdrop-blur-sm z-10">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/5 via-background to-background"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 space-y-8"
          >
            <div className="inline-flex items-center rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-sm font-semibold text-accent">
              <BarChart3 className="mr-2 h-4 w-4" />
              Real-time Analytics
            </div>
            <h2 className="text-5xl font-black tracking-tight sm:text-6xl text-foreground">
              Visualize your <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">progress.</span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Our intuitive dashboard lets you see exactly how your lifestyle changes impact your carbon footprint over time compared to the average person.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">Verified Data</h4>
                  <p className="text-sm text-muted-foreground">Backed by global environmental databases.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-accent/10 text-accent">
                  <Zap className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">Actionable Insights</h4>
                  <p className="text-sm text-muted-foreground">AI-generated tips to lower emissions.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <div 
            className="flex-1 w-full max-w-2xl perspective-1000"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => {
              x.set(0);
              y.set(0);
            }}
            style={{ perspective: 1000 }}
          >
            <motion.div 
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative p-1 rounded-3xl bg-gradient-to-br from-primary/30 to-accent/30 backdrop-blur-xl shadow-2xl"
            >
              {/* Inner Dashboard Glass Container */}
              <div className="relative h-[400px] p-6 sm:p-8 rounded-[22px] bg-card/80 backdrop-blur-3xl border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none"></div>
                
                {/* Mock Header */}
                <div className="flex items-center justify-between mb-8 relative z-10">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Carbon Trajectory</h3>
                    <p className="text-sm text-muted-foreground">You vs. National Average</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-full">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                      You
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground"></div>
                      Avg
                    </span>
                  </div>
                </div>

                <div className="h-[250px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUser" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAverage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#64748b" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#64748b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '8px', border: '1px solid var(--border)' }}
                  itemStyle={{ color: 'var(--foreground)' }}
                />
                <Area type="monotone" dataKey="average" stroke="#64748b" fillOpacity={1} fill="url(#colorAverage)" />
                <Area type="monotone" dataKey="user" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorUser)" />
              </AreaChart>
            </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
