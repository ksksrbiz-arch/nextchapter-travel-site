import { useState } from "react";
import {
  Languages,
  Plus,
  Trash2,
  Volume2,
  Copy,
  CheckCircle2,
  Circle,
  Bookmark,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FormFieldWrapper } from "@/components/ui/form-errors";
import { EmptyState } from "@/components/ui/empty-states";

interface TranslationPhrase {
  id: string;
  englishText: string;
  translatedText: string;
  targetLanguage: string;
  category: string;
  pronunciation?: string;
  saved: boolean;
  usageCount: number;
}

interface TranslationSession {
  id: string;
  destination: string;
  language: string;
  phrases: TranslationPhrase[];
  createdAt: string;
}

const LANGUAGES = [
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Japanese",
  "Mandarin Chinese",
  "Korean",
  "Thai",
  "Vietnamese",
  "Arabic",
  "Hindi",
  "Russian",
  "Turkish",
  "Polish",
];

const CATEGORIES = [
  "Greetings",
  "Dining",
  "Directions",
  "Shopping",
  "Emergency",
  "Numbers",
  "Time & Date",
  "Medical",
  "Accommodations",
  "Transportation",
  "Cultural",
];

const COMMON_PHRASES: Record<string, Record<string, string>> = {
  Spanish: {
    Hello: "Hola",
    "Thank you": "Gracias",
    Please: "Por favor",
    "Excuse me": "Disculpe",
    "Where is the bathroom?": "¿Dónde está el baño?",
    "How much does this cost?": "¿Cuánto cuesta esto?",
    "Do you speak English?": "¿Habla inglés?",
    "I need help": "Necesito ayuda",
    "Where is the nearest hospital?": "¿Dónde está el hospital más cercano?",
    "Can I have the bill?": "¿Puedo tener la cuenta?",
  },
  French: {
    Hello: "Bonjour",
    "Thank you": "Merci",
    Please: "S'il vous plaît",
    "Excuse me": "Excusez-moi",
    "Where is the bathroom?": "Où se trouve la salle de bain?",
    "How much does this cost?": "Combien ça coûte?",
    "Do you speak English?": "Parlez-vous anglais?",
    "I need help": "J'ai besoin d'aide",
    "Where is the nearest hospital?": "Où est l'hôpital le plus proche?",
    "Can I have the bill?": "Puis-je avoir l'addition?",
  },
  Japanese: {
    Hello: "こんにちは (Konnichiwa)",
    "Thank you": "ありがとうございます (Arigatou gozaimasu)",
    Please: "お願いします (Onegai shimasu)",
    "Excuse me": "すみません (Sumimasen)",
    "Where is the bathroom?": "トイレはどこですか？ (Toire wa doko desu ka?)",
    "How much does this cost?": "これはいくらですか？ (Kore wa ikura desu ka?)",
    "Do you speak English?": "英語を話しますか？ (Eigo wo hanashimasu ka?)",
    "I need help": "助けが必要です (Tasuke ga hitsuyou desu)",
  },
};

