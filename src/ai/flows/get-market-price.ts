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
  date: z.string().describe('The date of the price information.'),
});

const GetMarketPriceInputSchema = z.object({
  crop: z.string().describe('The crop to get the market price for.'),
});
export type GetMarketPriceInput = z.infer<typeof GetMarketPriceInputSchema>;

const GetMarketPriceOutputSchema = z.array(MarketPriceSchema);
export type GetMarketPriceOutput = z.infer<typeof GetMarketPriceOutputSchema>;


const getMarketPrice = ai.defineTool(
    {
      name: 'getMarketPrice',
      description: 'Returns real-time market prices for crops from various markets in India.',
      inputSchema: GetMarketPriceInputSchema,
      outputSchema: GetMarketPriceOutputSchema,
    },
    async (input) => {
      // In a real application, you would fetch this data from a live API.
      // For this demo, we are returning mock data.
      const prices = {
        'Wheat': [
          { crop: 'Wheat', price: 2275, location: 'Delhi', date: new Date().toISOString().split('T')[0] },
          { crop: 'Wheat', price: 2350, location: 'Mumbai', date: new Date().toISOString().split('T')[0] },
          { crop: 'Wheat', price: 2200, location: 'Lucknow', date: new Date().toISOString().split('T')[0] },
        ],
        'Rice': [
            { crop: 'Rice', price: 3800, location: 'Kolkata', date: new Date().toISOString().split('T')[0] },
            { crop: 'Rice', price: 4200, location: 'Chennai', date: new Date().toISOString().split('T')[0] },
            { crop: 'Rice', price: 3950, location: 'Hyderabad', date: new Date().toISOString().split('T')[0] },
        ],
         'Maize': [
            { crop: 'Maize', price: 2100, location: 'Bengaluru', date: new Date().toISOString().split('T')[0] },
            { crop: 'Maize', price: 2050, location: 'Pune', date: new Date().toISOString().split('T')[0] },
            { crop: 'Maize', price: 2150, location: 'Jaipur', date: new Date().toISOString().split('T')[0] },
        ]
      };
      // @ts-ignore
      return prices[input.crop] || [];
    }
  )


const prompt = ai.definePrompt({
  name: 'marketPricePrompt',
  input: {schema: GetMarketPriceInputSchema},
  output: {schema: GetMarketPriceOutputSchema},
  tools: [getMarketPrice],
  prompt: `You are an agricultural market data provider. The user wants to know the market price for {{{crop}}} in India. Use the getMarketPrice tool to fetch the prices and return them.`,
});

const getMarketPriceFlow = ai.defineFlow(
  {
    name: 'getMarketPriceFlow',
    inputSchema: GetMarketPriceInputSchema,
    outputSchema: GetMarketPriceOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);

export async function getMarketPrices(input: GetMarketPriceInput): Promise<GetMarketPriceOutput> {
    return getMarketPriceFlow(input);
}
