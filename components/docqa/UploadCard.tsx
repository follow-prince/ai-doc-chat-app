'use client';

import { useState, useCallback, type DragEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadCloud, Loader2 } from 'lucide-react';
import { extractTextFromPDF, fileToDataUri } from '@/lib/pdf-parser';
import { getSummary } from '@/app/actions';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

interface UploadCardProps {
  onProcess: (loading: boolean, error: string | null) => void;
  onComplete: (docText: string, summary: string) => void;
  isLoading: boolean;
  error: string | null;
}

export function UploadCard({ onProcess, onComplete, isLoading, error }: UploadCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFile = useCallback(async (file: File) => {
    if (file.type !== 'application/pdf') {
      onProcess(false, 'Invalid file type. Please upload a PDF.');
      return;
    }
    
    setFileName(file.name);
    onProcess(true, null);

    try {
      const [docText, dataUri] = await Promise.all([
        extractTextFromPDF(file),
        fileToDataUri(file),
      ]);

      if (!docText.trim()) {
        throw new Error("Could not extract text from the PDF. The document might be empty or a scanned image.");
      }

      const summaryResult = await getSummary(dataUri);

      if (summaryResult.error || !summaryResult.summary) {
        throw new Error(summaryResult.error || 'Failed to get summary.');
      }
      
      onComplete(docText, summaryResult.summary);
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : 'An unknown error occurred.';
      onProcess(false, errorMsg);
      setFileName(null);
    }
  }, [onProcess, onComplete]);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  return (
    <Card className="w-full max-w-lg shadow-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold">DocQA</CardTitle>
        <CardDescription>
          Upload a PDF document to start an intelligent conversation.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
            <Alert variant="destructive">
              <AlertTitle>Upload Failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`relative flex flex-col items-center justify-center w-full p-10 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
            isDragging ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="mt-4 text-sm font-semibold">Analyzing Document...</p>
              <p className="text-xs text-muted-foreground">{fileName}</p>
            </>
          ) : (
            <>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept="application/pdf"
                onChange={(e) => e.target.files && handleFile(e.target.files[0])}
                disabled={isLoading}
              />
              <label htmlFor="file-upload" className="flex flex-col items-center justify-center cursor-pointer w-full text-center">
                <UploadCloud className="h-12 w-12 text-primary" />
                <p className="mt-4 text-sm font-semibold">Drag & drop a PDF here</p>
                <p className="text-xs text-muted-foreground">or click to browse files</p>
              </label>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
