"use client";

import { useState, useRef, useEffect } from "react";
import { voiceAssistantCropInformation } from "@/ai/flows/voice-assistant-crop-information";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bot, Mic, Send, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/componentsui/alert";
import { AlertCircle } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function VoiceAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input || loading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const response = await voiceAssistantCropInformation({ query: input });
      const assistantMessage: Message = { role: "assistant", content: response.response };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error with voice assistant:", error);
      setError("Sorry, I'm having trouble connecting. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Voice Assistant</h1>
        <p className="text-muted-foreground">
          Ask me anything about crop health, weather, or farming actions.
        </p>
      </div>

      <Card className="h-[70vh] flex flex-col">
        <CardHeader>
          <CardTitle>Conversation</CardTitle>
          <CardDescription>Your chat history with the assistant.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col gap-4 overflow-hidden">
          <ScrollArea className="flex-grow pr-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.length === 0 && !loading && !error && (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                  <Bot className="h-12 w-12 mb-4" />
                  <p className="text-lg font-medium">I am your farming assistant.</p>
                  <p>Ask me about crop prices, weather, or pest control.</p>
                </div>
              )}
              {messages.map((message, index) => (
                <div key={index} className={cn("flex items-start gap-4", message.role === "user" ? "justify-end" : "justify-start")}>
                  {message.role === "assistant" && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback><Bot/></AvatarFallback>
                    </Avatar>
                  )}
                  <div className={cn("max-w-[75%] rounded-lg p-3 text-sm", message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted")}>
                    {message.content}
                  </div>
                   {message.role === "user" && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback><User/></AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {loading && (
                 <div className="flex items-start gap-4 justify-start">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback><Bot/></AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-lg p-3">
                        <Skeleton className="h-4 w-12" />
                    </div>
                 </div>
              )}
            </div>
          </ScrollArea>
           {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t pt-4">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question here..."
              disabled={loading}
              className="flex-grow"
            />
            <Button type="button" variant="outline" size="icon" disabled>
              <Mic className="h-4 w-4" />
              <span className="sr-only">Use voice (coming soon)</span>
            </Button>
            <Button type="submit" size="icon" disabled={loading || !input}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
