"use client";

import Link from "next/link";
import { Leaf, LogOut } from "lucide-react";
import { buttonVariants, Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-4">
        <div className="mr-4 flex">
          <Link href="/home" className="mr-6 flex items-center space-x-2">
            <Leaf className="h-6 w-6 text-green-500" />
            <span className="hidden font-bold sm:inline-block">EcoTrace AI</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/home#features" className="transition-colors hover:text-foreground/80 text-foreground/60">Features</Link>
            <Link href="/about" className="transition-colors hover:text-foreground/80 text-foreground/60">About</Link>
            <Link href="/contact" className="transition-colors hover:text-foreground/80 text-foreground/60">Contact</Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Link href="/dashboard" className={buttonVariants({ className: "bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6" })}>
              Dashboard
            </Link>
            <Button 
              variant="outline" 
              className="rounded-full px-4 text-muted-foreground hover:text-foreground"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
