import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AssistantChat } from "@/features/ai-assistant/AssistantChat";
import { Leaf } from "lucide-react";

export default async function AssistantPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/");
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="bg-background border-b px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-green-500" />
          <span className="font-bold text-lg">EcoTrace AI Assistant</span>
        </div>
      </header>
      <main className="flex-1 overflow-hidden flex flex-col">
        <AssistantChat />
      </main>
    </div>
  );
}
