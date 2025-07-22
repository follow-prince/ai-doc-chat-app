'use server';
/**
 * @fileOverview An AI agent that answers questions about a document.
 *
 * - answerQuestions - A function that handles the question answering process.
 * - AnswerQuestionsInput - The input type for the answerQuestions function.
 * - AnswerQuestionsOutput - The return type for the answerQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerQuestionsInputSchema = z.object({
  documentText: z.string().describe('The text content of the document.'),
  question: z.string().describe('The question to be answered.'),
  conversationHistory: z.array(z.object({question: z.string(), answer: z.string()})).optional().describe('The history of the conversation.'),
});
export type AnswerQuestionsInput = z.infer<typeof AnswerQuestionsInputSchema>;

const AnswerQuestionsOutputSchema = z.object({
  answer: z.string().describe('The answer to the question.'),
});
export type AnswerQuestionsOutput = z.infer<typeof AnswerQuestionsOutputSchema>;

export async function answerQuestions(input: AnswerQuestionsInput): Promise<AnswerQuestionsOutput> {
  return answerQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerQuestionsPrompt',
  input: {schema: AnswerQuestionsInputSchema},
  output: {schema: AnswerQuestionsOutputSchema},
  prompt: `You are an AI assistant that answers questions about a document.

  Document Text: {{{documentText}}}

  Conversation History:
  {{#each conversationHistory}}
  Question: {{{this.question}}}
  Answer: {{{this.answer}}}
  {{/each}}

  Question: {{{question}}}
  Answer:`, // Handlebars syntax
});

const answerQuestionsFlow = ai.defineFlow(
  {
    name: 'answerQuestionsFlow',
    inputSchema: AnswerQuestionsInputSchema,
    outputSchema: AnswerQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
