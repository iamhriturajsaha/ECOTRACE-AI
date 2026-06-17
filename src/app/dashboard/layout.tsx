import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Leaf, Award, LayoutDashboard, BrainCircuit, Trophy, Users } from "lucide-react";
import { ResetProfileButton } from "@/features/dashboard/ResetProfileButton";
import { DashboardLayoutWrapper } from "@/components/dashboard/DashboardLayoutWrapper";
import { UserDropdown } from "@/components/dashboard/UserDropdown";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  const profile = await prisma.carbonProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!profile) {
    redirect("/onboarding");
  }

  // Use fresh database data for the dropdown instead of stale JWT session
  const freshUser = { ...session.user, name: dbUser?.name || session.user.name };

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-background/80 backdrop-blur-md border-r border-border/50 flex-shrink-0 z-20">
        <div className="h-16 flex items-center px-6 border-b border-border/50">
          <Link href="/home" className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-emerald-500" />
            <span className="font-bold text-lg">EcoTrace AI</span>
          </Link>
        </div>
        <div className="p-4 space-y-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-500/10 hover:text-emerald-600 transition-colors">
            <LayoutDashboard className="h-5 w-5 text-emerald-600/70" />
            Overview
          </Link>
          <Link href="/dashboard/recommendations" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-500/10 hover:text-emerald-600 transition-colors">
            <BrainCircuit className="h-5 w-5 text-emerald-500" />
            AI Insights
          </Link>
          <Link href="/dashboard/challenges" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-500/10 hover:text-emerald-600 transition-colors">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Challenges
          </Link>
          <Link href="/dashboard/leaderboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-500/10 hover:text-emerald-600 transition-colors">
            <Users className="h-5 w-5 text-blue-500" />
            Leaderboard
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen overflow-hidden relative">
        {/* Top Header */}
        <header className="h-16 bg-background/60 backdrop-blur-md border-b border-border/50 px-6 flex items-center justify-between flex-shrink-0 z-20">
          <h2 className="font-semibold hidden sm:block">Dashboard</h2>
          <div className="flex items-center gap-4 ml-auto">
            <div className="hidden sm:flex items-center gap-2 bg-muted/80 backdrop-blur-sm border border-border/50 px-3 py-1.5 rounded-full text-sm font-medium shadow-sm">
              <Award className="h-4 w-4 text-yellow-500" />
              Level {profile.level} ({profile.xp} XP)
            </div>
            <ResetProfileButton />
            <UserDropdown user={freshUser} />
          </div>
        </header>

        {/* Main Content Area */}
        <DashboardLayoutWrapper>
          {children}
        </DashboardLayoutWrapper>
      </div>
    </div>
  );
}
