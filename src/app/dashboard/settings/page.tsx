import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Settings, User, Key, Shield, Zap } from "lucide-react";
import { ResetProfileButton } from "@/features/dashboard/ResetProfileButton";

import { DeleteAccountButton } from "@/features/dashboard/DeleteAccountButton";
import { UpdateProfileForm } from "@/features/dashboard/UpdateProfileForm";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect("/");
  }

  // Fetch fresh user data from DB (session/JWT can be stale after name updates)
  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  const profile = await prisma.carbonProfile.findUnique({
    where: { userId: session.user.id }
  });

  const displayName = dbUser?.name || session.user.name || "";
  const displayEmail = dbUser?.email || session.user.email || "";

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.2)]">
          <Settings className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
          <p className="text-muted-foreground">Manage your profile, preferences, and data.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Profile Settings */}
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-card/40 backdrop-blur-xl border-white/10 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-emerald-500" />
                Public Profile
              </CardTitle>
              <CardDescription>Update how you appear on the leaderboard and community.</CardDescription>
            </CardHeader>
            <CardContent>
              <UpdateProfileForm 
                initialName={displayName} 
                initialEmail={displayEmail} 
              />
            </CardContent>
          </Card>

          {/* Assessment Data */}
          <Card className="bg-card/40 backdrop-blur-xl border-white/10 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-500" />
                Carbon Assessment Data
              </CardTitle>
              <CardDescription>The core data used to calculate your initial footprint.</CardDescription>
            </CardHeader>
            <CardContent>
              {profile ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                  <div>
                    <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">Transportation</span>
                    <span className="font-medium">{profile.transportationHabit}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">Diet Preference</span>
                    <span className="font-medium">{profile.dietPreference}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">Electricity (kWh/mo)</span>
                    <span className="font-medium">{profile.electricityConsumption}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">Heating Type</span>
                    <span className="font-medium">{profile.homeHeatingType}</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No assessment data found.</p>
              )}
            </CardContent>
            <CardFooter className="bg-muted/10 border-t border-white/5 py-4">
              <div className="flex items-center justify-between w-full">
                <p className="text-xs text-muted-foreground max-w-[60%]">Want to recalculate your baseline score with new data?</p>
                <ResetProfileButton />
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Security / Sidebar */}
        <div className="space-y-6">
          <Card className="bg-card/40 backdrop-blur-xl border-white/10 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-amber-500" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl border border-white/5 bg-background/50 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Key className="h-4 w-4 text-muted-foreground" />
                  Authentication
                </div>
                <p className="text-xs text-muted-foreground">You are currently logged in securely. Password changes are disabled for credential providers in this environment.</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-red-500/5 backdrop-blur-xl border-red-500/10 shadow-lg">
            <CardHeader>
              <CardTitle className="text-red-500 flex items-center gap-2">
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-4">Permanently delete your account and all associated carbon records.</p>
              <DeleteAccountButton />
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
