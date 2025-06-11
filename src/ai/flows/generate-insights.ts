
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating insights from scientific topics by
 * asking a question and receiving a summarized answer with citations from reliable sources.
 * It now includes a tool to fetch data from ECHA Registered Substance Dossiers for chemical-related queries.
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

// Define the schema for the ECHA tool's input
const EchaToolInputSchema = z.object({
  substanceName: z.string().describe('The name of the chemical substance to search for in ECHA dossiers.'),
});

// Define the schema for the ECHA tool's output
const EchaToolOutputSchema = z.object({
  registrationStatus: z.string().describe('The registration status of the substance.'),
  summary: z.string().describe('A brief summary from the ECHA dossier.'),
  sourceUrl: z.string().describe('The URL to the ECHA dossier or relevant page.'),
  sourceTitle: z.string().describe('The title for the ECHA source, e.g., "ECHA Dossier: [Substance Name]".')
});

// Define the ECHA data fetching tool
const fetchEchaDossierDataTool = ai.defineTool(
  {
    name: 'fetchEchaDossierDataTool',
    description: 'Fetches information about a chemical substance from ECHA (European Chemicals Agency) Registered Substance Dossiers. Use this to find registration status, summaries, and official source URLs for chemicals.',
    inputSchema: EchaToolInputSchema,
    outputSchema: EchaToolOutputSchema,
  },
  async (input) => {
    // Mock implementation for fetching ECHA data
    // In a real scenario, this would involve an API call to ECHA.
    // For now, we return sample data.
    const searchUrl = `https://echa.europa.eu/information-on-chemicals/registered-substances?p_p_id=dissregisteredsubstances_WAR_disssearchportlet&p_p_lifecycle=0&p_p_state=normal&p_p_mode=view&_dissregisteredsubstances_WAR_disssearchportlet_javax.portlet.action=search&_dissregisteredsubstances_WAR_disssearchportlet_fullText=${encodeURIComponent(input.substanceName)}`;
    return {
      registrationStatus: `Registered (Mock Data for ${input.substanceName})`,
      summary: `This is a mock summary for ${input.substanceName} from the ECHA database. It typically includes key findings, hazard information, and regulatory details.`,
      sourceUrl: searchUrl,
      sourceTitle: `ECHA Registered Dossier: ${input.substanceName}`,
    };
  }
);

export async function generateInsights(input: GenerateInsightsInput): Promise<GenerateInsightsOutput> {
  return generateInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInsightsPrompt',
  input: {schema: GenerateInsightsInputSchema},
  output: {schema: GenerateInsightsOutputSchema},
  tools: [fetchEchaDossierDataTool], // Added the ECHA tool here
  prompt: `You are an expert in providing summarized answers to scientific questions with citations from reliable sources.

Answer the following question, providing a summarized answer with embedded citations. List the sources used to generate the answer.

If the question pertains to chemical substances, their properties, safety, or registration status, consider utilizing the 'fetchEchaDossierDataTool' to retrieve relevant information from the ECHA (European Chemicals Agency) Registered Substance Dossiers.
When you use the 'fetchEchaDossierDataTool', ensure that the 'sourceUrl' and 'sourceTitle' returned by the tool are included in the 'sources' array of your final output. The source object should have a 'title' (from 'sourceTitle') and a 'url' (from 'sourceUrl') field.

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
