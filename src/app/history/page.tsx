"use client";

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserHistoryAction, deleteHistoryEntryAction } from '@/lib/actions/historyActions';
import type { HistoryEntry } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, FileText, LinkIcon, Brain, CalendarDays, Loader2, AlertTriangle, Info } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';

const HistoryItemCard: React.FC<{ item: HistoryEntry; onDelete: (id: string) => void }> = ({ item, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleDelete = async () => {
    if (!user) return;
    setIsDeleting(true);
    const success = await deleteHistoryEntryAction(user.uid, item.id);
    if (success) {
      onDelete(item.id);
      toast({ title: "History item deleted." });
    } else {
      toast({ title: "Error deleting item.", variant: "destructive" });
    }
    setIsDeleting(false);
  };
  
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="font-headline text-xl line-clamp-2">
            {item.articleUrl ? (
              <a href={item.articleUrl} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-600">
                {item.articleUrl} <LinkIcon className="inline h-4 w-4 ml-1" />
              </a>
            ) : (
              item.articleText ? `Text: ${item.articleText.substring(0, 50)}...` : 'Summary'
            )}
          </CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" aria-label="Delete item">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete this history entry.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
                  {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <CardDescription className="flex items-center text-sm pt-1">
          <Brain className="h-4 w-4 mr-2 text-accent" /> Model: {item.modelUsed}
          <CalendarDays className="h-4 w-4 mr-2 ml-4 text-accent" /> 
          {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-start text-sm text-muted-foreground mb-2">
          <FileText className="h-4 w-4 mr-2 mt-1 shrink-0 text-accent" />
          <p className="font-medium text-foreground">Summary:</p>
        </div>
        <ScrollArea className="h-24 w-full rounded-md border p-3 bg-muted/30">
          <p className="text-sm whitespace-pre-wrap leading-relaxed">{item.summary}</p>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};


export default function HistoryPage() {
  const { user, loading: authLoading } = useAuth();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    if (user) {
      setIsLoading(true);
      const userHistory = await getUserHistoryAction(user.uid);
      setHistory(userHistory);
      setIsLoading(false);
    } else {
      // If user becomes null (logged out), clear history and stop loading
      setHistory([]);
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading) { // Only fetch if auth state is resolved
      fetchHistory();
    }
  }, [user, authLoading, fetchHistory]);

  const handleItemDelete = (deletedItemId: string) => {
    setHistory(prevHistory => prevHistory.filter(item => item.id !== deletedItemId));
  };
  
  if (authLoading || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Loading history...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center">
        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        <h1 className="text-2xl font-headline font-semibold mb-2">Access Denied</h1>
        <p className="text-muted-foreground">Please log in to view your history.</p>
        <Button asChild className="mt-6">
          {/* AuthButton will handle login, or you can put a direct login button here */}
          {/* For simplicity, relying on header's AuthButton */}
           <a href="/">Go to Homepage</a>
        </Button>
      </div>
    );
  }
  
  if (history.length === 0) {
    return (
       <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center">
        <Info className="h-12 w-12 text-primary mb-4" />
        <h1 className="text-2xl font-headline font-semibold mb-2">No History Yet</h1>
        <p className="text-muted-foreground">Start summarizing articles to see your history here.</p>
        <Button asChild className="mt-6">
           <a href="/">Summarize an Article</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline font-bold">Your Summarization History</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {history.map(item => (
          <HistoryItemCard key={item.id} item={item} onDelete={handleItemDelete} />
        ))}
      </div>
    </div>
  );
}
