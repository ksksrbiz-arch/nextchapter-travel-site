import { useState, useEffect, useRef, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import PortalLayout from "@/components/PortalLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Wifi,
  WifiOff,
  CheckCheck,
  Check,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSSEMessages, SSEMessagePayload } from "@/hooks/useSSEMessages";
import { toast } from "sonner";
import {
  AttachmentPicker,
  AttachmentPreview,
  AttachmentBubble,
  AttachmentMeta,
} from "@/components/ChatAttachment";
import { NoMessagesEmptyState } from "@/components/ui/empty-states";
import { MessagesSkeleton } from "@/components/ui/skeletons";

type Message = {
  id: number;
  fromUserId: number;
  toUserId: number;
  content: string;
  tripId: number | null;
  attachmentUrl: string | null;
  attachmentName: string | null;
  attachmentType: string | null;
  attachmentSize: number | null;
  isRead: boolean;
  createdAt: string | Date;
};

export default function Messages() {
  const { user } = useAuth();
  const [input, setInput] = useState("");
  const [inputError, setInputError] = useState<string | undefined>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [jessicaIsTyping, setJessicaIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);
  const [adminUserId, setAdminUserId] = useState<number | null>(null);
  const [pendingAttachment, setPendingAttachment] =
    useState<AttachmentMeta | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const MAX_MESSAGE_LENGTH = 4000;

  // Fetch all users to find admin (Jessica)
  const { data: allUsers } = trpc.admin.clients.useQuery(undefined, {
    enabled: !!user && user.role === "user",
  });

  useEffect(() => {
    if (allUsers) {
      const admin = (allUsers as any[]).find((u: any) => u.role === "admin");
      if (admin) setAdminUserId(admin.id);
    }
  }, [allUsers]);

  // Initial message load
  const { data: initialMessages, isLoading } = trpc.messages.list.useQuery(
    { otherUserId: adminUserId ?? undefined },
    { enabled: !!user && !!adminUserId }
  );

  useEffect(() => {
    if (initialMessages) {
      setMessages(initialMessages as Message[]);
    }
  }, [initialMessages]);

  // Mark messages as read when conversation opens
  const markRead = trpc.messages.markRead.useMutation();

  useEffect(() => {
    if (adminUserId && messages.length > 0) {
      const hasUnread = messages.some(
        m => m.fromUserId === adminUserId && !m.isRead
      );
      if (hasUnread) {
        markRead.mutate({ fromUserId: adminUserId });
      }
    }
  }, [adminUserId, messages.length]);

  // Typing indicator mutation
  const typingMutation = trpc.messages.typing.useMutation();

  // SSE real-time connection
  const handleSSEMessage = useCallback(
    (msg: SSEMessagePayload) => {
      if (!user) return;
      if (
        (msg.fromUserId === user.id && msg.toUserId === adminUserId) ||
        (msg.fromUserId === adminUserId && msg.toUserId === user.id)
      ) {
        setMessages(prev => {
          if (prev.find(m => m.id === msg.id)) return prev;
          return [...prev, { ...msg, createdAt: new Date(msg.createdAt) }];
        });
        if (msg.fromUserId === adminUserId && adminUserId) {
          markRead.mutate({ fromUserId: adminUserId });
        }
      }
    },
    [user, adminUserId]
  );

  const handleSSETyping = useCallback(
    (evt: { fromUserId: number; isTyping: boolean }) => {
      if (evt.fromUserId === adminUserId) {
        setJessicaIsTyping(evt.isTyping);
      }
    },
    [adminUserId]
  );

  const handleSSERead = useCallback(
    (evt: { byUserId: number }) => {
      if (evt.byUserId === adminUserId) {
        setMessages(prev =>
          prev.map(m =>
            m.fromUserId === user?.id ? { ...m, isRead: true } : m
          )
        );
      }
    },
    [adminUserId, user]
  );

  const { connected } = useSSEMessages({
    onMessage: handleSSEMessage,
    onTyping: handleSSETyping,
    onRead: handleSSERead,
    enabled: !!user && !!adminUserId,
  });

  // Scroll to bottom on new messages or typing
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, jessicaIsTyping]);

  // Send message
  const sendMutation = trpc.messages.send.useMutation({
    onError: () => {
      toast.error("Failed to send message. Please try again.");
    },
  });

  const handleSend = () => {
    const content = input.trim();

    // Validation
    if (!content && !pendingAttachment) {
      setInputError("Please enter a message or attach a file");
      return;
    }

    if (content && content.length > MAX_MESSAGE_LENGTH) {
      setInputError(`Message must not exceed ${MAX_MESSAGE_LENGTH} characters`);
      return;
    }

    if (!adminUserId) return;

    setInputError(undefined);
    const att = pendingAttachment;

    // Optimistic update
    const optimistic: Message = {
      id: Date.now(),
      fromUserId: user!.id,
      toUserId: adminUserId,
      content: content || " ",
      tripId: null,
      attachmentUrl: att?.url ?? null,
      attachmentName: att?.fileName ?? null,
      attachmentType: att?.mimeType ?? null,
      attachmentSize: att?.fileSize ?? null,
      isRead: false,
      createdAt: new Date(),
    };
    setMessages(prev => [...prev, optimistic]);
    setInput("");
    setPendingAttachment(null);
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    sendMutation.mutate({
      toUserId: adminUserId,
      content: content || " ",
      attachmentUrl: att?.url,
      attachmentName: att?.fileName,
      attachmentType: att?.mimeType,
      attachmentSize: att?.fileSize,
    });

    if (typingTimeout) clearTimeout(typingTimeout);
    typingMutation.mutate({ toUserId: adminUserId, isTyping: false });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth >= 640) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setInput(newValue);

    // Clear error when user starts typing
    if (inputError) {
      setInputError(undefined);
    }

    // Warn if approaching limit
    if (newValue.length > MAX_MESSAGE_LENGTH * 0.9) {
      const remaining = MAX_MESSAGE_LENGTH - newValue.length;
      if (remaining <= 0) {
        setInputError(`Message exceeds ${MAX_MESSAGE_LENGTH} character limit`);
      }
    }

    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
    if (!adminUserId) return;
    if (typingTimeout) clearTimeout(typingTimeout);
    typingMutation.mutate({ toUserId: adminUserId, isTyping: true });
    const t = setTimeout(() => {
      typingMutation.mutate({ toUserId: adminUserId, isTyping: false });
    }, 2000);
    setTypingTimeout(t);
  };

  const formatTime = (date: string | Date) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDateLabel = (date: string | Date) => {
    const d = typeof date === "string" ? new Date(date) : date;
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === today.toDateString()) return "Today";
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  // Group messages by date
  const groupedMessages: { date: string; msgs: Message[] }[] = [];
  for (const msg of messages) {
    const dateLabel = formatDateLabel(msg.createdAt);
    const last = groupedMessages[groupedMessages.length - 1];
    if (last && last.date === dateLabel) {
      last.msgs.push(msg);
    } else {
      groupedMessages.push({ date: dateLabel, msgs: [msg] });
    }
  }

  const canSend =
    (input.trim().length > 0 || !!pendingAttachment) &&
    !!adminUserId &&
    !sendMutation.isPending &&
    !inputError;

  return (
    <PortalLayout title="Messages" subtitle="Chat with Jessica">
      <div
        className="flex flex-col rounded-2xl border border-border overflow-hidden bg-card"
        style={{ height: "calc(100dvh - 8rem)" }}
      >
        {/* Chat Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card flex-shrink-0 shadow-sm">
          <div className="relative">
            <Avatar className="h-10 w-10 ring-2 ring-amber-200">
              <AvatarFallback className="bg-gradient-to-br from-[#1B3A5C] to-[#2d5a8e] text-white font-semibold text-sm">
                JS
              </AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-serif font-semibold text-foreground text-sm leading-tight">
              Jessica Seiders
            </p>
            <p className="text-xs leading-tight">
              {connected ? (
                <span className="flex items-center gap-1 text-emerald-600">
                  <Wifi className="w-3 h-3" /> Live · Next Chapter Travel
                </span>
              ) : (
                <span className="flex items-center gap-1 text-muted-foreground">
                  <WifiOff className="w-3 h-3" /> Reconnecting...
                </span>
              )}
            </p>
          </div>
          <Badge
            variant="outline"
            className="text-xs border-amber-200 text-amber-700 bg-amber-50 hidden sm:flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3" />
            Your Travel Agent
          </Badge>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-1 bg-muted/20">
          {isLoading && <MessagesSkeleton />}

          {!isLoading && messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-16">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-lg">
                <MessageCircle className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <p className="font-serif font-semibold text-foreground text-lg">
                  Start the conversation
                </p>
                <p className="text-sm text-muted-foreground mt-1 max-w-xs font-sans">
                  Send Jessica a message, share a photo, or attach a document
                  like your passport or boarding pass.
                </p>
              </div>
            </div>
          )}

          {groupedMessages.map(({ date, msgs }) => (
            <div key={date} className="space-y-1">
              <div className="flex items-center gap-3 py-2">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground font-sans font-medium px-2">
                  {date}
                </span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {msgs.map((msg, idx) => {
                const isOwn = msg.fromUserId === user?.id;
                const showAvatar =
                  !isOwn &&
                  (idx === 0 || msgs[idx - 1]?.fromUserId !== msg.fromUserId);
                const hasText =
                  msg.content && msg.content.trim() && msg.content !== " ";

                return (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex items-end gap-2",
                      isOwn ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    <div className="w-7 flex-shrink-0">
                      {!isOwn && showAvatar && (
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                            JS
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>

                    <div
                      className={cn(
                        "max-w-[75%] sm:max-w-[65%] flex flex-col gap-1",
                        isOwn ? "items-end" : "items-start"
                      )}
                    >
                      {/* Attachment bubble */}
                      {msg.attachmentUrl && (
                        <AttachmentBubble
                          url={msg.attachmentUrl}
                          fileName={msg.attachmentName}
                          mimeType={msg.attachmentType}
                          fileSize={msg.attachmentSize}
                          isFromMe={isOwn}
                        />
                      )}

                      {/* Text bubble (only if there's actual text) */}
                      {hasText && (
                        <div
                          className={cn(
                            "px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm font-sans",
                            isOwn
                              ? "bg-primary text-primary-foreground rounded-br-sm"
                              : "bg-card border border-border text-foreground rounded-bl-sm"
                          )}
                        >
                          {msg.content}
                        </div>
                      )}

                      <div className="flex items-center gap-1 px-1">
                        <span className="text-[10px] text-muted-foreground font-sans">
                          {formatTime(msg.createdAt)}
                        </span>
                        {isOwn &&
                          (msg.isRead ? (
                            <CheckCheck className="w-3 h-3 text-secondary" />
                          ) : (
                            <Check className="w-3 h-3 text-muted-foreground" />
                          ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

          {/* Typing indicator */}
          {jessicaIsTyping && (
            <div className="flex items-end gap-2">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                  JS
                </AvatarFallback>
              </Avatar>
              <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                <div className="flex gap-1 items-center h-4">
                  {[0, 1, 2].map(i => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Attachment Preview (before send) */}
        {pendingAttachment && (
          <AttachmentPreview
            attachment={pendingAttachment}
            onRemove={() => setPendingAttachment(null)}
          />
        )}

        {/* Input Area */}
        <div
          className="flex flex-col gap-2 p-3 sm:p-4 border-t border-border bg-card flex-shrink-0"
          style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
        >
          {inputError && (
            <div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
              <svg
                className="w-3.5 h-3.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              {inputError}
            </div>
          )}

          <div className="flex items-end gap-1 sm:gap-2">
            <AttachmentPicker
              onAttachment={setPendingAttachment}
              disabled={sendMutation.isPending}
            />

            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={
                  pendingAttachment ? "Add a caption..." : "Message Jessica..."
                }
                className={cn(
                  "w-full font-sans border-border resize-none min-h-[44px] max-h-[120px] py-2.5 px-3 text-sm leading-relaxed rounded-xl transition-colors",
                  inputError && input.length > MAX_MESSAGE_LENGTH * 0.9
                    ? "border-red-300 focus:border-red-500"
                    : ""
                )}
                rows={1}
              />
              {input.length > 0 && (
                <div
                  className={cn(
                    "absolute bottom-2 right-3 text-xs font-sans",
                    input.length > MAX_MESSAGE_LENGTH * 0.9
                      ? "text-red-600 dark:text-red-400 font-medium"
                      : "text-muted-foreground"
                  )}
                >
                  {input.length}/{MAX_MESSAGE_LENGTH}
                </div>
              )}
            </div>

            <Button
              onClick={handleSend}
              disabled={!canSend}
              size="icon"
              className={cn(
                "h-11 w-11 rounded-full flex-shrink-0 transition-all duration-200",
                canSend
                  ? "bg-primary hover:bg-primary/90 active:scale-95"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
