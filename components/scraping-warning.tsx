'use client';

import { AlertCircle } from 'lucide-react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';

interface ScrapingWarningProps {
  reason: string;
}

export function ScrapingWarning({ reason }: ScrapingWarningProps) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Scraping Not Allowed</AlertTitle>
      <AlertDescription>
        {reason}
        <br />
        <span className="text-sm mt-2 block">
          Please make sure you have permission to scrape this website before proceeding.
        </span>
      </AlertDescription>
    </Alert>
  );
} 