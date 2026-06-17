import { Trophy, Clock, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAndSeedChallenges } from "@/app/actions/challenges";

export default async function ChallengesPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return null;

  const challenges = await getAndSeedChallenges();
  
  // Fetch user achievements
  const achievements = await prisma.achievement.findMany({
    where: { userId: session.user.id }
  });

  // Calculate XP earned this week (placeholder logic for display)
  const recentLogs = await prisma.activityLog.findMany({
    where: { 
      userId: session.user.id,
      createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    }
  });
  
  // Try to parse XP from logs like "Completed AI Insight: ... (+50 XP)"
  const xpEarnedThisWeek = recentLogs.reduce((total, log) => {
    const match = log.action.match(/\(\+(\d+)\sXP\)/);
    return total + (match ? parseInt(match[1]) : 0);
  }, 0);

  const colors = [
    { text: "text-blue-500", bg: "bg-blue-500/10", bar: "from-blue-500 to-cyan-400" },
    { text: "text-emerald-500", bg: "bg-emerald-500/10", bar: "from-emerald-500 to-teal-400" },
    { text: "text-orange-500", bg: "bg-orange-500/10", bar: "from-orange-500 to-amber-400" }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Trophy className="h-8 w-8 text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
            Smart Challenges
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">Join challenges, earn XP, and turn real-world actions into a game.</p>
        </div>
        <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 backdrop-blur-md px-4 py-2 rounded-xl text-amber-500 font-bold shadow-[0_0_15px_rgba(245,158,11,0.15)]">
          <Star className="h-5 w-5 fill-amber-500 text-amber-500 animate-pulse" />
          <span>{xpEarnedThisWeek} XP Earned This Week</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6">
        {challenges.map((challenge, i) => {
          const achievement = achievements.find(a => a.challengeId === challenge.id);
          const progress = achievement?.progress || 0;
          const isCompleted = achievement?.isCompleted || false;
          const theme = colors[i % colors.length];

          return (
            <div key={challenge.id} className={`p-6 rounded-3xl border border-white/10 bg-card/40 backdrop-blur-xl relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:bg-card/60 group ${isCompleted ? 'opacity-70 grayscale-[0.2]' : ''}`}>
              {isCompleted && (
                <div className="absolute top-4 right-4 bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                  COMPLETED
                </div>
              )}
              
              <div className="flex items-start gap-4 mb-6 relative z-10">
                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center flex-shrink-0 bg-background/50 border border-white/5 shadow-inner group-hover:scale-110 transition-transform duration-300 ${theme.text}`}>
                  <Zap className="h-7 w-7 drop-shadow-[0_0_8px_currentColor]" />
                </div>
                <div className="pt-1">
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{challenge.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded border border-white/10 shadow-sm ${theme.text} ${theme.bg}`}>
                      +{challenge.rewardXp} XP
                    </span>
                    <span className="text-xs text-muted-foreground bg-muted/50 border border-white/5 px-2 py-0.5 rounded">
                      {challenge.durationDays} actions
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground/80 text-sm mb-6 h-10 relative z-10">
                {challenge.description}
              </p>

              <div className="space-y-2 relative z-10">
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-foreground">Progress</span>
                  <span className="text-muted-foreground">{progress} / {challenge.durationDays}</span>
                </div>
                <div className="h-3 w-full bg-muted/50 rounded-full overflow-hidden border border-white/5 relative">
                  <div 
                    className={`h-full rounded-full relative transition-all duration-1000 ease-out ${isCompleted ? 'bg-emerald-500' : 'bg-gradient-to-r ' + theme.bar}`} 
                    style={{ width: `${Math.min((progress / challenge.durationDays) * 100, 100)}%` }}
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%,100%_100%] animate-[shimmer_2s_infinite]" />
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10 flex justify-between items-center relative z-10">
                <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Clock className="h-4 w-4" /> Repeatable
                </span>
                
                {isCompleted ? (
                  <form action={async () => {
                    "use server";
                    const { repeatChallenge } = await import("@/app/actions/challenges");
                    await repeatChallenge(challenge.id);
                  }}>
                    <Button type="submit" className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-white transition-all shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                      Repeat Challenge
                    </Button>
                  </form>
                ) : (
                  <form action={async () => {
                    "use server";
                    const { logChallengeProgress } = await import("@/app/actions/challenges");
                    await logChallengeProgress(challenge.id);
                  }}>
                    <Button type="submit" className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-primary-foreground transition-all shadow-[0_0_10px_rgba(var(--primary),0.1)] hover:shadow-[0_0_20px_rgba(var(--primary),0.4)]">
                      Log Progress
                    </Button>
                  </form>
                )}
              </div>
              
              {/* Ambient Background Glow */}
              <div className={`absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-[50px] opacity-20 pointer-events-none transition-opacity duration-500 group-hover:opacity-40 ${isCompleted ? 'bg-emerald-500' : 'bg-primary'}`} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
