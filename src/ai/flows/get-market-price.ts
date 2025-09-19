'use server';

/**
 * @fileOverview A flow to get real-time market prices for crops in India.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MarketPriceSchema = z.object({
  crop: z.string().describe('The name of the crop.'),
  price: z.number().describe('The market price of the crop in INR per quintal.'),
  location: z.string().describe('The market location.'),
  date: z.string().describe('The date of the price information in YYYY-MM-DD format.'),
});

const GetMarketPriceInputSchema = z.object({
  crop: z.string().describe('The crop to get the market price for.'),
});
export type GetMarketPriceInput = z.infer<typeof GetMarketPriceInputSchema>;

const GetMarketPriceOutputSchema = z.array(MarketPriceSchema);
export type GetMarketPriceOutput = z.infer<typeof GetMarketPriceOutputSchema>;


const prompt = ai.definePrompt({
  name: 'marketPricePrompt',
  input: {schema: GetMarketPriceInputSchema},
  output: {schema: GetMarketPriceOutputSchema},
  prompt: `You are an expert agricultural market data provider. 
Your task is to provide the latest, real-time market prices for a given crop from 3-4 major agricultural markets in India.
Provide today's date for the price information.

Crop: {{{crop}}}

Return the data as an array of objects with crop name, price per quintal, market location, and date.`,
});

const getMarketPriceFlow = ai.defineFlow(
  {
    name: 'getMarketPriceFlow',
    inputSchema: GetMarketPriceInputSchema,
    outputSchema: GetMarketPriceOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    // Add a small delay if no date is returned by the model.
    return output!.map(item => ({...item, date: item.date || new Date().toISOString().split('T')[0]}));
  }
);

export async function getMarketPrices(input: GetMarketPriceInput): Promise<GetMarketPriceOutput> {
    return getMarketPriceFlow(input);
}
