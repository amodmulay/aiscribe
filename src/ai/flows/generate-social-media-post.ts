// src/ai/flows/generate-social-media-post.ts
'use server';
/**
 * @fileOverview Generates social media posts or newsletter paragraphs based on an article summary.
 *
 * - generateSocialMediaPost - A function that generates social media content from a summary.
 * - GenerateSocialMediaPostInput - The input type for the generateSocialMediaPost function.
 * - GenerateSocialMediaPostOutput - The return type for the generateSocialMediaPost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSocialMediaPostInputSchema = z.object({
  summary: z.string().describe('The summary of the article.'),
  platform: z
    .enum(['linkedin', 'twitter', 'newsletter'])
    .describe('The social media platform or content type.'),
  tone: z
    .string()
    .optional()
    .describe('The desired tone of the social media post (e.g., professional, casual, humorous).'),
});
export type GenerateSocialMediaPostInput = z.infer<typeof GenerateSocialMediaPostInputSchema>;

const GenerateSocialMediaPostOutputSchema = z.object({
  post: z.string().describe('The generated social media post or newsletter paragraph.'),
});
export type GenerateSocialMediaPostOutput = z.infer<typeof GenerateSocialMediaPostOutputSchema>;

export async function generateSocialMediaPost(
  input: GenerateSocialMediaPostInput
): Promise<GenerateSocialMediaPostOutput> {
  return generateSocialMediaPostFlow(input);
}

const generateSocialMediaPostPrompt = ai.definePrompt({
  name: 'generateSocialMediaPostPrompt',
  input: {schema: GenerateSocialMediaPostInputSchema},
  output: {schema: GenerateSocialMediaPostOutputSchema},
  prompt: `You are an expert social media manager. Based on the article summary, create a social media post for {{platform}}.  Consider the desired tone: {{tone}}. 

Summary: {{{summary}}}`,
});

const generateSocialMediaPostFlow = ai.defineFlow(
  {
    name: 'generateSocialMediaPostFlow',
    inputSchema: GenerateSocialMediaPostInputSchema,
    outputSchema: GenerateSocialMediaPostOutputSchema,
  },
  async input => {
    const {output} = await generateSocialMediaPostPrompt(input);
    return output!;
  }
);
