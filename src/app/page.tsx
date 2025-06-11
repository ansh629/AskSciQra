"use client";

import React, { useState, useEffect } from 'react';
import { ChatInput } from '@/components/chat/chat-input';
import { MessageList } from '@/components/chat/message-list';
import type { Message, Source } from '@/types';
import { generateInsights, GenerateInsightsInput, GenerateInsightsOutput } from '@/ai/flows/generate-insights';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ThemeToggle } from '@/components/shared/theme-toggle';


export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initial greeting message
  useEffect(() => {
    setMessages([
      {
        id: 'initial-greeting',
        type: 'ai',
        text: "Hello! I'm AskSciQra, your AI assistant for scientific insights. How can I help you today?",
        sources: [],
        rawAnswer: "Hello! I'm AskSciQra, your AI assistant for scientific insights. How can I help you today?",
      }
    ]);
  }, []);


  const handleSendMessage = async (text: string) => {
    const userMessage: Message = { id: Date.now().toString(), type: 'user', text };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    const loadingMessageId = (Date.now() + 1).toString();
    const loadingMessage: Message = { id: loadingMessageId, type: 'loading', text: "Thinking..." };
    setMessages(prev => [...prev, loadingMessage]);

    try {
      const input: GenerateInsightsInput = { question: text };
      const result: GenerateInsightsOutput = await generateInsights(input);
      
      const aiMessage: Message = {
        id: (Date.now() + 2).toString(),
        type: 'ai',
        text: result.answer,
        sources: result.sources,
        rawAnswer: result.answer, // Store raw answer for copy
      };
      setMessages(prev => prev.filter(m => m.id !== loadingMessageId)); // Remove loading
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error("Error fetching AI response:", error);
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        type: 'error',
        text: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
      };
      setMessages(prev => prev.filter(m => m.id !== loadingMessageId)); // Remove loading
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const exampleQuestions = [
    "What are the applications of CRISPR technology?",
    "Explain the theory of general relativity in simple terms.",
    "How do mRNA vaccines work?",
    "What is quantum entanglement?",
  ];

  const handleExampleQuestion = (question: string) => {
    handleSendMessage(question);
  };


  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
        <SidebarTrigger className="md:hidden" />
        <h1 className="text-2xl font-headline font-semibold flex-1">
          AskSciQra
        </h1>
        <ThemeToggle />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        {messages.length <= 1 && !isLoading && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <Image src="https://placehold.co/120x120.png" alt="AskSciQra Logo" width={120} height={120} className="rounded-full mb-6 shadow-md" data-ai-hint="science abstract" />
                <h2 className="text-2xl font-headline font-semibold mb-2 text-foreground">Welcome to AskSciQra</h2>
                <p className="text-muted-foreground mb-6 max-w-md">
                    Ask any scientific question and get answers backed by reliable sources.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                    {exampleQuestions.map((q, i) => (
                        <Button key={i} variant="outline" className="text-left justify-start h-auto py-2" onClick={() => handleExampleQuestion(q)}>
                           {q}
                        </Button>
                    ))}
                </div>
            </div>
        )}
        { (messages.length > 1 || isLoading) && <MessageList messages={messages} /> }
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}
