'use client';

import { useState } from 'react';
import { Table, Filter, FileText, Tag } from 'lucide-react';
import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DownloadOptions } from './download-options';

interface ScrapedDataViewProps {
  data: any[];
  summary?: {
    summary: string;
    patterns: string[];
    insights: string[];
    suggestedTags: string[];
  };
  showSummary?: boolean;
}

export function ScrapedDataView({ data, summary, showSummary = false }: ScrapedDataViewProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Get headers from the first item if data exists
  const headers = data?.length > 0 ? Object.keys(data[0]) : [];

  // Filter data based on search term
  const filteredData = data?.filter(item => 
    Object.values(item).some(value => 
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (showSummary && summary)
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            AI Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Summary</h3>
            <p className="text-muted-foreground">{summary.summary}</p>
          </div>

          {summary.patterns.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Key Patterns</h3>
              <ul className="list-disc pl-4 text-muted-foreground">
                {summary.patterns.map((pattern, i) => (
                  <li key={i}>{pattern}</li>
                ))}
              </ul>
            </div>
          )}

          {summary.insights.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Insights</h3>
              <ul className="list-disc pl-4 text-muted-foreground">
                {summary.insights.map((insight, i) => (
                  <li key={i}>{insight}</li>
                ))}
              </ul>
            </div>
          )}

          {summary.suggestedTags.length > 0 && (
            <div>
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Suggested Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {summary.suggestedTags.map((tag, i) => (
                  <Badge key={i} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Data Available</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No scraped data to display.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Table className="w-4 h-4" />
            Scraped Data
          </CardTitle>
          <DownloadOptions data={data} filename="scraped-data" />
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search data..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <UITable>
            <TableHeader>
              <TableRow>
                {headers.map((header) => (
                  <TableHead key={header} className="capitalize">
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item, index) => (
                <TableRow key={index}>
                  {headers.map((header) => (
                    <TableCell key={header}>
                      {Array.isArray(item[header])
                        ? item[header].join(', ')
                        : typeof item[header] === 'object'
                        ? JSON.stringify(item[header])
                        : String(item[header])}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </UITable>
        </div>
      </CardContent>
    </Card>
  );
} 