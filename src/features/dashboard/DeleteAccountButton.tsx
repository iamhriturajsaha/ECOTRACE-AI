"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { signOut } from "next-auth/react";
import { deleteAccount } from "@/app/actions/settings";

export function DeleteAccountButton() {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirm = window.confirm("WARNING: This action is irreversible. All of your carbon records, achievements, and your account will be permanently deleted. Are you absolutely sure?");
    if (!confirm) return;

    setIsDeleting(true);
    try {
      await deleteAccount();
      await signOut({ callbackUrl: '/' });
    } catch (error) {
      console.error(error);
      alert("Failed to delete account. Please try again.");
      setIsDeleting(false);
    }
  };

  return (
    <Button 
      variant="destructive" 
      onClick={handleDelete}
      disabled={isDeleting}
      className="w-full bg-red-500/20 text-red-600 hover:bg-red-500 hover:text-white border border-red-500/30 transition-all font-bold"
    >
      <Trash2 className={`h-4 w-4 mr-2 ${isDeleting ? "animate-bounce" : ""}`} />
      {isDeleting ? "Deleting Data..." : "Permanently Delete Account"}
    </Button>
  );
}
