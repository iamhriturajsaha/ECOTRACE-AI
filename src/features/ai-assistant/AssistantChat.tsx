"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Message = { id: string; role: "user" | "assistant"; content: string };

export function AssistantChat() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "assistant", content: "Hi! I'm your EcoTrace AI assistant. How can I help you reduce your carbon footprint today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { id: Date.now().toString(), role: "user" as const, content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.content }),
      });
      const data = await response.json();
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response || "I'm having trouble processing that right now."
      }]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto w-full p-4">
      <div 
        className="flex-1 overflow-y-auto space-y-4 p-4 scroll-smooth"
        role="log"
        aria-live="polite"
        aria-label="Chat messages history"
      >
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-start gap-4 ${m.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-green-500/20 text-green-700"}`}>
                {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              <div className={`rounded-2xl px-4 py-3 max-w-[80%] ${m.role === "user" ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-muted rounded-tl-sm"}`}>
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{m.content}</p>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-4">
              <div className="shrink-0 h-8 w-8 rounded-full flex items-center justify-center bg-green-500/20 text-green-700">
                <Bot className="h-4 w-4" />
              </div>
              <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-4 flex items-center gap-1">
                <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 bg-background border-t">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder="Ask about reducing emissions, sustainable products..." 
            className="flex-1 rounded-full px-6 h-12"
            disabled={isLoading}
            aria-label="Ask a question about sustainability"
          />
          <Button 
            type="submit" 
            size="icon" 
            className="h-12 w-12 rounded-full shrink-0" 
            disabled={!input.trim() || isLoading}
            aria-label="Send message"
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
