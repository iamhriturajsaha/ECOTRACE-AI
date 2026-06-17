import { OnboardingWizard } from "@/features/onboarding/OnboardingWizard";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DashboardLayoutWrapper } from "@/components/dashboard/DashboardLayoutWrapper";
import { Footer } from "@/components/layout/Footer";

export default async function OnboardingPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/");
  }

  // Check if user already has a profile
  const profile = await prisma.carbonProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (profile) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardLayoutWrapper>
        <div className="flex-1">
          <OnboardingWizard />
        </div>
        <Footer />
      </DashboardLayoutWrapper>
    </div>
  );
}
