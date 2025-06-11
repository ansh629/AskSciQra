"use client";

import React, { useMemo } from 'react';
import type { Message, Source } from "@/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Link2, BookOpen } from "lucide-react";
import { SourceItem } from "./source-item";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface AnswerCardProps {
  message: Message;
}

export function AnswerCard({ message }: AnswerCardProps) {
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(message.rawAnswer || message.text);
    toast({
      title: "Copied to clipboard!",
      description: "The answer has been copied.",
    });
  };

  const formattedText = useMemo(() => {
    if (!message.text) return null;

    const parts = message.text.split(/(\[\d+\])/g);
    return parts.map((part, index) => {
      const citationMatch = part.match(/\[(\d+)\]/);
      if (citationMatch) {
        const citationNumber = parseInt(citationMatch[1], 10);
        const source = message.sources?.[citationNumber - 1];
        if (source) {
          return (
            <Popover key={index}>
              <PopoverTrigger asChild>
                <span className="text-primary font-semibold hover:underline cursor-pointer">
                  [{citationNumber}]
                </span>
              </PopoverTrigger>
              <PopoverContent className="w-80 text-sm p-3">
                <p className="font-bold">{source.title}</p>
                <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary break-all flex items-center gap-1">
                  <Link2 className="w-3 h-3 inline-block mr-1"/> {source.url}
                </a>
              </PopoverContent>
            </Popover>
          );
        }
      }
      return <span key={index}>{part}</span>;
    });
  }, [message.text, message.sources]);

  return (
    <Card className="shadow-lg border-primary/20">
      <CardContent className="p-4">
        <div className="prose prose-sm dark:prose-invert max-w-none text-foreground">
          {formattedText}
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t flex flex-col items-start gap-2">
        {message.sources && message.sources.length > 0 && (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="sources">
              <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  View Sources ({message.sources.length})
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2">
                {message.sources.map((source, idx) => (
                  <SourceItem key={idx} source={source} index={idx} />
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
        <Button variant="outline" size="sm" onClick={handleCopy} className="mt-2 self-end">
          <Copy className="mr-2 h-4 w-4" />
          Copy Answer
        </Button>
      </CardFooter>
    </Card>
  );
}
