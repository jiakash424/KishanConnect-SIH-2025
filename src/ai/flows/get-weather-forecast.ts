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

function mapWeatherIcon(iconUrl: string): 'Sun' | 'CloudSun' | 'Cloudy' | 'CloudRain' | 'Wind' {
    const code = iconUrl.split('/').pop()?.replace('.png', '');
    if (code === '1000') return 'Sun';
    if (code === '1003') return 'CloudSun';
    if (['1006', '1009', '1030', '1135', '1147'].includes(code!)) return 'Cloudy'; // Cloudy, Overcast, Mist, Fog
    if (['1063', '1087', '1150', '1153', '1180', '1183', '1186', '1189', '1192', '1195', '1198', '1201', '1240', '1243', '1246', '1273', '1276'].includes(code!)) return 'CloudRain'; // Rain related
    if (['1066', '1069', '1072', '1114', '1117', '1168', '1171', '1204', '1207', '1210', '1213', '1216', '1219', '1222', '1225', '1237', '1249', '1252', '1255', '1258', '1261', '1264', '1279', '1282'].includes(code!)) return 'Cloudy'; // Snow/Sleet related, mapped to cloudy for simplicity
    return 'Sun';
}


const getWeatherForecast = ai.defineTool(
    {
      name: 'getWeatherForecast',
      description: 'Returns a 5-day weather forecast for a given location.',
      inputSchema: GetWeatherForecastInputSchema,
      outputSchema: GetWeatherForecastOutputSchema,
    },
    async (input) => {
        const apiKey = process.env.WEATHERAPI_KEY;
        if (!apiKey) {
            console.log("WeatherAPI.com API key not found. Returning mock data.");
            // Return mock data if API key is not set
            return [
                { day: 'Today', temp: 37, condition: 'Rainy - Cloudy', icon: 'CloudRain', temp_max: 37, temp_min: 23, full_description: 'Rainy - Cloudy' },
                { day: 'Tomorrow', temp: 29, condition: 'Thunderstorms', icon: 'Cloudy', temp_max: 29, temp_min: 24, full_description: 'Thunderstorms' },
                { day: 'Day 3', temp: 32, condition: 'Rainy cloudy', icon: 'CloudSun', temp_max: 32, temp_min: 25, full_description: 'Partly cloudy with a chance of rain' },
                { day: 'Day 4', temp: 39, condition: 'Semicloudy', icon: 'Sun', temp_max: 39, temp_min: 28, full_description: 'Mostly sunny' },
                { day: 'Day 5', temp: 42, condition: 'Sunny - Humidity', icon: 'Sun', temp_max: 42, temp_min: 29, full_description: 'Hot and humid' },
            ];
        }

        try {
            const forecastResponse = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${input.location}&days=5&aqi=no&alerts=no`);
            if (!forecastResponse.ok) throw new Error('Failed to fetch weather forecast.');
            const forecastData = await forecastResponse.json();
            
            const processedForecast = forecastData.forecast.forecastday.map((item: any, index: number) => {
                 const today = new Date();
                today.setHours(0,0,0,0);
                const forecastDate = new Date(item.date);
                forecastDate.setHours(0,0,0,0);
                
                let dayLabel = forecastDate.toLocaleDateString('en-US', { weekday: 'long' });
                if (index === 0) {
                    dayLabel = 'Today';
                } else if (index === 1) {
                    dayLabel = 'Tomorrow';
                }

                return {
                    day: dayLabel,
                    temp: Math.round(item.day.avgtemp_c),
                    condition: item.day.condition.text,
                    icon: mapWeatherIcon(item.day.condition.icon),
                    temp_max: Math.round(item.day.maxtemp_c),
                    temp_min: Math.round(item.day.mintemp_c),
                    full_description: `Avg. ${Math.round(item.day.avgtemp_c)}°C, ${item.day.condition.text}. High ${Math.round(item.day.maxtemp_c)}°C, Low ${Math.round(item.day.mintemp_c)}°C.`
                };
            });
            
            return processedForecast;

        } catch (error) {
            console.error("Error fetching real weather data from WeatherAPI.com:", error);
            // Fallback to mock data on error
             return [
                { day: 'Today', temp: 37, condition: 'Rainy - Cloudy', icon: 'CloudRain', temp_max: 37, temp_min: 23, full_description: 'Rainy - Cloudy' },
                { day: 'Tomorrow', temp: 29, condition: 'Thunderstorms', icon: 'Cloudy', temp_max: 29, temp_min: 24, full_description: 'Thunderstorms' },
                { day: 'Day 3', temp: 32, condition: 'Rainy cloudy', icon: 'CloudSun', temp_max: 32, temp_min: 25, full_description: 'Partly cloudy with a chance of rain' },
                { day: 'Day 4', temp: 39, condition: 'Semicloudy', icon: 'Sun', temp_max: 39, temp_min: 28, full_description: 'Mostly sunny' },
                { day: 'Day 5', temp: 42, condition: 'Sunny - Humidity', icon: 'Sun', temp_max: 42, temp_min: 29, full_description: 'Hot and humid' },
            ];
        }
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
