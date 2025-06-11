
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating insights from scientific topics by
 * asking a question and receiving a summarized answer with citations from reliable sources.
 *
 * - generateInsights - A function that handles the insight generation process.
 * - GenerateInsightsInput - The input type for the generateInsights function.
 * - GenerateInsightsOutput - The return type for the generateInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInsightsInputSchema = z.object({
  question: z.string().describe('The question to be answered with citation-backed insights.'),
});
export type GenerateInsightsInput = z.infer<typeof GenerateInsightsInputSchema>;

const GenerateInsightsOutputSchema = z.object({
  answer: z.string().describe('The summarized answer to the question, with embedded citations.'),
  sources: z.array(
    z.object({
      title: z.string().describe('The title of the source.'),
      url: z.string().describe('The URL of the source.'),
    })
  ).describe('The list of sources used to generate the answer.'),
});
export type GenerateInsightsOutput = z.infer<typeof GenerateInsightsOutputSchema>;


export async function generateInsights(input: GenerateInsightsInput): Promise<GenerateInsightsOutput> {
  return generateInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInsightsPrompt',
  input: {schema: GenerateInsightsInputSchema},
  output: {schema: GenerateInsightsOutputSchema},
  prompt: `You are an expert in providing summarized answers to scientific questions with citations from reliable sources.

Answer the following question, providing a summarized answer with embedded citations. List the sources used to generate the answer.

Question: {{{question}}}
`,
});

const generateInsightsFlow = ai.defineFlow(
  {
    name: 'generateInsightsFlow',
    inputSchema: GenerateInsightsInputSchema,
    outputSchema: GenerateInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

