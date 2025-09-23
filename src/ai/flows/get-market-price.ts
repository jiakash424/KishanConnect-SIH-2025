
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


const getMarketPriceData = ai.defineTool(
    {
        name: 'getMarketPriceData',
        description: 'Returns live market prices for a given crop from major agricultural markets in India using the data.gov.in API.',
        inputSchema: GetMarketPriceInputSchema,
        outputSchema: GetMarketPriceOutputSchema,
    },
    async (input) => {
        const apiKey = process.env.DATA_GOV_IN_API_KEY;
        if (!apiKey) {
            console.error("data.gov.in API key is missing.");
            return []; // Return empty if API key is not set
        }

        const resource_id = '9ef84268-d588-465a-a308-a864a43d0070'; // Current Daily Price of Various Commodities
        const url = `https://api.data.gov.in/resource/${resource_id}?api-key=${apiKey}&format=json&filters[commodity]=${encodeURIComponent(input.crop)}&limit=10`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                console.error(`API request failed with status: ${response.status}`);
                return [];
            }
            const data = await response.json();

            if (!data.records) {
                return [];
            }

            // Map the API response to our schema
            const prices = data.records.map((record: any) => {
                // Convert DD-MM-YYYY to YYYY-MM-DD
                const [day, month, year] = record.arrival_date.split('-');
                const formattedDate = `${year}-${month}-${day}`;

                return {
                    crop: record.commodity,
                    price: parseInt(record.modal_price, 10) || 0,
                    location: `${record.market}, ${record.state}`,
                    date: formattedDate,
                };
            });

            return prices;

        } catch (error) {
            console.error("Failed to fetch market prices:", error);
            // Fallback to mock data on error
            const today = new Date().toISOString().split('T')[0];
            return [
                { crop: input.crop, price: 2400, location: "Delhi (Mock Data)", date: today },
                { crop: input.crop, price: 2350, location: "Mumbai (Mock Data)", date: today },
            ]
        }
    }
);


const prompt = ai.definePrompt({
  name: 'marketPricePrompt',
  input: {schema: GetMarketPriceInputSchema},
  output: {schema: GetMarketPriceOutputSchema},
  tools: [getMarketPriceData],
  prompt: `You are an expert agricultural market data provider. 
Your task is to provide the latest market prices for a given crop from major agricultural markets in India.
Use the getMarketPriceData tool to fetch the live prices for the crop: {{{crop}}}`,
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
