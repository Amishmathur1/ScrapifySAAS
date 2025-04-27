import OpenAI from 'openai';

import prisma from '@/lib/prisma';
import { symmetricDecrypt } from '@/lib/encryption';
import { ExtractDataWithAiTask } from '@/lib/workflow/task/extract-data-with-ai';
import { ExecutionEnvironment } from '@/types/executor';

export async function ExtractDataWithAiExecutor(
  environment: ExecutionEnvironment<typeof ExtractDataWithAiTask>
): Promise<boolean> {
  try {
    const credentials = environment.getInput('Credentials');
    if (!credentials) {
      environment.log.error('input->credentials not defined');
    }

    const prompt = environment.getInput('Prompt');
    if (!prompt) {
      environment.log.error('input->prompt not defined');
    }

    const content = environment.getInput('Content');
    if (!content) {
      environment.log.error('input->content not defined');
    }

    // Get credentials from DB
    const credential = await prisma.credential.findUnique({
      where: { id: credentials },
    });
    if (!credential) {
      environment.log.error('credential not found');
      return false;
    }

    const plainCredentialValue = symmetricDecrypt(credential.value);
    if (!plainCredentialValue) {
      environment.log.error('cannot decrypt credential');
      return false;
    }

    // Initialize OpenAI API
    const openai = new OpenAI({
      apiKey: plainCredentialValue,
    });

    const systemPrompt = 'You are a webscraper helper that extracts data from HTML or text. You will be given a piece of text or HTML content as input and also the prompt with the data you have to extract. The response should always be only the extracted data as a JSON array or object, without any additional words or explanations. Analyze the input carefully and extract data precisely based on the prompt. If no data is found, return an empty JSON array. Work only with the provided content and ensure the output is always a valid JSON array without any surrounding text';

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: `Content: ${content}\n\nPrompt: ${prompt}`
        }
      ],
      model: "gpt-3.5-turbo",
      response_format: { type: "json_object" }
    });

    const text = completion.choices[0].message.content;

    if (!text) {
      environment.log.error('Empty response from AI');
      return false;
    }

    environment.setOutput('Extracted data', text);
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
