'use client';

import { FileText, Tag, Lightbulb, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DownloadOptions } from './download-options';

interface DataAnalysisProps {
  summary: {
    summary: string;
    patterns: string[];
    insights: string[];
    suggestedTags: string[];
  };
}

export function DataAnalysis({ summary }: DataAnalysisProps) {
  // Convert summary to a format suitable for download
  const summaryData = [{
    summary: summary.summary,
    patterns: summary.patterns.join(', '),
    insights: summary.insights.join(', '),
    suggestedTags: summary.suggestedTags.join(', ')
  }];

  return (
    <Card className="bg-card/50 backdrop-blur">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            AI Analysis
          </CardTitle>
          <DownloadOptions data={summaryData} filename="ai-analysis" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Section */}
        <div>
          <h3 className="font-medium mb-2 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-primary" />
            Summary
          </h3>
          <p className="text-muted-foreground">{summary.summary}</p>
        </div>

        {/* Patterns Section */}
        {summary.patterns.length > 0 && (
          <div>
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Key Patterns
            </h3>
            <ul className="list-disc pl-4 text-muted-foreground space-y-1">
              {summary.patterns.map((pattern, i) => (
                <li key={i}>{pattern}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Insights Section */}
        {summary.insights.length > 0 && (
          <div>
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-primary" />
              Insights
            </h3>
            <ul className="list-disc pl-4 text-muted-foreground space-y-1">
              {summary.insights.map((insight, i) => (
                <li key={i}>{insight}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Tags Section */}
        {summary.suggestedTags.length > 0 && (
          <div>
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <Tag className="w-4 h-4 text-primary" />
              Suggested Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {summary.suggestedTags.map((tag, i) => (
                <Badge key={i} variant="secondary" className="bg-primary/10">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 