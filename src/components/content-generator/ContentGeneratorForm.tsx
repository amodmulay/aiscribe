
"use client";

import React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { generateSocialMediaPost, type GenerateSocialMediaPostInput } from '@/ai/flows/generate-social-media-post';
import type { SocialPlatform } from '@/types';
import { SocialPlatformOptions } from '@/types';
import { Loader2, Send } from 'lucide-react';

const formSchema = z.object({
  summary: z.string().min(1, 'Summary is required.'),
  platform: z.custom<SocialPlatform>(val => SocialPlatformOptions.includes(val as SocialPlatform), {
    message: "Invalid platform selected",
  }),
  tone: z.string().optional(),
});

type ContentGeneratorFormData = z.infer<typeof formSchema>;

interface ContentGeneratorFormProps {
  articleSummary: string;
  onContentGenerated: (post: string, platform: SocialPlatform, tone?: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const ContentGeneratorForm: React.FC<ContentGeneratorFormProps> = ({ articleSummary, onContentGenerated, isLoading, setIsLoading }) => {
  const { toast } = useToast();

  const form = useForm<ContentGeneratorFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      summary: articleSummary || '',
      platform: SocialPlatformOptions[0],
      tone: '',
    },
    // Update default summary when articleSummary prop changes
    values: { summary: articleSummary, platform: SocialPlatformOptions[0], tone: ''} 
  });
  
  // Effect to update form's summary field when prop changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  // biome-ignore lint/complexity/noUselessFragments: <explanation>
  // React.useEffect(() => {
  //   form.setValue('summary', articleSummary);
  // }, [articleSummary, form.setValue]);


  const onSubmit: SubmitHandler<ContentGeneratorFormData> = async (data) => {
    setIsLoading(true);
    try {
      const aiInput: GenerateSocialMediaPostInput = {
        summary: data.summary,
        platform: data.platform,
        tone: data.tone,
      };
      const result = await generateSocialMediaPost(aiInput);
      onContentGenerated(result.post, data.platform, data.tone);
      toast({
        title: "Content Generated!",
        description: `A ${data.platform} post has been successfully generated.`,
      });
    } catch (error) {
      console.error("Error generating content:", error);
      toast({
        title: "Error",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!articleSummary) {
    return null; // Don't render if there's no summary yet
  }

  return (
    <Card className="w-full shadow-lg mt-8">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Generate Content</CardTitle>
        <CardDescription>Create social media posts or newsletter content from the summary.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="summary">Article Summary (Editable)</Label>
            <Textarea
              id="summary"
              rows={6}
              {...form.register('summary')}
              disabled={isLoading}
              className="min-h-[120px]"
            />
            {form.formState.errors.summary && (
              <p className="text-sm text-destructive">{form.formState.errors.summary.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Select
                defaultValue={SocialPlatformOptions[0]}
                onValueChange={(value) => form.setValue('platform', value as SocialPlatform)}
                disabled={isLoading}
              >
                <SelectTrigger id="platform">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {SocialPlatformOptions.map((platformName) => (
                    <SelectItem key={platformName} value={platformName}>
                      {platformName.charAt(0).toUpperCase() + platformName.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tone">Tone (Optional)</Label>
              <Input
                id="tone"
                placeholder="e.g., Professional, Casual, Humorous"
                {...form.register('tone')}
                disabled={isLoading}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 key="loader" className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Send key="send" className="mr-2 h-4 w-4" />
                Generate Content
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContentGeneratorForm;
