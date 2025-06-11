"use client";

import React from 'react';
import { ThemeToggle } from './theme-toggle';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
        <SidebarTrigger className="md:hidden" />
        <h1 className="text-2xl font-headline font-semibold flex-1">
          AskSciQra
        </h1>
      <ThemeToggle />
    </header>
  );
}
