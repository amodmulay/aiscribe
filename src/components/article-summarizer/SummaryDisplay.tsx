import type React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ClipboardCopy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface SummaryDisplayProps {
  summary: string;
  modelUsed: string;
}

const SummaryDisplay: React.FC<SummaryDisplayProps> = ({ summary, modelUsed }) => {
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(summary)
      .then(() => {
        toast({ title: "Summary Copied!", description: "The summary has been copied to your clipboard." });
      })
      .catch(err => {
        console.error("Failed to copy summary: ", err);
        toast({ title: "Copy Failed", description: "Could not copy summary to clipboard.", variant: "destructive" });
      });
  };

  if (!summary) {
    return null;
  }

  return (
    <Card className="w-full shadow-lg mt-8">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="font-headline text-2xl">Generated Summary</CardTitle>
            <CardDescription>Summary generated using {modelUsed}.</CardDescription>
          </div>
          <Button variant="outline" size="icon" onClick={handleCopy} aria-label="Copy summary">
            <ClipboardCopy className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-auto max-h-[400px] w-full rounded-md border p-4">
          <p className="text-foreground whitespace-pre-wrap leading-relaxed">{summary}</p>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default SummaryDisplay;
