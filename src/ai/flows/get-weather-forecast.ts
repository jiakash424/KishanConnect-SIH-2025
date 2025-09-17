'use server';

/**
 * @fileOverview A flow to get the real-time weather forecast.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';


const WeatherForecastSchema = z.object({
    day: z.string().describe("Day of the week"),
    temp: z.number().describe("Temperature in Celsius"),
    condition: z.string().describe("Weather condition (e.g., Sunny, Cloudy, Rainy)"),
    icon: z.enum(['Sun', 'CloudSun', 'Cloudy', 'CloudRain', 'Wind']).describe("An icon representing the weather condition"),
    temp_max: z.number().describe("Maximum temperature for the day"),
    temp_min: z.number().describe("Minimum temperature for the day"),
    full_description: z.string().describe("A short description of the weather for the day")
});

const GetWeatherForecastInputSchema = z.object({
  location: z.string().describe('The location to get the weather forecast for.'),
});

export type GetWeatherForecastInput = z.infer<typeof GetWeatherForecastInputSchema>;

const GetWeatherForecastOutputSchema = z.array(WeatherForecastSchema);

export type GetWeatherForecastOutput = z.infer<typeof GetWeatherForecastOutputSchema>;


const getWeatherForecast = ai.defineTool(
    {
      name: 'getWeatherForecast',
      description: 'Returns a 5-day weather forecast for a given location.',
      inputSchema: GetWeatherForecastInputSchema,
      outputSchema: GetWeatherForecastOutputSchema,
    },
    async (input) => {
      // In a real application, you would fetch this data from a live weather API.
      // For this demo, we are returning mock data for a sample location.
      console.log(`Fetching weather for ${input.location}...`);
      return [
        { day: 'Today', temp: 37, condition: 'Rainy - Cloudy', icon: 'CloudRain', temp_max: 37, temp_min: 23, full_description: 'Rainy - Cloudy' },
        { day: 'Tomorrow', temp: 29, condition: 'Thunderstorms', icon: 'Cloudy', temp_max: 29, temp_min: 24, full_description: 'Thunderstorms' },
        { day: 'Day 3', temp: 32, condition: 'Rainy cloudy', icon: 'CloudSun', temp_max: 32, temp_min: 25, full_description: 'Partly cloudy with a chance of rain' },
        { day: 'Day 4', temp: 39, condition: 'Semicloudy', icon: 'Sun', temp_max: 39, temp_min: 28, full_description: 'Mostly sunny' },
        { day: 'Day 5', temp: 42, condition: 'Sunny - Humidity', icon: 'Sun', temp_max: 42, temp_min: 29, full_description: 'Hot and humid' },
      ];
    }
);


const prompt = ai.definePrompt({
  name: 'weatherForecastPrompt',
  input: {schema: GetWeatherForecastInputSchema},
  output: {schema: GetWeatherForecastOutputSchema},
  tools: [getWeatherForecast],
  prompt: `You are a weather forecasting service. The user wants a 5-day forecast for {{{location}}}. Use the getWeatherForecast tool to get the data and return it.`,
});

const weatherForecastFlow = ai.defineFlow(
  {
    name: 'weatherForecastFlow',
    inputSchema: GetWeatherForecastInputSchema,
    outputSchema: GetWeatherForecastOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);

export async function getWeather(input: GetWeatherForecastInput): Promise<GetWeatherForecastOutput> {
    return weatherForecastFlow(input);
}
