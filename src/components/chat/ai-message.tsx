"use client";

import type { Message } from "@/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AnswerCard } from "./answer-card";
import { BrainCircuit, AlertTriangle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AIMessageProps {
  message: Message;
}

export function AIMessage({ message }: AIMessageProps) {
  return (
    <div className="flex items-start gap-3">
      <Avatar className="w-8 h-8 border bg-primary/10">
        <AvatarFallback className="bg-transparent">
          <BrainCircuit className="w-5 h-5 text-primary" />
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 max-w-[85%]">
        {message.type === 'loading' && (
          <div className="bg-card p-3 rounded-lg shadow flex items-center text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span>Thinking...</span>
          </div>
        )}
        {message.type === 'error' && (
           <Alert variant="destructive" className="shadow">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {message.text || "An error occurred while fetching the answer."}
            </AlertDescription>
          </Alert>
        )}
        {message.type === 'ai' && <AnswerCard message={message} />}
      </div>
    </div>
  );
}
