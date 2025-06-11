import type React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ClipboardCopy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GeneratedContentDisplayProps {
  content: string;
  platform: string;
  tone?: string;
}

const GeneratedContentDisplay: React.FC<GeneratedContentDisplayProps> = ({ content, platform, tone }) => {
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
      .then(() => {
        toast({ title: "Content Copied!", description: "The generated content has been copied." });
      })
      .catch(err => {
        console.error("Failed to copy content: ", err);
        toast({ title: "Copy Failed", description: "Could not copy content.", variant: "destructive" });
      });
  };
  
  if (!content) {
    return null;
  }

  return (
    <Card className="w-full shadow-lg mt-8">
      <CardHeader>
         <div className="flex justify-between items-start">
            <div>
              <CardTitle className="font-headline text-2xl">Generated {platform.charAt(0).toUpperCase() + platform.slice(1)} Content</CardTitle>
              {tone && <CardDescription>Tone: {tone}</CardDescription>}
            </div>
            <Button variant="outline" size="icon" onClick={handleCopy} aria-label="Copy content">
              <ClipboardCopy className="h-4 w-4" />
            </Button>
          </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-auto max-h-[300px] w-full rounded-md border p-4">
          <p className="text-foreground whitespace-pre-wrap leading-relaxed">{content}</p>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default GeneratedContentDisplay;
