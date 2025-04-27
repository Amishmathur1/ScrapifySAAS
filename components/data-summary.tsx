'use client';

import { useState } from 'react';
import { Download, FileDown, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { downloadCSV } from '@/lib/convert-to-csv';

interface DataSummaryProps {
  data: any[];
  summary: {
    summary: string;
    patterns: string[];
    insights: string[];
    suggestedTags: string[];
  };
}

export function DataSummary({ data, summary }: DataSummaryProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    try {
      downloadCSV(data, 'scraped-data.csv');
    } catch (error) {
      console.error('Error downloading CSV:', error);
    }
    setDownloading(false);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Data Summary
          </CardTitle>
          <CardDescription>AI-generated summary of your scraped data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Overview</h3>
            <p className="text-muted-foreground">{summary.summary}</p>
          </div>

          <div>
            <h3 className="font-medium mb-2">Key Patterns</h3>
            <ul className="list-disc pl-4 text-muted-foreground">
              {summary.patterns.map((pattern, i) => (
                <li key={i}>{pattern}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-2">Insights</h3>
            <ul className="list-disc pl-4 text-muted-foreground">
              {summary.insights.map((insight, i) => (
                <li key={i}>{insight}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-2">Suggested Tags</h3>
            <div className="flex flex-wrap gap-2">
              {summary.suggestedTags.map((tag, i) => (
                <Badge key={i} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Button 
        onClick={handleDownload} 
        className="w-full"
        disabled={downloading}
      >
        <Download className="w-4 h-4 mr-2" />
        {downloading ? 'Downloading...' : 'Download as CSV'}
      </Button>
    </div>
  );
} 