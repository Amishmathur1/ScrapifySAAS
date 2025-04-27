import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function GET() {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Try a simple completion to test the API key
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: "Hello" }],
      model: "gpt-4o",
    });

    return NextResponse.json({ 
      valid: true, 
      message: "API key is valid" 
    });
  } catch (error: any) {
    return NextResponse.json({ 
      valid: false, 
      message: error.message 
    }, { status: 400 });
  }
} 