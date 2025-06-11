"use client";

import type { Message } from "@/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";

interface UserMessageProps {
  message: Message;
}

export function UserMessage({ message }: UserMessageProps) {
  return (
    <div className="flex items-start gap-3 justify-end">
      <div className="bg-primary text-primary-foreground p-3 rounded-lg max-w-[70%] shadow">
        <p className="text-sm">{message.text}</p>
      </div>
      <Avatar className="w-8 h-8 border">
        <AvatarFallback>
          <User className="w-4 h-4" />
        </AvatarFallback>
      </Avatar>
    </div>
  );
}
