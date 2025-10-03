
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
  // Fetch more records and sort locally to ensure we return the most recent prices
  const url = `https://api.data.gov.in/resource/${resource_id}?api-key=${apiKey}&format=json&filters[commodity]=${encodeURIComponent(input.crop)}&limit=50`;

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

      // Map the API response to our schema with robust date parsing
      const parsed = data.records.map((record: any) => {
        const rawDate = record.arrival_date || record.date || record.updated_on || '';

        // Normalize separators
        const d = typeof rawDate === 'string' ? rawDate.trim().replace(/\//g, '-').split(' ')[0] : '';

        let isoDate = '';
        try {
          if (/^\d{2}-\d{2}-\d{4}$/.test(d)) {
            // DD-MM-YYYY -> YYYY-MM-DD
            const [dd, mm, yyyy] = d.split('-');
            isoDate = `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
          } else if (/^\d{4}-\d{2}-\d{2}$/.test(d)) {
            // Already YYYY-MM-DD
            isoDate = d;
          } else if (/^\d{2}-[A-Za-z]{3}-\d{4}$/.test(d)) {
            // e.g. 10-Mar-2025 -> parse via Date
            const parsedDate = new Date(d);
            if (!isNaN(parsedDate.getTime())) {
              isoDate = parsedDate.toISOString().split('T')[0];
            }
          } else if (d) {
            // Try Date parse as a last resort
            const parsedDate = new Date(d);
            if (!isNaN(parsedDate.getTime())) {
              isoDate = parsedDate.toISOString().split('T')[0];
            }
          }
        } catch (e) {
          isoDate = '';
        }

        // Clean price: remove commas, non-digit characters
        const rawPrice = String(record.modal_price || record.min_price || record.price || '').replace(/[^0-9.-]/g, '');
        const price = Number.isFinite(Number(rawPrice)) ? Math.round(Number(rawPrice)) : 0;

        return {
          crop: record.commodity || input.crop,
          price,
          location: `${record.market || record.center || ''}${record.state ? ', ' + record.state : ''}`.trim(),
          // fallback to isoDate, else today's date so UI doesn't show old static date
          date: isoDate || new Date().toISOString().split('T')[0],
          __rawDate: rawDate,
        } as any;
      });

      // Sort by parsed date descending (newest first)
      parsed.sort((a: any, b: any) => {
        const ta = new Date(a.date).getTime();
        const tb = new Date(b.date).getTime();
        return tb - ta;
      });

      // Remove internal helper fields before returning
      const prices = parsed.map(({__rawDate, ...rest}: any) => rest);

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
