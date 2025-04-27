export function convertToCSV(data: any[], includeHeaders = true): string {
  if (!data || !data.length) return '';

  // Get headers from the first object
  const headers = Object.keys(data[0]);
  
  // Create CSV rows
  const rows = data.map(obj =>
    headers.map(header => {
      let cell = obj[header];
      
      // Handle arrays
      if (Array.isArray(cell)) {
        cell = cell.join(', ');
      }
      
      // Handle objects
      if (typeof cell === 'object' && cell !== null) {
        cell = JSON.stringify(cell);
      }
      
      // Escape quotes and wrap in quotes if contains comma
      if (typeof cell === 'string') {
        cell = cell.replace(/"/g, '""');
        if (cell.includes(',')) {
          cell = `"${cell}"`;
        }
      }
      
      return cell;
    }).join(',')
  );

  // Add headers if requested
  if (includeHeaders) {
    rows.unshift(headers.join(','));
  }

  return rows.join('\n');
}

export function downloadCSV(data: any[], filename: string) {
  const csv = convertToCSV(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (navigator.msSaveBlob) { // IE 10+
    navigator.msSaveBlob(blob, filename);
  } else {
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
} 