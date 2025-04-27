import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Check if API key is available
if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set in environment variables');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    // Validate request
    if (!req.body) {
      return NextResponse.json(
        { error: 'Request body is required' },
        { status: 400 }
      );
    }

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      messages,
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      max_tokens: 500,
    });

    return NextResponse.json({ 
      content: completion.choices[0].message.content 
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    
    // Return appropriate error message
    const errorMessage = error instanceof Error ? error.message : 'Failed to process chat request';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 