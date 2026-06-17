import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getCommunityPosts } from "@/app/actions/community";
import { CommunityFeed } from "@/features/community/CommunityFeed";
import { MessageSquare } from "lucide-react";

export default async function CommunityPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/");
  }

  const posts = await getCommunityPosts();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <MessageSquare className="h-8 w-8 text-emerald-500" />
          Community Feed
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Share your green achievements and connect with other sustainability champions!
        </p>
      </div>

      <div className="pt-4">
        <CommunityFeed initialPosts={posts} currentUser={session.user} />
      </div>
    </div>
  );
}
