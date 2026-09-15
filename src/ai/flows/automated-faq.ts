// src/ai/flows/automated-faq.ts
'use server';
/**
 * @fileOverview A flow to answer user questions based on a knowledge base of previous Q&A pairs.
 *
 * - automatedFAQ - A function that answers user questions based on previous Q&A.
 * - AutomatedFAQInput - The input type for the automatedFAQ function.
 * - AutomatedFAQOutput - The return type for the automatedFAQ function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutomatedFAQInputSchema = z.object({
  question: z.string().describe('The question asked by the user.'),
});
export type AutomatedFAQInput = z.infer<typeof AutomatedFAQInputSchema>;

const AutomatedFAQOutputSchema = z.object({
  answer: z.string().describe('The answer to the user question.'),
});
export type AutomatedFAQOutput = z.infer<typeof AutomatedFAQOutputSchema>;

export async function automatedFAQ(input: AutomatedFAQInput): Promise<AutomatedFAQOutput> {
  return automatedFAQFlow(input);
}

const knowledgeBaseTool = ai.defineTool({
  name: 'getQAPairs',
  description: 'Retrieves relevant question and answer pairs from a knowledge base.',
  inputSchema: z.object({
    question: z.string().describe('The question to find similar Q&A pairs for.'),
  }),
  outputSchema: z.array(z.object({
    question: z.string(),
    answer: z.string(),
  })).describe('An array of similar question and answer pairs.'),
  async fn(input) {
    // Placeholder implementation for fetching Q&A pairs.
    // In a real application, this would connect to a database or other data source.
    // For now, return some dummy data.
    return [
      {
        question: 'What products does RoboBox Reimagined offer?',
        answer: 'RoboBox Reimagined offers a variety of robotics kits and educational resources.',
      },
      {
        question: 'How can schools register for RoboBox Reimagined?',
        answer: 'Schools can register by filling out the school registration form on our website.',
      },
    ];
  },
});

const prompt = ai.definePrompt({
  name: 'automatedFAQPrompt',
  input: {schema: AutomatedFAQInputSchema},
  output: {schema: AutomatedFAQOutputSchema},
  tools: [knowledgeBaseTool],
  prompt: `You are a helpful AI assistant that answers questions based on a knowledge base of previous Q&A pairs.

  The user has asked the following question: {{{question}}}

  I have access to previous Q&A pairs to assist with providing an answer.  Use the "getQAPairs" tool to get the previous Q&A pairs.
  If the previous Q&A pairs do not contain the answer, answer the question to the best of your abilities.
  Consider all information before responding.  Be as concise as possible.
  `,
});

const automatedFAQFlow = ai.defineFlow(
  {
    name: 'automatedFAQFlow',
    inputSchema: AutomatedFAQInputSchema,
    outputSchema: AutomatedFAQOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
