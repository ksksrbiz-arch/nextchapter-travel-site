import PortalLayout from "@/components/PortalLayout";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/_core/hooks/useAuth";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Send, MessageSquare, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Messages() {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { data: allMessages, isLoading, refetch } = trpc.messages.list.useQuery({});

  const jessicaId = allMessages?.find(m => m.fromUserId !== user?.id)?.fromUserId
    ?? allMessages?.find(m => m.toUserId !== user?.id)?.toUserId;

  const { data: conversation, refetch: refetchConvo } = trpc.messages.list.useQuery(
    { otherUserId: jessicaId! },
    { enabled: !!jessicaId, refetchInterval: 5000 }
  );

  const sendMessage = trpc.messages.send.useMutation({
    onSuccess: () => {
      setMessage("");
      refetchConvo();
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    },
    onError: (e) => toast.error(e.message),
  });

  const markRead = trpc.messages.markRead.useMutation();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  useEffect(() => {
    if (jessicaId && user?.id) {
      markRead.mutate({ fromUserId: jessicaId });
    }
  }, [jessicaId, conversation?.length]);

  const handleSend = () => {
    if (!message.trim()) return;
    sendMessage.mutate({ toUserId: jessicaId ?? 1, content: message.trim() });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // On desktop: Enter sends; Shift+Enter = new line
    // On mobile: always allow Enter for new line (send via button)
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth >= 640) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-grow textarea
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  const displayMessages = jessicaId ? conversation : [];

  return (
    <PortalLayout title="Messages" subtitle="Chat with Jessica">
      {/* Full-height chat container — uses dvh for mobile keyboard awareness */}
      <div className="flex flex-col rounded-2xl border border-border overflow-hidden bg-card"
        style={{ height: "calc(100dvh - 8rem)" }}>

        {/* Chat header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-serif font-bold text-sm flex-shrink-0">
            JS
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-serif font-semibold text-foreground text-sm sm:text-base">Jessica Seiders</h3>
            <div className="flex items-center gap-1.5 text-xs font-sans text-green-600">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
              Travel Advisor · Next Chapter Travel
            </div>
          </div>
          <div className="text-xs text-muted-foreground font-sans hidden sm:block">
            Responds within 24 hrs
          </div>
        </div>

        {/* Messages scroll area */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 bg-muted/20 space-y-3">
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-secondary" />
            </div>
          )}

          {!isLoading && (!displayMessages || displayMessages.length === 0) && (
            <div className="flex flex-col items-center justify-center h-full py-12 text-center px-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <MessageSquare className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-serif font-semibold text-foreground mb-2">Start the Conversation</h3>
              <p className="text-muted-foreground font-sans text-sm max-w-xs leading-relaxed">
                Send Jessica a message about your trip, questions, or anything you need help with.
              </p>
            </div>
          )}

          {displayMessages?.map((msg) => {
            const isFromMe = msg.fromUserId === user?.id;
            return (
              <div key={msg.id} className={cn("flex", isFromMe ? "justify-end" : "justify-start")}>
                <div className={cn(
                  "flex items-end gap-2 max-w-[85%] sm:max-w-[75%]",
                  isFromMe ? "flex-row-reverse" : "flex-row"
                )}>
                  {/* Avatar */}
                  <div className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mb-1",
                    isFromMe ? "bg-secondary text-secondary-foreground" : "bg-primary text-primary-foreground"
                  )}>
                    {isFromMe ? (user?.name?.charAt(0) ?? "?") : "JS"}
                  </div>

                  {/* Bubble */}
                  <div className={cn(
                    "rounded-2xl px-3.5 py-2.5 sm:px-4 sm:py-3",
                    isFromMe
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-card border border-border text-foreground rounded-bl-sm"
                  )}>
                    <p className="font-sans text-sm leading-relaxed break-words">{msg.content}</p>
                    <p className={cn(
                      "font-sans text-[10px] mt-1",
                      isFromMe ? "text-primary-foreground/50" : "text-muted-foreground"
                    )}>
                      {new Date(msg.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area — sticks to bottom, keyboard-aware via dvh */}
        <div className="flex items-end gap-2 p-3 sm:p-4 border-t border-border bg-card flex-shrink-0"
          style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}>
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder="Message Jessica..."
            className="flex-1 font-sans border-border resize-none min-h-[44px] max-h-[120px] py-2.5 text-sm leading-relaxed"
            rows={1}
            disabled={sendMessage.isPending}
          />
          <Button
            onClick={handleSend}
            disabled={!message.trim() || sendMessage.isPending}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-sans flex-shrink-0 min-h-[44px] min-w-[44px]"
            size="icon"
          >
            {sendMessage.isPending
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <Send className="w-4 h-4" />
            }
          </Button>
        </div>
      </div>
    </PortalLayout>
  );
}
