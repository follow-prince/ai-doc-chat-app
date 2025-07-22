'use server';

import { answerQuestions } from '@/ai/flows/answer-questions';
import { summarizeDocument } from '@/ai/flows/summarize-document';
import type { Conversation } from '@/components/docqa/DocQALayout';

export async function getSummary(documentDataUri: string) {
  try {
    const result = await summarizeDocument({ documentDataUri });
    return { summary: result.summary };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to summarize document.' };
  }
}

export async function getAnswer(
  documentText: string,
  question: string,
  conversationHistory: Conversation[]
) {
  try {
    const result = await answerQuestions({
      documentText,
      question,
      conversationHistory,
    });
    return { answer: result.answer };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to get an answer.' };
  }
}
