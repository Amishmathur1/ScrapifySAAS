'use client';

import { CheckCircle, Clock, AlertCircle, Loader2, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';

interface ExecutionPhase {
  id: string;
  type: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  startedAt: string | null;
  completedAt: string | null;
  error?: string;
  outputs?: string | null;
}

interface ExecutionPhaseListProps {
  execution: {
    id: string;
    phases: ExecutionPhase[];
  } | null;
}

export function ExecutionPhaseList({ execution }: ExecutionPhaseListProps) {
  if (!execution) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Execution Phases</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No execution data available.</p>
        </CardContent>
      </Card>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'RUNNING':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'FAILED':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'RUNNING':
        return 'bg-blue-100 text-blue-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDownload = (phase: ExecutionPhase, format: 'json' | 'csv') => {
    if (!phase.outputs) return;

    try {
      const data = JSON.parse(phase.outputs);
      let content: string;
      let mimeType: string;
      let extension: string;

      if (format === 'json') {
        content = JSON.stringify(data, null, 2);
        mimeType = 'application/json';
        extension = 'json';
      } else {
        // Convert to CSV
        const headers = Object.keys(data[0] || {}).join(',');
        const rows = data.map((item: any) => 
          Object.values(item)
            .map(val => typeof val === 'string' ? `"${val}"` : val)
            .join(',')
        );
        content = [headers, ...rows].join('\n');
        mimeType = 'text/csv';
        extension = 'csv';
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `phase-${phase.id}-output.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error parsing phase outputs:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Execution Phases</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {execution.phases.map((phase) => (
            <div key={phase.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(phase.status)}
                  <span className="font-medium">{phase.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  {phase.status === 'COMPLETED' && phase.outputs && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleDownload(phase, 'json')}>
                          Download as JSON
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownload(phase, 'csv')}>
                          Download as CSV
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                  <Badge className={getStatusColor(phase.status)}>
                    {phase.status}
                  </Badge>
                </div>
              </div>
              
              {phase.error && (
                <div className="mt-2 text-sm text-red-500">
                  Error: {phase.error}
                </div>
              )}
              
              <div className="mt-2 text-sm text-gray-500">
                {phase.startedAt && (
                  <div>Started: {format(new Date(phase.startedAt), 'PPpp')}</div>
                )}
                {phase.completedAt && (
                  <div>Completed: {format(new Date(phase.completedAt), 'PPpp')}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 