export function TranslationHelper() {
  const [sessions, setSessions] = useState<TranslationSession[]>([
    {
      id: "1",
      destination: "Barcelona, Spain",
      language: "Spanish",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      phrases: [
        {
          id: "1",
          englishText: "Where is the nearest restaurant?",
          translatedText: "¿Dónde está el restaurante más cercano?",
          targetLanguage: "Spanish",
          category: "Dining",
          pronunciation: "¿Dón-de es-tá el res-tau-ran-te más cer-ca-no?",
          saved: true,
          usageCount: 3,
        },
        {
          id: "2",
          englishText: "Thank you very much",
          translatedText: "Muchas gracias",
          targetLanguage: "Spanish",
          category: "Greetings",
          saved: false,
          usageCount: 1,
        },
      ],
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [sessionForm, setSessionForm] = useState({
    destination: "",
    language: "Spanish",
  });
  const [phraseForm, setPhraseForm] = useState({
    englishText: "",
    category: "Greetings",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const validateSessionForm = () => {
    const newErrors: Record<string, string> = {};
    if (!sessionForm.destination.trim())
      newErrors.destination = "Destination required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateSession = () => {
    if (!validateSessionForm()) return;

    const newSession: TranslationSession = {
      id: Date.now().toString(),
      destination: sessionForm.destination,
      language: sessionForm.language,
      createdAt: new Date().toISOString(),
      phrases: [],
    };

    setSessions([newSession, ...sessions]);
    setSessionForm({ destination: "", language: "Spanish" });
    setErrors({});
    setShowForm(false);
  };

  const handleAddPhrase = (sessionId: string) => {
    if (!phraseForm.englishText.trim()) return;

    const commonTranslations =
      COMMON_PHRASES[currentSession?.language || "Spanish"] || {};
    const translation =
      commonTranslations[phraseForm.englishText] || "Translation not available";

    setSessions(
      sessions.map(session => {
        if (session.id === sessionId) {
          return {
            ...session,
            phrases: [
              {
                id: Date.now().toString(),
                englishText: phraseForm.englishText,
                translatedText: translation,
                targetLanguage: session.language,
                category: phraseForm.category,
                saved: false,
                usageCount: 0,
              },
              ...session.phrases,
            ],
          };
        }
        return session;
      })
    );

    setPhraseForm({ englishText: "", category: "Greetings" });
  };

  const handleToggleSaved = (sessionId: string, phraseId: string) => {
    setSessions(
      sessions.map(session => {
        if (session.id === sessionId) {
          return {
            ...session,
            phrases: session.phrases.map(phrase =>
              phrase.id === phraseId
                ? { ...phrase, saved: !phrase.saved }
                : phrase
            ),
          };
        }
        return session;
      })
    );
  };

  const handleDeletePhrase = (sessionId: string, phraseId: string) => {
    setSessions(
      sessions.map(session => {
        if (session.id === sessionId) {
          return {
            ...session,
            phrases: session.phrases.filter(p => p.id !== phraseId),
          };
        }
        return session;
      })
    );
  };

  const handleDeleteSession = (sessionId: string) => {
    setSessions(sessions.filter(s => s.id !== sessionId));
    setSelectedSession(null);
  };

  const handleCopyPhrase = (text: string, phraseId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(phraseId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const currentSession = sessions.find(s => s.id === selectedSession);

  return (
    <div className="space-y-6">
      {!selectedSession ? (
        <>
          {/* Add Session Button */}
          {!showForm && (
            <Button onClick={() => setShowForm(true)} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Create Translation Session
            </Button>
          )}

          {/* Create Session Form */}
          {showForm && (
            <Card className="p-6 border-border/50">
              <h3 className="text-lg font-semibold mb-4">
                New Translation Session
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <FormFieldWrapper error={errors.destination}>
                    <input
                      type="text"
                      placeholder="Destination"
                      value={sessionForm.destination}
                      onChange={e => {
                        setSessionForm({
                          ...sessionForm,
                          destination: e.target.value,
                        });
                        setErrors({ ...errors, destination: "" });
                      }}
                      className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                    />
                  </FormFieldWrapper>

                  <select
                    value={sessionForm.language}
                    onChange={e =>
                      setSessionForm({
                        ...sessionForm,
                        language: e.target.value,
                      })
                    }
                    className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
                  >
                    {LANGUAGES.map(lang => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3">
                  <Button onClick={handleCreateSession} className="flex-1">
                    Create Session
                  </Button>
                  <Button
                    onClick={() => {
                      setShowForm(false);
                      setErrors({});
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Sessions List */}
          {sessions.length > 0 ? (
            <div className="space-y-3">
              {sessions.map(session => (
                <Card
                  key={session.id}
                  className="p-4 border-border/50 cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => setSelectedSession(session.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Languages className="w-5 h-5 text-primary" />
                        <h4 className="font-semibold text-foreground">
                          {session.destination}
                        </h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {session.language}
                      </p>
                    </div>

                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handleDeleteSession(session.id);
                      }}
                      className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    {session.phrases.length} phrases • Created{" "}
                    {new Date(session.createdAt).toLocaleDateString()}
                  </p>
                </Card>
              ))}
            </div>
          ) : (
            !showForm && (
              <EmptyState
                icon={Languages}
                title="No Translation Sessions"
                description="Create a session to translate phrases for your destination"
                action={{
                  label: "Create Session",
                  onClick: () => setShowForm(true),
                }}
              />
            )
          )}
        </>
      ) : (
        // Session Detail View
        currentSession && (
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <button
                  onClick={() => setSelectedSession(null)}
                  className="text-primary hover:text-primary/80 text-sm mb-2"
                >
                  ← Back to Sessions
                </button>
                <h2 className="text-2xl font-bold text-foreground">
                  {currentSession.destination}
                </h2>
                <p className="text-muted-foreground">
                  Translating to {currentSession.language}
                </p>
              </div>
            </div>

            {/* Summary */}
            <Card className="bg-gradient-to-br from-purple-950/30 to-pink-950/30 border-purple-500/20 p-6">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-black/20 rounded-lg">
                  <p className="text-xs text-muted-foreground">Total Phrases</p>
                  <p className="text-2xl font-bold text-foreground">
                    {currentSession.phrases.length}
                  </p>
                </div>

                <div className="p-3 bg-black/20 rounded-lg border border-purple-500/30">
                  <p className="text-xs text-purple-300">Saved</p>
                  <p className="text-2xl font-bold text-purple-400">
                    {currentSession.phrases.filter(p => p.saved).length}
                  </p>
                </div>

                <div className="p-3 bg-black/20 rounded-lg">
                  <p className="text-xs text-muted-foreground">Most Used</p>
                  <p className="text-2xl font-bold text-foreground">
                    {Math.max(
                      0,
                      ...currentSession.phrases.map(p => p.usageCount)
                    )}{" "}
                    times
                  </p>
                </div>
              </div>
            </Card>

            {/* Add Phrase Form */}
            <Card className="p-4 border-border/50">
              <h3 className="text-sm font-semibold mb-3">Add Phrase</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter English phrase..."
                  value={phraseForm.englishText}
                  onChange={e =>
                    setPhraseForm({
                      ...phraseForm,
                      englishText: e.target.value,
                    })
                  }
                  className="flex-1 bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                />

                <select
                  value={phraseForm.category}
                  onChange={e =>
                    setPhraseForm({ ...phraseForm, category: e.target.value })
                  }
                  className="w-32 bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                <Button
                  onClick={() => handleAddPhrase(currentSession.id)}
                  size="sm"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </Card>

            {/* Phrases by Category */}
            {CATEGORIES.map(category => {
              const categoryPhrases = currentSession.phrases.filter(
                p => p.category === category
              );
              if (categoryPhrases.length === 0) return null;

              return (
                <Card key={category} className="p-4 border-border/50">
                  <h4 className="font-semibold text-foreground mb-3">
                    {category}
                  </h4>

                  <div className="space-y-3">
                    {categoryPhrases.map(phrase => (
                      <div
                        key={phrase.id}
                        className="p-3 bg-black/20 rounded-lg space-y-2"
                      >
                        {/* English Text */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="text-sm font-medium text-foreground">
                              {phrase.englishText}
                            </div>
                            <Badge variant="outline" className="text-xs mt-1">
                              {phrase.category}
                            </Badge>
                          </div>

                          <button
                            onClick={() =>
                              handleToggleSaved(currentSession.id, phrase.id)
                            }
                            className="text-muted-foreground hover:text-primary transition-colors flex-shrink-0"
                          >
                            {phrase.saved ? (
                              <Bookmark className="w-4 h-4 text-primary fill-primary" />
                            ) : (
                              <Bookmark className="w-4 h-4" />
                            )}
                          </button>
                        </div>

                        {/* Translation */}
                        <div className="flex items-start gap-2">
                          <div className="flex-1">
                            <p className="text-xs text-muted-foreground mb-1">
                              {currentSession.language}
                            </p>
                            <p className="text-sm text-foreground italic">
                              {phrase.translatedText}
                            </p>
                            {phrase.pronunciation && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {phrase.pronunciation}
                              </p>
                            )}
                          </div>

                          <div className="flex gap-1 flex-shrink-0">
                            <button
                              onClick={() =>
                                handleCopyPhrase(
                                  phrase.translatedText,
                                  phrase.id
                                )
                              }
                              className="p-2 hover:bg-primary/10 rounded transition-colors"
                            >
                              {copiedId === phrase.id ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              ) : (
                                <Copy className="w-4 h-4 text-muted-foreground hover:text-primary" />
                              )}
                            </button>

                            <button className="p-2 hover:bg-primary/10 rounded transition-colors">
                              <Volume2 className="w-4 h-4 text-muted-foreground hover:text-primary" />
                            </button>

                            <button
                              onClick={() =>
                                handleDeletePhrase(currentSession.id, phrase.id)
                              }
                              className="p-2 hover:bg-red-500/10 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        </div>

                        {/* Usage Stats */}
                        <div className="text-xs text-muted-foreground">
                          Used {phrase.usageCount} times
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              );
            })}

            {/* Tips */}
            <Card className="p-4 border-blue-500/20 bg-blue-950/10">
              <h4 className="font-semibold text-blue-300 mb-2 flex items-center gap-2">
                <Languages className="w-4 h-4" />
                Language Tips
              </h4>
              <ul className="text-sm text-blue-200/80 space-y-1">
                <li>
                  • Learn common phrases: greetings, thank you, and "help"
                </li>
                <li>• Practice pronunciation before your trip</li>
                <li>• Save frequently used phrases for quick reference</li>
                <li>• Keep offline translation app as backup</li>
                <li>• Use local slang dictionary for cultural immersion</li>
              </ul>
            </Card>
          </div>
        )
      )}
    </div>
  );
}
