'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Loader2Icon, Download, FileText, AlertCircle } from 'lucide-react';
import { ExecutionPhaseList } from '@/app/workflow/runs/[workflowId]/_components/execution-phase-list';
import { ScrapedDataView } from './_components/scraped-data-view';
import { DataAnalysis } from './_components/data-analysis';
import { DownloadOptions } from './_components/download-options';
import { summarizeData } from '@/lib/summarize-data';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function WorkflowExecutionPage() {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [executionData, setExecutionData] = useState<any>(null);
  const [scrapedData, setScrapedData] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const validateApiKey = async () => {
      try {
        const response = await fetch('/api/test-openai');
        const data = await response.json();
        if (!data.valid) {
          setApiError(data.message);
        }
      } catch (error: any) {
        setApiError(error.message);
      }
    };

    validateApiKey();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch execution data
        const response = await fetch(`/api/workflow/execution/${params.workflowId}`);
        const data = await response.json();
        setExecutionData(data);
        
        // Extract scraped data from the execution phases
        const extractPhase = data.phases
          .find((phase: any) => phase.type === 'EXTRACT_TEXT_FROM_ELEMENT');
        
        if (extractPhase?.outputs) {
          try {
            const extractedData = JSON.parse(extractPhase.outputs);
            const formattedData = Array.isArray(extractedData) ? extractedData : [extractedData];
            setScrapedData(formattedData);

            // Get AI summary of the data if API key is valid
            if (formattedData.length > 0 && !apiError) {
              const dataSummary = await summarizeData(formattedData);
              setSummary(dataSummary);
            }
          } catch (error) {
            console.error('Error parsing extracted data:', error);
          }
        }
      } catch (error) {
        console.error('Error fetching execution data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.workflowId, apiError]);

  const handleDownload = async (format: 'json' | 'csv') => {
    try {
      const response = await fetch(`/api/workflow/execution/${params.workflowId}/download?format=${format}`);
      if (!response.ok) {
        throw new Error('Failed to download data');
      }
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `execution-${params.workflowId}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading data:', error);
    }
  };

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Loader2Icon className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  // Convert summary to a format suitable for download
  const summaryData = summary ? [{
    summary: summary.summary,
    patterns: summary.patterns.join(', '),
    insights: summary.insights.join(', '),
    suggestedTags: summary.suggestedTags.join(', ')
  }] : [];

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header with title and download button */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Workflow Execution</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download Results
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleDownload('json')}>
              Download as JSON
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDownload('csv')}>
              Download as CSV
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {apiError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>OpenAI API Error</AlertTitle>
          <AlertDescription>
            {apiError}. Please check your API key in the .env file.
          </AlertDescription>
        </Alert>
      )}

      {/* Download Options */}
      <div className="flex justify-end gap-2">
        {summary && (
          <DownloadOptions 
            data={summaryData} 
            filename={`workflow-${params.workflowId}-ai-analysis`} 
          />
        )}
        {scrapedData.length > 0 && (
          <DownloadOptions 
            data={scrapedData} 
            filename={`workflow-${params.workflowId}-data`} 
          />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <ExecutionPhaseList execution={executionData} />
          {summary && <DataAnalysis summary={summary} />}
        </div>

        {/* Right Column */}
        <div>
          <ScrapedDataView data={scrapedData} />
        </div>
      </div>
    </div>
  );
}
