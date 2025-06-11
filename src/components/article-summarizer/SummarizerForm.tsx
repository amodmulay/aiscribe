
"use client";

import React, { useState } from 'react';
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
import { summarizeArticle, type SummarizeArticleInput } from '@/ai/flows/summarize-article';
import type { AiModel } from '@/types';
import { AiModelOptions } from '@/types';
import { Loader2, Sparkles } from 'lucide-react';

const formSchema = z.object({
  inputType: z.enum(['url', 'text']),
  articleContent: z.string().min(1, 'Please enter a URL or text to summarize.'),
  model: z.custom<AiModel>(val => AiModelOptions.includes(val as AiModel), {
    message: "Invalid AI model selected",
  }),
});

type SummarizerFormData = z.infer<typeof formSchema>;

interface SummarizerFormProps {
  onSummaryGenerated: (summary: string, modelUsed: AiModel, articleContent: string, inputType: 'url' | 'text') => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const SummarizerForm: React.FC<SummarizerFormProps> = ({ onSummaryGenerated, isLoading, setIsLoading }) => {
  const [inputType, setInputType] = useState<'url' | 'text'>('url');
  const { toast } = useToast();

  const form = useForm<SummarizerFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      inputType: 'url',
      articleContent: '',
      model: AiModelOptions[0],
    },
  });

  const onSubmit: SubmitHandler<SummarizerFormData> = async (data) => {
    setIsLoading(true);
    try {
      const aiInput: SummarizeArticleInput = {
        articleContent: data.articleContent,
        model: data.model,
      };
      const result = await summarizeArticle(aiInput);
      onSummaryGenerated(result.summary, data.model, data.articleContent, data.inputType);
      toast({
        title: "Summary Generated!",
        description: "The article has been successfully summarized.",
      });
    } catch (error) {
      console.error("Error summarizing article:", error);
      toast({
        title: "Error",
        description: "Failed to summarize the article. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  let buttonContent;
  if (isLoading) {
    buttonContent = (
      <>
        <Loader2 key="loader" className="mr-2 h-4 w-4 animate-spin" />
        Summarizing...
      </>
    );
  } else {
    buttonContent = (
      <>
        <Sparkles key="sparkles" className="mr-2 h-4 w-4" />
        Summarize
      </>
    );
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Summarize Article</CardTitle>
        <CardDescription>Enter a URL or paste text to get an AI-powered summary.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label>Input Type</Label>
            <Select
              value={inputType}
              onValueChange={(value: 'url' | 'text') => {
                setInputType(value);
                form.setValue('inputType', value);
                form.setValue('articleContent', ''); // Clear content on type change
              }}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select input type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="url">URL</SelectItem>
                <SelectItem value="text">Text</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="articleContent">{inputType === 'url' ? 'Article URL' : 'Article Text'}</Label>
            {inputType === 'url' ? (
              <Input
                id="articleContent"
                placeholder="https://example.com/article"
                {...form.register('articleContent')}
                disabled={isLoading}
              />
            ) : (
              <Textarea
                id="articleContent"
                placeholder="Paste your article text here..."
                rows={8}
                {...form.register('articleContent')}
                disabled={isLoading}
                className="min-h-[150px]"
              />
            )}
            {form.formState.errors.articleContent && (
              <p className="text-sm text-destructive">{form.formState.errors.articleContent.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="model">AI Model</Label>
            <Select
              defaultValue={AiModelOptions[0]}
              onValueChange={(value) => form.setValue('model', value as AiModel)}
              disabled={isLoading}
            >
              <SelectTrigger id="model">
                <SelectValue placeholder="Select AI model" />
              </SelectTrigger>
              <SelectContent>
                {AiModelOptions.map((modelName) => (
                  <SelectItem key={modelName} value={modelName}>
                    {modelName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {buttonContent}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SummarizerForm;
