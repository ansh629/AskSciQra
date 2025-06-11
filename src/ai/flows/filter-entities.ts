'use server';

/**
 * @fileOverview Filters entities to include or exclude in a search query.
 *
 * - filterEntities - A function that filters named entities based on relevance to the search query.
 * - FilterEntitiesInput - The input type for the filterEntities function.
 * - FilterEntitiesOutput - The return type for the filterEntities function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FilterEntitiesInputSchema = z.object({
  query: z.string().describe('The user search query.'),
  entities: z
    .array(z.string())
    .describe('An array of named entities extracted from the query.'),
});
export type FilterEntitiesInput = z.infer<typeof FilterEntitiesInputSchema>;

const FilterEntitiesOutputSchema = z.object({
  filteredEntities: z
    .array(z.string())
    .describe(
      'An array of entities that should be included or excluded in the search query.'
    ),
  reasoning: z
    .string()
    .describe('The AI reasoning behind including or excluding each entity.'),
});
export type FilterEntitiesOutput = z.infer<typeof FilterEntitiesOutputSchema>;

export async function filterEntities(input: FilterEntitiesInput): Promise<FilterEntitiesOutput> {
  return filterEntitiesFlow(input);
}

const filterEntitiesPrompt = ai.definePrompt({
  name: 'filterEntitiesPrompt',
  input: {schema: FilterEntitiesInputSchema},
  output: {schema: FilterEntitiesOutputSchema},
  prompt: `You are an AI assistant designed to refine search queries by filtering named entities.

  Given a user's search query and a list of extracted entities, determine which entities are relevant to the query and should be included in the search, and which should be excluded to improve search precision.

  Query: {{{query}}}
  Entities: {{#each entities}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

  Reasoning:
  For each entity, explain why it should be included or excluded from the search query. Be concise and specific.

  Filtered Entities:
  Based on your reasoning, provide a list of entities to be included or excluded in the search query.

  Output the filtered entities and reasoning in the following format:
  {{output schema='FilterEntitiesOutputSchema'}}
  `,
});

const filterEntitiesFlow = ai.defineFlow(
  {
    name: 'filterEntitiesFlow',
    inputSchema: FilterEntitiesInputSchema,
    outputSchema: FilterEntitiesOutputSchema,
  },
  async input => {
    const {output} = await filterEntitiesPrompt(input);
    return output!;
  }
);
