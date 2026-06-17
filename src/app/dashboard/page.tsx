import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingDown, Target, Zap, Clock, Leaf } from "lucide-react";
import { DashboardCharts } from "@/features/dashboard/DashboardCharts";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) return null;

  const profile = await prisma.carbonProfile.findUnique({
    where: { userId: session.user.id },
  });

  const records = await prisma.carbonRecord.findMany({
    where: { userId: session.user.id },
    orderBy: { date: 'desc' }, // Descending for recent activity
  });

  // Calculate Category Totals
  const transportScore = records
    .filter(r => r.category === "TRANSPORTATION" || r.category === "TRAVEL")
    .reduce((sum, r) => sum + r.amount, 0);

  const foodScore = records
    .filter(r => r.category === "FOOD")
    .reduce((sum, r) => sum + r.amount, 0);

  const energyScore = records
    .filter(r => r.category === "ENERGY")
    .reduce((sum, r) => sum + r.amount, 0);

  const totalCalculatedScore = records.reduce((sum, r) => sum + r.amount, 0);
  const totalScore = profile?.totalCarbonScore || totalCalculatedScore || 1;

  // Determine Primary Source
  const categoryTotals = {
    "Transportation": transportScore,
    "Food & Diet": foodScore,
    "Energy": energyScore,
    "Shopping & Other": records.filter(r => r.category === "SHOPPING" || r.category === "OTHER").reduce((sum, r) => sum + r.amount, 0)
  };

  const primarySourceEntry = Object.entries(categoryTotals).reduce((max, entry) => entry[1] > max[1] ? entry : max, ["None", 0]);
  const primarySource = primarySourceEntry[0];
  const primaryAmount = primarySourceEntry[1];
  const primaryPercentage = Math.round((primaryAmount / Math.max(totalScore, 1)) * 100);

  // Recent 5 activities
  const recentActivity = records.slice(0, 5);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Analytics Overview</h1>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Footprint */}
        <Card className="bg-card/40 backdrop-blur-xl border-white/10 shadow-lg hover:shadow-xl hover:bg-card/60 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-emerald-500 to-cyan-400 opacity-50 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Footprint</CardTitle>
            <TrendingDown className="h-4 w-4 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-foreground drop-shadow-sm">{totalScore.toFixed(0)} <span className="text-sm font-medium text-muted-foreground">kg CO₂e/mo</span></div>
            <p className="text-xs text-muted-foreground mt-1">Based on records</p>
          </CardContent>
        </Card>
        
        {/* Transport */}
        <Card className="bg-card/40 backdrop-blur-xl border-white/10 shadow-lg hover:shadow-xl hover:bg-card/60 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Target className="w-24 h-24" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
            <CardTitle className="text-sm font-medium">Transport</CardTitle>
            <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">{Math.round((transportScore / Math.max(totalScore, 1)) * 100)}%</span>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold text-foreground">{Math.round(transportScore)} <span className="text-sm font-medium text-muted-foreground">kg CO₂e</span></div>
            <Progress value={(transportScore / Math.max(totalScore, 1)) * 100} className="h-2 mt-3 bg-blue-500/20" indicatorClassName="bg-blue-500" />
          </CardContent>
        </Card>

        {/* Food */}
        <Card className="bg-card/40 backdrop-blur-xl border-white/10 shadow-lg hover:shadow-xl hover:bg-card/60 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Leaf className="w-24 h-24" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
            <CardTitle className="text-sm font-medium">Food & Diet</CardTitle>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">{Math.round((foodScore / Math.max(totalScore, 1)) * 100)}%</span>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold text-foreground">{Math.round(foodScore)} <span className="text-sm font-medium text-muted-foreground">kg CO₂e</span></div>
            <Progress value={(foodScore / Math.max(totalScore, 1)) * 100} className="h-2 mt-3 bg-emerald-500/20" indicatorClassName="bg-emerald-500" />
          </CardContent>
        </Card>

        {/* Energy */}
        <Card className="bg-card/40 backdrop-blur-xl border-white/10 shadow-lg hover:shadow-xl hover:bg-card/60 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Zap className="w-24 h-24" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
            <CardTitle className="text-sm font-medium">Energy</CardTitle>
            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">{Math.round((energyScore / Math.max(totalScore, 1)) * 100)}%</span>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold text-foreground">{Math.round(energyScore)} <span className="text-sm font-medium text-muted-foreground">kg CO₂e</span></div>
            <Progress value={(energyScore / Math.max(totalScore, 1)) * 100} className="h-2 mt-3 bg-amber-500/20" indicatorClassName="bg-amber-500" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 mt-4">
        {/* Charts */}
        <Card className="col-span-1 lg:col-span-4 bg-card/40 backdrop-blur-xl border-white/10 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle>Carbon Trajectory</CardTitle>
            <CardDescription className="text-muted-foreground/70">Your estimated emissions broken down by category</CardDescription>
          </CardHeader>
          <CardContent className="h-[500px]">
            {/* DashboardCharts takes descending records and probably reverses it, but just in case, we reverse the copy to be ascending so timeline is left-to-right */}
            <DashboardCharts records={[...records].reverse()} />
          </CardContent>
        </Card>
        
        {/* Deep Analytics & Activity */}
        <div className="col-span-1 lg:col-span-3 space-y-6">
          <Card className="bg-gradient-to-br from-emerald-500/10 to-primary/5 border-emerald-500/20 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
            <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader>
              <CardTitle className="text-emerald-500 flex items-center gap-2">
                <Zap className="h-5 w-5 fill-emerald-500/50" />
                Deep Analytics
              </CardTitle>
              <CardDescription className="text-muted-foreground/80">AI-powered insights based on your footprint</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <p className="text-sm font-medium">Primary Emission Source:</p>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-card/50 border border-white/5 relative overflow-hidden group-hover:border-emerald-500/30 transition-colors">
                  <div className="h-10 w-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 font-bold drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">!</div>
                  <div className="flex-1 relative z-10">
                    <p className="font-semibold text-foreground text-lg">{primarySource}</p>
                    <p className="text-xs text-muted-foreground">Accounts for {primaryPercentage}% of your footprint</p>
                  </div>
                  <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-red-500/10 to-transparent pointer-events-none" />
                </div>
              </div>
              
              <div className="h-24 rounded-xl bg-gradient-to-r from-emerald-500/20 to-blue-500/20 flex items-center justify-center border border-white/10 relative overflow-hidden shadow-[inset_0_0_20px_rgba(16,185,129,0.1)] group-hover:shadow-[inset_0_0_30px_rgba(16,185,129,0.2)] transition-shadow">
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%,100%_100%] animate-[shimmer_2s_infinite]" />
                <div className="text-center z-10">
                  <span className="block text-lg font-black text-emerald-400 drop-shadow-md">Next Milestone: Level {(profile?.level || 1) + 1}</span>
                  <span className="text-xs text-muted-foreground mt-1 block font-medium">Earn 150 XP to level up</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity Feed */}
          <Card className="bg-card/40 backdrop-blur-xl border-white/10 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No recent activity.</p>
                ) : (
                  recentActivity.map((record) => (
                    <div key={record.id} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold
                          ${record.category === 'TRANSPORTATION' ? 'bg-blue-500/20 text-blue-400' :
                            record.category === 'FOOD' ? 'bg-emerald-500/20 text-emerald-400' :
                            record.category === 'ENERGY' ? 'bg-amber-500/20 text-amber-400' :
                            'bg-primary/20 text-primary'}`}
                        >
                          {record.category.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground capitalize">{record.category.toLowerCase()}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[150px]">{record.description || 'Logged entry'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-rose-400 group-hover:scale-110 transition-transform">+{record.amount.toFixed(0)}</p>
                        <p className="text-[10px] text-muted-foreground">{new Date(record.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
