import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import {
  MessageCircleQuestion,
  X,
  Send,
  Loader2,
  Bot,
  ArrowUpRight,
} from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string; escalate?: boolean };

const WELCOME: Msg = {
  role: "assistant",
  content:
    "Hi! I'm Next Chapter Travel's 24/7 assistant. I can help with quick questions about visas, baggage, packing, and routine travel topics. For booking changes or anything urgent, tap \"Talk to Jessica\".",
};

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([WELCOME]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const ask = trpc.ai.chatbot.useMutation({
    onSuccess: data => {
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: data.reply,
          escalate: data.suggestEscalation,
        },
      ]);
    },
    onError: e => {
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: `Sorry, I had trouble answering that (${e.message}). Try again or tap "Talk to Jessica".`,
          escalate: true,
        },
      ]);
    },
  });

  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  const submit = () => {
    const text = input.trim();
    if (!text || ask.isPending) return;
    const newUserMsg: Msg = { role: "user", content: text };
    const history = messages
      .filter(m => m.role === "user" || m.role === "assistant")
      .slice(-6)
      .map(m => ({ role: m.role, content: m.content }));
    setMessages(prev => [...prev, newUserMsg]);
    setInput("");
    ask.mutate({ question: text, history });
  };

  return (
    <>
      {/* Floating button */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-label={open ? "Close assistant" : "Open assistant"}
        className={cn(
          "fixed z-40 rounded-full shadow-lg bg-primary text-primary-foreground hover:scale-105 transition-transform flex items-center justify-center",
          // Sit above the mobile bottom nav
          "right-4 bottom-20 md:bottom-6 w-14 h-14"
        )}
      >
        {open ? (
          <X className="w-5 h-5" />
        ) : (
          <MessageCircleQuestion className="w-6 h-6" />
        )}
      </button>

      {/* Panel */}
      {open && (
        <div
          className={cn(
            "fixed z-40 right-4 bottom-36 md:bottom-24 w-[min(380px,calc(100vw-2rem))]",
            "bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden",
            "animate-in fade-in slide-in-from-bottom-4 duration-200"
          )}
          style={{ height: "min(560px, calc(100dvh - 8rem))" }}
        >
          <header className="px-4 py-3 border-b border-border bg-primary/5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              <Bot className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-serif font-semibold text-sm text-foreground">
                Travel Assistant
              </p>
              <p className="text-xs text-muted-foreground font-sans">
                24/7 · routine FAQs
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-muted-foreground hover:text-foreground p-1"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </header>

          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-3 space-y-3"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "flex",
                  m.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-3 py-2 text-sm font-sans leading-relaxed",
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  )}
                >
                  {m.content}
                  {m.role === "assistant" && m.escalate && (
                    <div className="mt-2">
                      <Link href="/portal/messages">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          onClick={() => setOpen(false)}
                        >
                          Talk to Jessica
                          <ArrowUpRight className="w-3 h-3 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {ask.isPending && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl px-3 py-2 text-sm font-sans flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Thinking…
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={e => {
              e.preventDefault();
              submit();
            }}
            className="border-t border-border p-3 flex items-center gap-2"
          >
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about visas, baggage, packing…"
              disabled={ask.isPending}
              className="flex-1"
            />
            <Button
              type="submit"
              size="icon"
              disabled={ask.isPending || !input.trim()}
              aria-label="Send"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
