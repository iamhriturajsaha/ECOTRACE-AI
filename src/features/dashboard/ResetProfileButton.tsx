"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";

export function ResetProfileButton() {
  const [isResetting, setIsResetting] = useState(false);
  const router = useRouter();

  const handleReset = async () => {
    if (!confirm("Are you sure you want to reset your profile and retake the assessment? This will delete your current score and records.")) {
      return;
    }

    setIsResetting(true);
    try {
      const response = await fetch("/api/profile/reset", {
        method: "DELETE",
      });
      if (response.ok) {
        router.push("/onboarding");
      } else {
        alert("Failed to reset profile.");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to reset profile.");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleReset} 
      disabled={isResetting}
      className="text-muted-foreground hover:text-destructive hover:border-destructive hover:bg-destructive/10"
    >
      <RotateCcw className={`h-4 w-4 mr-2 ${isResetting ? "animate-spin" : ""}`} />
      {isResetting ? "Resetting..." : "Retake Assessment"}
    </Button>
  );
}
