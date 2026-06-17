import { Users, Trophy, ChevronUp, ChevronDown, Minus } from "lucide-react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function LeaderboardPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return null;

  // Fetch all profiles ordered by XP descending
  const allProfiles = await prisma.carbonProfile.findMany({
    include: { user: true },
    orderBy: { xp: 'desc' }
  });

  // Calculate ranks
  const leaderboard = allProfiles.map((profile, index) => {
    return {
      rank: index + 1,
      name: profile.user.name || "Anonymous",
      level: profile.level,
      score: profile.xp,
      // Logic for arrows: Mocked based on index for now, but fully dynamic ranking
      change: index % 3 === 0 ? "up" : index % 2 === 0 ? "down" : "same",
      avatar: profile.user.name ? profile.user.name.charAt(0) : "U",
      isUser: profile.userId === session.user.id
    };
  });

  const currentUser = leaderboard.find(u => u.isUser);
  const currentUserRank = currentUser ? currentUser.rank : 0;
  const totalUsers = leaderboard.length;
  const topPercentage = totalUsers > 0 ? Math.max(1, Math.round((currentUserRank / totalUsers) * 100)) : 0;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Users className="h-8 w-8 text-blue-500" />
          Community Leaderboard
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">Compare your progress with friends and top sustainability champions globally.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 mb-8">
        <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/20 via-amber-600/10 to-transparent border border-amber-500/30 flex flex-col items-center justify-center text-center relative overflow-hidden backdrop-blur-xl shadow-[0_0_30px_rgba(245,158,11,0.15)] group hover:shadow-[0_0_40px_rgba(245,158,11,0.25)] transition-all duration-300">
          <Trophy className="h-12 w-12 text-amber-500 mb-2 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)] group-hover:scale-110 transition-transform duration-300" />
          <h3 className="font-bold text-amber-400">Global Rank</h3>
          <div className="text-4xl font-black text-amber-500 mt-1 drop-shadow-md">#{currentUserRank}</div>
          <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
        </div>
        <div className="p-6 rounded-3xl bg-card/40 backdrop-blur-xl border border-white/5 flex flex-col justify-center shadow-lg hover:bg-card/60 transition-all duration-300">
          <p className="text-sm text-muted-foreground font-medium">Top {topPercentage}%</p>
          <div className="text-2xl font-bold mt-1 text-foreground">Of all users globally</div>
          <div className="mt-4 w-full bg-muted/50 rounded-full h-2 overflow-hidden border border-white/5">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full relative" style={{ width: `${100 - topPercentage}%` }}>
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%,100%_100%] animate-[shimmer_2s_infinite]" />
            </div>
          </div>
        </div>
        <div className="p-6 rounded-3xl bg-card/40 backdrop-blur-xl border border-white/5 flex flex-col justify-center shadow-lg hover:bg-card/60 transition-all duration-300 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />
          <p className="text-sm text-muted-foreground font-medium">Next Milestone</p>
          <div className="text-2xl font-bold mt-1 text-foreground">Rank #{Math.max(1, currentUserRank - 1)}</div>
          <p className="text-sm font-bold text-emerald-400 mt-2 bg-emerald-500/10 w-fit px-3 py-1 rounded-full border border-emerald-500/20">Keep logging progress!</p>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-card/40 backdrop-blur-xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-white/5 bg-background/50 grid grid-cols-12 gap-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          <div className="col-span-2 sm:col-span-1 text-center">Rank</div>
          <div className="col-span-6 sm:col-span-7">Champion</div>
          <div className="col-span-2 text-center">Level</div>
          <div className="col-span-2 text-right">XP</div>
        </div>
        <div className="divide-y divide-white/5">
          {leaderboard.map((user) => (
            <div key={user.rank} className={`px-6 py-4 grid grid-cols-12 gap-4 items-center transition-all duration-300 hover:bg-white/5 ${user.isUser ? 'bg-emerald-500/10 border-l-4 border-l-emerald-500' : ''}`}>
              <div className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 font-bold text-lg">
                <span className={user.rank === 1 ? 'text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)] text-xl' : user.rank === 2 ? 'text-slate-300 drop-shadow-[0_0_8px_rgba(203,213,225,0.8)]' : user.rank === 3 ? 'text-amber-700 drop-shadow-[0_0_8px_rgba(180,83,9,0.8)]' : 'text-muted-foreground/70'}>
                  #{user.rank}
                </span>
                {user.change === 'up' && <ChevronUp className="h-4 w-4 text-emerald-400 hidden sm:block" />}
                {user.change === 'down' && <ChevronDown className="h-4 w-4 text-red-500 hidden sm:block" />}
                {user.change === 'same' && <Minus className="h-4 w-4 text-muted-foreground hidden sm:block" />}
              </div>
              <div className="col-span-6 sm:col-span-7 flex items-center gap-3 sm:gap-4">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-white shadow-md ${user.isUser ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 ring-2 ring-emerald-500/50 ring-offset-2 ring-offset-background' : user.rank === 1 ? 'bg-gradient-to-br from-amber-400 to-amber-600' : 'bg-slate-800 border border-white/10'}`}>
                  {user.avatar}
                </div>
                <span className={`font-semibold ${user.isUser ? 'text-emerald-400' : 'text-foreground'}`}>
                  {user.name} {user.isUser && "(You)"}
                </span>
              </div>
              <div className="col-span-2 text-center font-bold text-muted-foreground">
                <span className="bg-background/50 px-2 py-1 rounded-md border border-white/5">{user.level}</span>
              </div>
              <div className="col-span-2 text-right font-black text-emerald-400 tracking-tight">
                {user.score.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
