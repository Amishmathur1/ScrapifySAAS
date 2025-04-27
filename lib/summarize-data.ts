import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function summarizeData(data: any) {
  try {
    const prompt = `
    Analyze and summarize the following scraped data:
    ${JSON.stringify(data, null, 2)}
    
    Please provide:
    1. A brief summary of the content
    2. Key patterns or trends
    3. Any interesting insights
    4. Suggested categories or tags
    
    Format the response as JSON with these fields:
    {
      "summary": "brief overview",
      "patterns": ["pattern1", "pattern2"],
      "insights": ["insight1", "insight2"],
      "suggestedTags": ["tag1", "tag2"]
    }`;

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that analyzes scraped data and provides insights in JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "gpt-3.5-turbo",
      response_format: { type: "json_object" }
    });

    return JSON.parse(completion.choices[0].message.content || '{}');
  } catch (error) {
    console.error('Error summarizing data:', error);
    return null;
  }
} 