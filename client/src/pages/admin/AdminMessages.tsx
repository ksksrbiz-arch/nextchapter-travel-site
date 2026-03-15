import { AdminLayout } from "./AdminDashboard";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/_core/hooks/useAuth";
import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import {
  Send,
  MessageSquare,
  Users,
  CheckCheck,
  Check,
  Wifi,
  WifiOff,
  Circle,
} from "lucide-react";
import { useSearch } from "wouter";
import { cn } from "@/lib/utils";
import { useSSEMessages, SSEMessagePayload } from "@/hooks/useSSEMessages";
import {
  AttachmentPicker,
  AttachmentPreview,
  AttachmentBubble,
  AttachmentMeta,
} from "@/components/ChatAttachment";

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

type Client = {
  id: number;
  name: string | null;
  email: string | null;
  role: string;
};

export default function AdminMessages() {
  const { user } = useAuth();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const defaultClientId = params.get("client")
    ? Number(params.get("client"))
    : undefined;

  const { data: clients } = trpc.admin.clients.useQuery();
  const [selectedClientId, setSelectedClientId] = useState<number | null>(
    defaultClientId ?? null
  );
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [clientTyping, setClientTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);
  const [pendingAttachment, setPendingAttachment] =
    useState<AttachmentMeta | null>(null);
  // Track unread counts per client
  const [unreadCounts, setUnreadCounts] = useState<Record<number, number>>({});
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const selectedClient = (clients as Client[] | undefined)?.find(
    c => c.id === selectedClientId
  );
  // Only show non-admin clients
  const clientList =
    (clients as Client[] | undefined)?.filter(c => c.role !== "admin") ?? [];

  // Load initial messages for selected client
  const { data: initialMessages, isLoading } = trpc.messages.list.useQuery(
    { otherUserId: selectedClientId! },
    { enabled: !!selectedClientId }
  );

  useEffect(() => {
    if (initialMessages) {
      setMessages(initialMessages as Message[]);
    }
  }, [initialMessages, selectedClientId]);

  // Mark messages as read when client is selected
  const markRead = trpc.messages.markRead.useMutation({
    onSuccess: () => {
      if (selectedClientId) {
        setUnreadCounts(prev => ({ ...prev, [selectedClientId]: 0 }));
      }
    },
  });

  useEffect(() => {
    if (selectedClientId && messages.length > 0) {
      const hasUnread = messages.some(
        m => m.fromUserId === selectedClientId && !m.isRead
      );
      if (hasUnread) {
        markRead.mutate({ fromUserId: selectedClientId });
      }
    }
  }, [selectedClientId, messages.length]);

  // Typing indicator mutation
  const typingMutation = trpc.messages.typing.useMutation();

  // SSE real-time connection
  const handleSSEMessage = useCallback(
    (msg: SSEMessagePayload) => {
      if (!user) return;
      const isRelevant =
        (msg.fromUserId === user.id && msg.toUserId === selectedClientId) ||
        (msg.fromUserId === selectedClientId && msg.toUserId === user.id);

      if (isRelevant) {
        setMessages(prev => {
          if (prev.find(m => m.id === msg.id)) return prev;
          return [...prev, { ...msg, createdAt: new Date(msg.createdAt) }];
        });
        // Auto-mark as read if we're viewing this thread
        if (msg.fromUserId === selectedClientId && selectedClientId) {
          markRead.mutate({ fromUserId: selectedClientId });
        }
      } else if (msg.toUserId === user.id) {
        // Increment unread badge for other clients
        setUnreadCounts(prev => ({
          ...prev,
          [msg.fromUserId]: (prev[msg.fromUserId] ?? 0) + 1,
        }));
      }
    },
    [user, selectedClientId]
  );

  const handleSSETyping = useCallback(
    (evt: { fromUserId: number; isTyping: boolean }) => {
      if (evt.fromUserId === selectedClientId) {
        setClientTyping(evt.isTyping);
      }
    },
    [selectedClientId]
  );

  const handleSSERead = useCallback(
    (evt: { byUserId: number }) => {
      if (evt.byUserId === selectedClientId) {
        setMessages(prev =>
          prev.map(m =>
            m.fromUserId === user?.id ? { ...m, isRead: true } : m
          )
        );
      }
    },
    [selectedClientId, user]
  );

  const { connected } = useSSEMessages({
    onMessage: handleSSEMessage,
    onTyping: handleSSETyping,
    onRead: handleSSERead,
    enabled: !!user,
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, clientTyping]);

  const sendMutation = trpc.messages.send.useMutation({
    onError: () => toast.error("Failed to send message."),
  });

  const handleSend = () => {
    if ((!input.trim() && !pendingAttachment) || !selectedClientId) return;
    const content = input.trim();
    const att = pendingAttachment;
    const optimistic: Message = {
      id: Date.now(),
      fromUserId: user!.id,
      toUserId: selectedClientId,
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
      toUserId: selectedClientId,
      content: content || " ",
      attachmentUrl: att?.url,
      attachmentName: att?.fileName,
      attachmentType: att?.mimeType,
      attachmentSize: att?.fileSize,
    });
    if (typingTimeout) clearTimeout(typingTimeout);
    typingMutation.mutate({ toUserId: selectedClientId, isTyping: false });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
    if (!selectedClientId) return;
    if (typingTimeout) clearTimeout(typingTimeout);
    typingMutation.mutate({ toUserId: selectedClientId, isTyping: true });
    const t = setTimeout(() => {
      typingMutation.mutate({ toUserId: selectedClientId, isTyping: false });
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

  return (
    <AdminLayout title="Messages" subtitle="Real-time client communication">
      <div className="flex gap-0 h-[calc(100dvh-12rem)] rounded-2xl border border-border overflow-hidden bg-card">
        {/* Client Thread List */}
        <div className="w-64 xl:w-72 flex-shrink-0 border-r border-border flex flex-col">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="font-serif font-semibold text-foreground text-sm">
              Conversations
            </h3>
            <div className="flex items-center gap-1.5">
              {connected ? (
                <span className="flex items-center gap-1 text-xs text-emerald-600">
                  <Wifi className="w-3 h-3" /> Live
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <WifiOff className="w-3 h-3" /> Offline
                </span>
              )}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {clientList.length === 0 ? (
              <div className="p-6 text-center">
                <Users className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground font-sans text-xs">
                  No clients yet
                </p>
              </div>
            ) : (
              clientList.map(client => {
                const unread = unreadCounts[client.id] ?? 0;
                const isSelected = selectedClientId === client.id;
                return (
                  <button
                    key={client.id}
                    onClick={() => {
                      setSelectedClientId(client.id);
                      setMessages([]);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors border-b border-border/40",
                      isSelected
                        ? "bg-primary/5 border-l-2 border-l-primary"
                        : "hover:bg-muted/40"
                    )}
                  >
                    <div className="relative flex-shrink-0">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-primary/10 text-primary font-serif font-bold text-sm">
                          {client.name?.charAt(0) ?? "?"}
                        </AvatarFallback>
                      </Avatar>
                      {unread > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[9px] flex items-center justify-center font-bold">
                          {unread > 9 ? "9+" : unread}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "font-sans text-sm truncate",
                          unread > 0
                            ? "font-semibold text-foreground"
                            : "font-medium text-foreground"
                        )}
                      >
                        {client.name ?? "Unknown"}
                      </p>
                      <p className="font-sans text-xs text-muted-foreground truncate">
                        {client.email ?? ""}
                      </p>
                    </div>
                    {unread > 0 && (
                      <Circle className="w-2 h-2 fill-primary text-primary flex-shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {!selectedClientId ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center px-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-serif font-semibold text-foreground mb-2">
                  Select a Conversation
                </h3>
                <p className="text-muted-foreground font-sans text-sm max-w-xs">
                  Choose a client from the left to view and send messages in
                  real time.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card flex-shrink-0">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary/10 text-primary font-serif font-bold text-sm">
                    {selectedClient?.name?.charAt(0) ?? "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-serif font-semibold text-foreground text-sm leading-tight">
                    {selectedClient?.name ?? "Client"}
                  </p>
                  <p className="text-xs text-muted-foreground font-sans leading-tight">
                    {clientTyping ? (
                      <span className="text-emerald-600 flex items-center gap-1">
                        <span className="animate-pulse">●</span> Typing...
                      </span>
                    ) : (
                      (selectedClient?.email ?? "")
                    )}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-1 bg-muted/10">
                {isLoading && (
                  <div className="flex justify-center py-8">
                    <div className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <div
                          key={i}
                          className="w-2 h-2 rounded-full bg-muted-foreground/30 animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {!isLoading && messages.length === 0 && (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground font-sans text-sm">
                      No messages yet. Start the conversation!
                    </p>
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
                      const isFromMe = msg.fromUserId === user?.id;
                      const showAvatar =
                        !isFromMe &&
                        (idx === 0 ||
                          msgs[idx - 1]?.fromUserId !== msg.fromUserId);

                      return (
                        <div
                          key={msg.id}
                          className={cn(
                            "flex items-end gap-2",
                            isFromMe ? "flex-row-reverse" : "flex-row"
                          )}
                        >
                          <div className="w-7 flex-shrink-0">
                            {!isFromMe && showAvatar && (
                              <Avatar className="h-7 w-7">
                                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                                  {selectedClient?.name?.charAt(0) ?? "?"}
                                </AvatarFallback>
                              </Avatar>
                            )}
                          </div>
                          <div
                            className={cn(
                              "max-w-[70%] flex flex-col gap-1",
                              isFromMe ? "items-end" : "items-start"
                            )}
                          >
                            {msg.attachmentUrl && (
                              <AttachmentBubble
                                url={msg.attachmentUrl}
                                fileName={msg.attachmentName}
                                mimeType={msg.attachmentType}
                                fileSize={msg.attachmentSize}
                                isFromMe={isFromMe}
                              />
                            )}
                            {msg.content &&
                              msg.content.trim() &&
                              msg.content !== " " && (
                                <div
                                  className={cn(
                                    "px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm font-sans",
                                    isFromMe
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
                              {isFromMe &&
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

                {/* Client typing indicator */}
                {clientTyping && (
                  <div className="flex items-end gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                        {selectedClient?.name?.charAt(0) ?? "?"}
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

              {/* Input */}
              {pendingAttachment && (
                <AttachmentPreview
                  attachment={pendingAttachment}
                  onRemove={() => setPendingAttachment(null)}
                />
              )}
              <div className="flex items-end gap-1 p-4 border-t border-border bg-card flex-shrink-0">
                <AttachmentPicker
                  onAttachment={setPendingAttachment}
                  disabled={sendMutation.isPending}
                />
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    pendingAttachment
                      ? "Add a caption..."
                      : `Message ${selectedClient?.name ?? "client"}...`
                  }
                  className="flex-1 font-sans border-border resize-none min-h-[44px] max-h-[120px] py-2.5 text-sm leading-relaxed rounded-xl"
                  rows={1}
                />
                <Button
                  onClick={handleSend}
                  disabled={
                    (!input.trim() && !pendingAttachment) ||
                    sendMutation.isPending ||
                    !selectedClientId
                  }
                  size="icon"
                  className={cn(
                    "h-11 w-11 rounded-full flex-shrink-0 transition-all duration-200",
                    input.trim() || pendingAttachment
                      ? "bg-primary hover:bg-primary/90 active:scale-95"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
