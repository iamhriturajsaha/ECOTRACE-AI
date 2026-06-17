"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { AnimatedLogo } from "@/components/ui/AnimatedLogo";
import { Mail, Lock, User } from "lucide-react";

export default function UnifiedAuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"login" | "register">("login");
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    await signIn("google", { callbackUrl: "/home" });
  };

  const handleCredentialsAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;

    if (mode === "register") {
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to register");
        }

        // Auto login after successful registration
        const signInRes = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });

        if (signInRes?.error) throw new Error("Failed to auto-login");
        router.push("/home");
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setIsLoading(false);
      }
    } else {
      // Login mode
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError(res.error);
        setIsLoading(false);
      } else {
        router.push("/home");
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <AnimatedBackground />
      
      <div className="w-full max-w-md space-y-8 p-10 bg-card/60 backdrop-blur-xl rounded-3xl border border-white/10 shadow-[0_0_25px_rgba(52,211,153,0.3)] relative z-10">
        <div className="flex flex-col items-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl animate-pulse" />
            <div className="relative flex items-center justify-center p-4">
              <AnimatedLogo size={96} />
            </div>
          </div>
          
          <h2 className="mt-2 text-center text-3xl font-extrabold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-600">
            {mode === "login" ? "Welcome Back" : "Join EcoTrace AI"}
          </h2>
          <p className="mt-3 text-center text-sm text-muted-foreground font-medium">
            {mode === "login" ? "Sign in to continue your journey." : "Understand, track, and reduce your footprint."}
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex bg-background/50 border border-white/5 p-1 rounded-xl">
          <button
            onClick={() => { setMode("login"); setError(""); }}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${mode === "login" ? "bg-card shadow-lg border border-white/10 text-emerald-400" : "text-muted-foreground hover:text-foreground"}`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode("register"); setError(""); }}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${mode === "register" ? "bg-card shadow-lg border border-white/10 text-emerald-400" : "text-muted-foreground hover:text-foreground"}`}
          >
            Register
          </button>
        </div>
        
        <form onSubmit={handleCredentialsAuth} className="mt-8 space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 text-red-400 text-sm font-medium rounded-xl border border-red-500/20">
              {error}
            </div>
          )}

          {mode === "register" && (
            <div className="relative">
              <User className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
              <input
                name="name"
                type="text"
                required
                className="w-full h-12 pl-10 pr-4 rounded-xl border border-white/10 bg-background/50 text-foreground focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-muted-foreground/50"
                placeholder="Full Name"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
            <input
              name="email"
              type="email"
              required
              className="w-full h-12 pl-10 pr-4 rounded-xl border border-white/10 bg-background/50 text-foreground focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-muted-foreground/50"
              placeholder="Email address"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
            <input
              name="password"
              type="password"
              required
              className="w-full h-12 pl-10 pr-4 rounded-xl border border-white/10 bg-background/50 text-foreground focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-muted-foreground/50"
              placeholder="Password"
            />
          </div>

          <Button 
            type="submit"
            disabled={isLoading}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-lg hover:from-emerald-600 hover:to-emerald-700 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all"
          >
            {isLoading ? "Please wait..." : (mode === "login" ? "Sign In" : "Create Account")}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-card/60 text-muted-foreground">Or</span>
          </div>
        </div>

        <Button 
          type="button"
          className="w-full flex items-center justify-center gap-3 h-12 rounded-xl bg-card text-foreground border border-white/10 hover:bg-card/80 shadow-sm transition-all duration-200 hover:-translate-y-0.5 group" 
          variant="outline"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:scale-110 transition-transform duration-200">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span className="font-semibold text-base">Continue with Google</span>
        </Button>
      </div>
    </div>
  );
}
