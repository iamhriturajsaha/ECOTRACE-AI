"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Send, MessageSquare, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createCommunityPost, likeCommunityPost } from "@/app/actions/community";

type Post = {
  id: string;
  content: string;
  likes: number;
  createdAt: Date;
  user: {
    name: string | null;
    image: string | null;
  };
};

interface CommunityFeedProps {
  initialPosts: Post[];
  currentUser: { name?: string | null; id: string };
}

export function CommunityFeed({ initialPosts, currentUser }: CommunityFeedProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const newPost = await createCommunityPost(content);
      const postWithUser: Post = {
        ...newPost,
        user: {
          name: currentUser.name || "You",
          image: null,
        },
      };
      setPosts((prev) => [postWithUser, ...prev]);
      setContent("");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create post.";
      setErrorMsg(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (postId: string) => {
    // Optimistic UI Update
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, likes: p.likes + 1 } : p))
    );

    try {
      await likeCommunityPost(postId);
    } catch (err) {
      console.error("Failed to register like", err);
      // Revert if error occurs (optional, but keep simple since this is a demonstration)
    }
  };

  return (
    <div className="space-y-8">
      {/* Create Post Card */}
      <Card className="border border-white/10 bg-card/40 backdrop-blur-xl shadow-lg rounded-3xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-emerald-400" />
            Share your progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePostSubmit} className="space-y-4">
            {errorMsg && (
              <div
                role="alert"
                className="bg-red-500/10 text-red-400 p-3 rounded-xl border border-red-500/20 text-sm flex items-center gap-2"
              >
                <ShieldAlert className="h-4 w-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
            <div className="relative">
              <label htmlFor="post-composer" className="sr-only">
                What sustainability win did you achieve today?
              </label>
              <textarea
                id="post-composer"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What sustainability win did you achieve today? Share with the community!"
                maxLength={280}
                className="w-full bg-background/50 border border-white/10 rounded-2xl p-4 min-h-[100px] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
              />
              <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
                {content.length}/280
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={!content.trim() || isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2 rounded-xl flex items-center gap-2 shadow-md"
              >
                Post <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Feed List */}
      <div className="space-y-4" role="feed" aria-label="Community updates feed">
        <AnimatePresence initial={false}>
          {posts.map((post) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="p-6 rounded-3xl border border-white/5 bg-card/30 backdrop-blur-xl shadow-md hover:bg-card/40 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center font-bold text-white text-sm">
                  {post.user.name ? post.user.name.charAt(0).toUpperCase() : "E"}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">
                      {post.user.name || "Anonymous User"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(post.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/90 break-words pr-2">
                    {post.content}
                  </p>
                  <div className="pt-3 flex items-center gap-4">
                    <button
                      onClick={() => handleLike(post.id)}
                      className="group flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-red-400 transition-colors"
                      aria-label={`Like post, currently has ${post.likes} likes`}
                    >
                      <Heart className="h-4 w-4 group-hover:scale-110 transition-transform group-active:scale-95" />
                      <span>{post.likes}</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
