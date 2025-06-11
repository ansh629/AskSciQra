"use client";

import React, { useEffect, useRef } from 'react';
import type { Message } from "@/types";
import { UserMessage } from "./user-message";
import { AIMessage } from "./ai-message";

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div ref={scrollAreaRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
      {messages.map((msg) =>
        msg.type === 'user' ? (
          <UserMessage key={msg.id} message={msg} />
        ) : (
          <AIMessage key={msg.id} message={msg} />
        )
      )}
    </div>
  );
}
