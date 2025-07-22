'use client';

import { useState, useRef, useEffect, type FormEvent } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { SendHorizonal, Bot, User, BrainCircuit, Loader2, ArrowLeft } from 'lucide-react';
import type { Message, Conversation } from './DocQALayout';
import { getAnswer } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ChatProps {
  documentText: string;
  summary: string;
  onReset: () => void;
}

export function Chat({ documentText, summary, onReset }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: 'summary', type: 'ai', content: `Here's a quick summary of your document:\n\n${summary}` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: crypto.randomUUID(), type: 'user', content: input };
    const loadingMessage: Message = { id: crypto.randomUUID(), type: 'loading', content: '' };
    
    setMessages(prev => [...prev, userMessage, loadingMessage]);
    const questionToSubmit = input;
    setInput('');
    setIsLoading(true);

    try {
      const conversationHistory: Conversation[] = messages
        .filter(msg => msg.type === 'user' || msg.type === 'ai')
        .reduce((acc, msg, i, arr) => {
          if (msg.type === 'user') {
            const nextMsg = arr[i + 1];
            if (nextMsg && nextMsg.type === 'ai') {
              acc.push({ question: msg.content, answer: nextMsg.content });
            }
          }
          return acc;
        }, [] as Conversation[]);

      const result = await getAnswer(documentText, questionToSubmit, conversationHistory);
      
      if (result.error || !result.answer) {
        throw new Error(result.error || "The AI could not find an answer.");
      }
      
      const aiMessage: Message = { id: crypto.randomUUID(), type: 'ai', content: result.answer };
      setMessages(prev => [...prev.slice(0, -1), aiMessage]);

    } catch (e) {
      const error = e instanceof Error ? e.message : 'An unknown error occurred.';
      toast({
        variant: "destructive",
        title: "Oh no! Something went wrong.",
        description: error,
      });
      setMessages(prev => prev.slice(0, -1)); // Remove loading indicator
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const scrollViewport = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
    if (scrollViewport) {
      setTimeout(() => {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }, 100);
    }
  }, [messages]);
  
  return (
    <Card className="w-full max-w-3xl h-[85vh] flex flex-col shadow-2xl">
      <CardHeader className="flex flex-row items-center justify-between border-b">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={onReset} aria-label="Go back">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-3">
            <Avatar className="border-2 border-primary/50">
              <AvatarFallback className="bg-primary/20 text-primary"><BrainCircuit /></AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>DocQA</CardTitle>
              <CardDescription>Ask me anything about your document</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="p-6 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn('flex items-start gap-3', {
                  'justify-end': message.type === 'user',
                })}
              >
                {message.type !== 'user' && (
                  <Avatar className="w-9 h-9 border">
                    <AvatarFallback><Bot className="w-5 h-5" /></AvatarFallback>
                  </Avatar>
                )}
                <div className={cn(
                    "max-w-md xl:max-w-lg rounded-xl px-4 py-3 text-sm shadow-md whitespace-pre-wrap",
                    {
                      'bg-primary text-primary-foreground rounded-br-none': message.type === 'user',
                      'bg-card border rounded-bl-none': message.type === 'ai',
                      'bg-card border animate-pulse': message.type === 'loading',
                    }
                  )}>
                  {message.type === 'loading' ? (
                    <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin"/>
                        <span>Thinking...</span>
                    </div>
                  ) : (
                    <p>{message.content}</p>
                  )}
                </div>
                 {message.type === 'user' && (
                  <Avatar className="w-9 h-9 border">
                    <AvatarFallback><User className="w-5 h-5" /></AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="pt-6 border-t">
        <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            className="flex-1"
            disabled={isLoading}
            aria-label="Chat input"
            autoFocus
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()} aria-label="Send message">
            <SendHorizonal className="h-5 w-5" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
