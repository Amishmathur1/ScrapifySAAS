'use client';

import { useState } from 'react';
import { Download, FileJson, FileSpreadsheet, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { downloadCSV } from '@/lib/convert-to-csv';

interface DownloadOptionsProps {
  data: any[];
  filename?: string;
}

export function DownloadOptions({ data, filename = 'scraped-data' }: DownloadOptionsProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = (format: string) => {
    setDownloading(true);
    try {
      switch (format) {
        case 'csv':
          downloadCSV(data, `${filename}.csv`);
          break;
        case 'json':
          const jsonBlob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
          const jsonUrl = URL.createObjectURL(jsonBlob);
          const jsonLink = document.createElement('a');
          jsonLink.href = jsonUrl;
          jsonLink.download = `${filename}.json`;
          document.body.appendChild(jsonLink);
          jsonLink.click();
          document.body.removeChild(jsonLink);
          URL.revokeObjectURL(jsonUrl);
          break;
        case 'txt':
          const txtBlob = new Blob([JSON.stringify(data, null, 2)], { type: 'text/plain' });
          const txtUrl = URL.createObjectURL(txtBlob);
          const txtLink = document.createElement('a');
          txtLink.href = txtUrl;
          txtLink.download = `${filename}.txt`;
          document.body.appendChild(txtLink);
          txtLink.click();
          document.body.removeChild(txtLink);
          URL.revokeObjectURL(txtUrl);
          break;
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
    setDownloading(false);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={downloading}>
          <Download className="w-4 h-4 mr-2" />
          {downloading ? 'Downloading...' : 'Download Data'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleDownload('csv')}>
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleDownload('json')}>
          <FileJson className="w-4 h-4 mr-2" />
          JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleDownload('txt')}>
          <FileText className="w-4 h-4 mr-2" />
          Text
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 