// Summarizes articles from URLs or text input using an AI model.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeArticleInputSchema = z.object({
  articleContent: z
    .string()
    .describe('The content of the article to be summarized, either URL or text.'),
  complexity: z.string().optional().describe('The desired complexity of the summary (e.g., simple, detailed).'),
  size: z.number().optional().describe('The desired size of the summary in words (default: at least 200 words).'),
  model: z.string().optional().describe('The AI model to use for summarization.'),
});
export type SummarizeArticleInput = z.infer<typeof SummarizeArticleInputSchema>;

const SummarizeArticleOutputSchema = z.object({
  summary: z.string().describe('The concise summary of the article.'),
});
export type SummarizeArticleOutput = z.infer<typeof SummarizeArticleOutputSchema>;

export async function summarizeArticle(input: SummarizeArticleInput): Promise<SummarizeArticleOutput> {
  return summarizeArticleFlow(input);
}

const summarizeArticlePrompt = ai.definePrompt({
  name: 'summarizeArticlePrompt',
  input: {schema: SummarizeArticleInputSchema},
  output: {schema: SummarizeArticleOutputSchema},
  prompt: ({articleContent, complexity, size}) => `Summarize the following article in a concise manner.
  ${complexity ? `The summary should be ${complexity}.` : ''}
  ${size ? `The summary should be approximately ${size} words.` : 'The summary should be at least 200 words.'}\n\n${articleContent}`,
});

const summarizeArticleFlow = ai.defineFlow(
  {
    name: 'summarizeArticleFlow',
    inputSchema: SummarizeArticleInputSchema,
    outputSchema: SummarizeArticleOutputSchema,
  },
  async input => {
    const {output} = await summarizeArticlePrompt(input);
    return output!;
  }
);
