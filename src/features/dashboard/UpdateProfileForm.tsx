"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfile } from "@/app/actions/settings";
import { Loader2, Check, AlertCircle } from "lucide-react";

interface UpdateProfileFormProps {
  initialName: string;
  initialEmail: string;
}

export function UpdateProfileForm({ initialName, initialEmail }: UpdateProfileFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [name, setName] = useState(initialName);
  const [error, setError] = useState<string | null>(null);

  // Sync state if initialName changes from the server revalidation
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setName(initialName);
  }, [initialName]);

  const handleSubmit = async (formData: FormData) => {
    setIsSaving(true);
    setIsSaved(false);
    setError(null);
    
    try {
      await updateProfile(formData);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Failed to update profile.";
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form action={handleSubmit} className="space-y-4">
      {error && (
        <div 
          role="alert" 
          className="bg-red-500/10 text-red-400 p-3 rounded-xl border border-red-500/20 text-sm flex items-center gap-2 max-w-md animate-in fade-in duration-200"
        >
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="name">Display Name</Label>
        <Input 
          id="name" 
          name="name" 
          value={name} 
          onChange={(e) => setName(e.target.value)}
          aria-describedby="name-description"
          className="max-w-md bg-background/50 border-white/10 focus-visible:ring-emerald-500/50"
        />
        <p id="name-description" className="text-xs text-muted-foreground">This is your public display name. It can be your real name or a pseudonym.</p>
      </div>
      
      <div className="space-y-2 pt-2">
        <Label htmlFor="email">Email Address</Label>
        <Input 
          id="email" 
          type="email" 
          value={initialEmail} 
          disabled 
          aria-describedby="email-description"
          className="max-w-md bg-muted/50 cursor-not-allowed opacity-70"
        />
        <p id="email-description" className="text-xs text-muted-foreground">Your email address cannot be changed at this time.</p>
      </div>
      
      <div className="pt-4">
        <Button 
          type="submit" 
          disabled={isSaving}
          aria-live="polite"
          className={`shadow-md transition-all ${
            isSaved 
              ? "bg-emerald-500 hover:bg-emerald-500 text-white" 
              : "bg-emerald-600 hover:bg-emerald-700 text-white"
          }`}
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : isSaved ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Saved!
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  );
}
