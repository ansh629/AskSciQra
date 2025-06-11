
import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { SidebarProvider, Sidebar, SidebarInset, SidebarHeader, SidebarTrigger } from '@/components/ui/sidebar';
import { Toaster } from "@/components/ui/toaster";
import { BrainCircuit } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AskSciQra',
  description: 'AI-Powered Question Answering with Citations',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Carlito:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning={true}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SidebarProvider defaultOpen={true}>
            <Sidebar className="bg-card border-r" collapsible="icon">
              <SidebarHeader className="p-4 flex items-center gap-2">
                 <BrainCircuit className="h-8 w-8 text-primary" />
                 <h1 className="text-xl font-headline font-semibold group-data-[collapsible=icon]:hidden">AskSciQra</h1>
              </SidebarHeader>
              {/* Add SidebarMenu here if navigation items are needed later, e.g. for History page */}
            </Sidebar>
            <SidebarInset>
              {children}
            </SidebarInset>
          </SidebarProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
