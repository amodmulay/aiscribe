
"use client"; // Make this a client component to manage state

import { useState, useCallback } from 'react';
import SummarizerForm from '@/components/article-summarizer/SummarizerForm';
import SummaryDisplay from '@/components/article-summarizer/SummaryDisplay';
import ContentGeneratorForm from '@/components/content-generator/ContentGeneratorForm';
import GeneratedContentDisplay from '@/components/content-generator/GeneratedContentDisplay';
// import { useAuth } from '@/contexts/AuthContext'; // Firebase Auth removed
// import { addHistoryEntryAction } from '@/lib/actions/historyActions'; // Firebase History removed
import type { HistoryEntry, AiModel, SocialPlatform } from '@/types'; // HistoryEntry might be less relevant now
import { Separator } from '@/components/ui/separator';

export default function HomePage() {
  // const { user } = useAuth(); // Firebase Auth removed
  const [summary, setSummary] = useState('');
  const [modelUsed, setModelUsed] = useState<AiModel | ''>('');
  // const [articleIdentifier, setArticleIdentifier] = useState(''); // Less relevant without history
  // const [articleInputType, setArticleInputType] = useState<'url' | 'text' | null>(null); // Less relevant without history


  const [generatedContent, setGeneratedContent] = useState('');
  const [generatedContentPlatform, setGeneratedContentPlatform] = useState<SocialPlatform | ''>('');
  const [generatedContentTone, setGeneratedContentTone] = useState<string | undefined>('');
  
  const [isSummarizerLoading, setIsSummarizerLoading] = useState(false);
  const [isContentGeneratorLoading, setIsContentGeneratorLoading] = useState(false);

  const handleSummaryGenerated = useCallback(
    async (
      newSummary: string, 
      newModelUsed: AiModel, 
      originalContent: string, 
      inputType: 'url' | 'text'
    ) => {
      setSummary(newSummary);
      setModelUsed(newModelUsed);
      // setArticleInputType(inputType); // Less relevant without history
      // setArticleIdentifier(inputType === 'url' ? originalContent : originalContent.substring(0,100)); // Less relevant without history
      setGeneratedContent(''); // Clear previous generated content

      // Firebase history saving removed
      // if (user) {
      //   const historyData: Omit<HistoryEntry, 'id' | 'userId' | 'createdAt'> = {
      //     summary: newSummary,
      //     modelUsed: newModelUsed,
      //   };
      //   if (inputType === 'url') {
      //     historyData.articleUrl = originalContent;
      //   } else {
      //     historyData.articleText = originalContent;
      //   }
      //   await addHistoryEntryAction(user.uid, historyData);
      // }
    },
    [] // user removed from dependencies
  );

  const handleContentGenerated = useCallback(
    (post: string, platform: SocialPlatform, tone?: string) => {
      setGeneratedContent(post);
      setGeneratedContentPlatform(platform);
      setGeneratedContentTone(tone);
    },
    []
  );

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-headline font-bold tracking-tight lg:text-5xl mb-4">
          Welcome to AI Scribe
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Effortlessly summarize articles and generate engaging content using the power of AI.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-1 gap-8 items-start">
        <section id="summarizer" className="space-y-6">
          <SummarizerForm 
            onSummaryGenerated={handleSummaryGenerated} 
            isLoading={isSummarizerLoading}
            setIsLoading={setIsSummarizerLoading}
          />
          {summary && modelUsed && (
            <SummaryDisplay summary={summary} modelUsed={modelUsed} />
          )}
        </section>

        {summary && (
          <>
            <Separator className="my-8" />
            <section id="content-generator" className="space-y-6">
              <ContentGeneratorForm
                articleSummary={summary}
                onContentGenerated={handleContentGenerated}
                isLoading={isContentGeneratorLoading}
                setIsLoading={setIsContentGeneratorLoading}
              />
              {generatedContent && generatedContentPlatform && (
                <GeneratedContentDisplay
                  content={generatedContent}
                  platform={generatedContentPlatform}
                  tone={generatedContentTone}
                />
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
