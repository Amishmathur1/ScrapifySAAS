'use client';

import { useState } from 'react';
import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import NextTopLoader from 'nextjs-toploader';
import { ChatProvider } from '@/contexts/ChatContext';
import { ChatBot } from '@/components/ChatBot';

export default function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <NextTopLoader color="#10b981" showSpinner={false} />
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <ChatProvider>
          {children}
          <ChatBot />
        </ChatProvider>
      </ThemeProvider>
      {/* <ReactQueryDevtools /> */}
    </QueryClientProvider>
  );
}
