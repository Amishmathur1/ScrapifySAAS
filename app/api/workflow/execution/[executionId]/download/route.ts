import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { executionId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get the format from query params
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json';

    // Get the execution and its phases
    const execution = await prisma.workflowExecution.findUnique({
      where: {
        id: params.executionId,
        userId,
      },
      include: {
        phases: {
          orderBy: {
            startedAt: 'desc',
          },
        },
      },
    });

    if (!execution) {
      return new NextResponse('Execution not found', { status: 404 });
    }

    // Get the last completed phase with output data
    const lastPhase = execution.phases.find(phase => 
      phase.status === 'COMPLETED' && phase.outputs
    );

    if (!lastPhase || !lastPhase.outputs) {
      return new NextResponse('No output data available', { status: 404 });
    }

    const data = JSON.parse(lastPhase.outputs);
    let content: string;
    let contentType: string;
    let filename: string;

    if (format === 'csv') {
      // Convert to CSV
      const headers = Object.keys(data[0] || {}).join(',');
      const rows = data.map((item: any) => 
        Object.values(item)
          .map(val => typeof val === 'string' ? `"${val}"` : val)
          .join(',')
      );
      content = [headers, ...rows].join('\n');
      contentType = 'text/csv';
      filename = `execution-${params.executionId}.csv`;
    } else {
      // JSON format
      content = JSON.stringify(data, null, 2);
      contentType = 'application/json';
      filename = `execution-${params.executionId}.json`;
    }

    // Set headers for file download
    const headers = new Headers();
    headers.set('Content-Type', contentType);
    headers.set('Content-Disposition', `attachment; filename="${filename}"`);

    return new NextResponse(content, {
      headers,
    });
  } catch (error) {
    console.error('Error downloading execution data:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 