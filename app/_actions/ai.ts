"use server"

import { generateText, Output } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { bookSchema, type Book } from '@/db/collections/Book';
import { legoSchema, type Lego } from '@/db/collections/Lego';
import { boardgameSchema, type Boardgame } from '@/db/collections/Boardgame';

async function fetchSuggestion<T>(
  schema: z.ZodType<T>,
  promptDetails: string,
  currentValues: Partial<T>
) {
  try {
    const { output } = await generateText({
      model: google('gemini-2.5-flash'),
      prompt: `Based on the following partial information:
      ${JSON.stringify(currentValues, null, 2)}
      
      Identify the specific ${promptDetails} and provide ALL missing details. Fill in EVERY field available in the output schema.
      Please provide as much accurate data as possible. If a value is unknown, omit it. Ensure images are correct urls if provided, or otherwise omitted.
      Do your best to infer the correct item from any partial name, set number, or title given. You can overwrite partial or slightly incorrect user input if you find a very confident exact match.`,
      output: Output.object({ schema }),
    });

    return output as Partial<T>;
  } catch (error) {
    console.error(`AI suggestion failed for ${promptDetails}:`, error);
    return currentValues;
  }
}

export async function suggestBook(values: Partial<Book>) {
  return fetchSuggestion(bookSchema, 'a book', values);
}
export async function suggestLego(values: Partial<Lego>) {
  return fetchSuggestion(legoSchema, 'a Lego set', values);
}
export async function suggestBoardgame(values: Partial<Boardgame>) {
  return fetchSuggestion(boardgameSchema, 'a board game', values);
}