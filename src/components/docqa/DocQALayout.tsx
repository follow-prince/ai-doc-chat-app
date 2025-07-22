'use client';

import { useState, useCallback } from 'react';
import { UploadCard } from './UploadCard';
import { Chat } from './Chat';
import { useToast } from "@/hooks/use-toast";

export type Conversation = {
  question: string;
  answer: string;
};

export type Message = {
  id: string;
  type: 'user' | 'ai' | 'loading';
  content: string;
};

export function DocQALayout() {
  const [documentText, setDocumentText] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDocumentUpload = useCallback(async (docText: string, docSummary: string) => {
    setDocumentText(docText);
    setSummary(docSummary);
    setIsLoading(false);
    setError(null);
  }, []);

  const handleProcessing = useCallback((loading: boolean, err: string | null) => {
    setIsLoading(loading);
    setError(err);
    if (err) {
      toast({
        variant: "destructive",
        title: "Oh no! Something went wrong.",
        description: err,
      });
    }
  }, [toast]);

  const handleReset = () => {
    setDocumentText(null);
    setSummary(null);
    setError(null);
  };

  return (
    <main className="flex min-h-full flex-col items-center justify-center p-4 sm:p-8 md:p-12 bg-background">
      {documentText && summary ? (
        <Chat documentText={documentText} summary={summary} onReset={handleReset} />
      ) : (
        <UploadCard onProcess={handleProcessing} onComplete={handleDocumentUpload} isLoading={isLoading} error={error} />
      )}
    </main>
  );
}
