"use client";

import { useState, useRef, useEffect } from "react";
import { LogOut, User as UserIcon, Settings } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

interface UserDropdownProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function UserDropdown({ user }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-700 font-bold uppercase overflow-hidden border border-emerald-500/30 shadow-sm hover:scale-105 transition-transform cursor-pointer"
      >
        {user.image ? <Image src={user.image} alt="User avatar" width={32} height={32} className="object-cover" /> : user.email?.charAt(0) || "U"}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl bg-card border border-border/50 shadow-lg py-1 z-50 backdrop-blur-xl">
          <div className="px-4 py-3 border-b border-border/50">
            <p className="text-sm font-medium leading-none">{user.name || "User"}</p>
            <p className="text-xs text-muted-foreground mt-1 truncate">{user.email}</p>
          </div>
          
          <div className="p-1">
            <Link 
              href="/dashboard" 
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted/50 rounded-lg transition-colors cursor-pointer"
            >
              <UserIcon className="h-4 w-4" /> Profile
            </Link>
            <Link 
              href="/dashboard/settings" 
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted/50 rounded-lg transition-colors cursor-pointer"
            >
              <Settings className="h-4 w-4" /> Settings
            </Link>
          </div>
          
          <div className="p-1 border-t border-border/50">
            <button 
              onClick={() => signOut({ callbackUrl: '/home' })}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
