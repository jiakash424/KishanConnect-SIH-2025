
'use server';

/**
 * @fileOverview A flow to get the real-time weather forecast using Visual Crossing API.
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

const HourlyForecastSchema = z.object({
    time: z.string().describe("The time for the forecast, e.g., '10 AM'"),
    temp: z.number().describe("Temperature in Celsius"),
    precip: z.number().describe("Chance of precipitation as a percentage"),
});


const GetWeatherForecastInputSchema = z.object({
  location: z.string().describe('The location to get the weather forecast for.'),
});

export type GetWeatherForecastInput = z.infer<typeof GetWeatherForecastInputSchema>;

const GetWeatherForecastOutputSchema = z.object({
    location: z.string().describe("The name of the location."),
    currentTime: z.string().describe("The current local time in hh:mm AM/PM format."),
    lastUpdated: z.string().describe("When the data was last updated."),
    current: z.object({
        temp: z.number().describe("Current temperature in Celsius"),
        condition: z.string().describe("Current weather condition text"),
        icon: z.enum(['Sun', 'CloudSun', 'Cloudy', 'CloudRain', 'Wind']).describe("An icon representing the weather condition"),
        feelsLike: z.number().describe("What the temperature feels like in Celsius"),
        windSpeed: z.number().describe("Wind speed in kph"),
        humidity: z.number().describe("Humidity percentage"),
    }),
    daily: z.array(WeatherForecastSchema),
    hourly: z.array(HourlyForecastSchema),
});


export type GetWeatherForecastOutput = z.infer<typeof GetWeatherForecastOutputSchema>;

// Helper to map Visual Crossing icons to our app's icons
const getIcon = (icon: string): 'Sun' | 'CloudSun' | 'Cloudy' | 'CloudRain' | 'Wind' => {
    if (icon.includes('cloudy')) return 'Cloudy';
    if (icon.includes('rain') || icon.includes('showers')) return 'CloudRain';
    if (icon.includes('wind')) return 'Wind';
    if (icon.includes('sun') || icon.includes('clear')) return 'Sun';
    return 'Sun'; // Default icon
};


const getWeatherForecast = ai.defineTool(
    {
      name: 'getWeatherForecast',
      description: 'Returns a 7-day weather forecast for a given location using Visual Crossing API.',
      inputSchema: GetWeatherForecastInputSchema,
      outputSchema: GetWeatherForecastOutputSchema,
    },
    async (input) => {
        const apiKey = process.env.VISUAL_CROSSING_API_KEY;
        if (!apiKey) {
            throw new Error("Visual Crossing API key is not set.");
        }

        const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(input.location)}/next7days?unitGroup=metric&key=${apiKey}&contentType=json&include=days,hours,current`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Weather API request failed with status: ${response.status}`);
            }
            const data = await response.json();

            if (!data.currentConditions || !data.days || !data.days[0].hours) {
                throw new Error("Invalid data from weather API.");
            }

            const { currentConditions, days, resolvedAddress } = data;
            const now = new Date();

            const dailyForecasts = days.slice(0, 7).map((day: any) => {
                const date = new Date(day.datetime);
                let dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' });
                 if (date.toDateString() === now.toDateString()) {
                    dayLabel = 'Today';
                } else {
                     dayLabel = `${dayLabel} ${date.getDate()}`
                }
                return {
                    day: dayLabel,
                    temp: Math.round((day.tempmax + day.tempmin) / 2),
                    condition: day.conditions,
                    icon: getIcon(day.icon),
                    temp_max: Math.round(day.tempmax),
                    temp_min: Math.round(day.tempmin),
                    full_description: day.description || day.conditions,
                };
            });
            
            // Find the current hour to start the hourly forecast from
            const currentHour = now.getHours();
            const todayHours = days[0].hours;
            let startIndex = todayHours.findIndex((h:any) => parseInt(h.datetime.substring(0, 2), 10) === currentHour);
            if (startIndex === -1) startIndex = 0;

            const hourlyForecasts = todayHours.slice(startIndex, startIndex + 8).map((hour: any) => ({
                 time: new Date(`1970-01-01T${hour.datetime}`).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
                 temp: Math.round(hour.temp),
                 precip: hour.precipprob,
            }));

            return {
                location: resolvedAddress,
                currentTime: now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
                lastUpdated: `Updated just now`,
                current: {
                    temp: Math.round(currentConditions.temp),
                    condition: currentConditions.conditions,
                    icon: getIcon(currentConditions.icon),
                    feelsLike: Math.round(currentConditions.feelslike),
                    windSpeed: Math.round(currentConditions.windspeed),
                    humidity: currentConditions.humidity,
                },
                daily: dailyForecasts,
                hourly: hourlyForecasts,
            };

        } catch (error) {
             console.error("Weather tool error:", error);
             // Fallback to mock data on error
            return {
                location: input.location,
                currentTime: '09:37 AM',
                lastUpdated: 'Updated a few minutes ago (mock data)',
                current: {
                    temp: 31,
                    condition: 'Haze',
                    icon: 'Sun',
                    feelsLike: 34,
                    windSpeed: 10,
                    humidity: 60,
                },
                daily: [
                    { day: 'Today', temp: 34, condition: 'Partly Cloudy', icon: 'CloudSun', temp_max: 34, temp_min: 27, full_description: 'Partly Cloudy' },
                    { day: 'Sat 20', temp: 35, condition: 'Sunny', icon: 'Sun', temp_max: 35, temp_min: 27, full_description: 'Sunny' },
                    { day: 'Sun 21', temp: 35, condition: 'Sunny', icon: 'Sun', temp_max: 35, temp_min: 26, full_description: 'Sunny' },
                    { day: 'Mon 22', temp: 35, condition: 'Sunny', icon: 'Sun', temp_max: 35, temp_min: 26, full_description: 'Sunny' },
                    { day: 'Tue 23', temp: 35, condition: 'Sunny', icon: 'Sun', temp_max: 35, temp_min: 26, full_description: 'Sunny' },
                ],
                hourly: [
                    { time: '10 AM', temp: 31, precip: 0 }, { time: '1 PM', temp: 33, precip: 1 },
                    { time: '4 PM', temp: 33, precip: 2 }, { time: '7 PM', temp: 32, precip: 2 },
                    { time: '10 PM', temp: 30, precip: 2 }, { time: '1 AM', temp: 28, precip: 2 },
                    { time: '4 AM', temp: 27, precip: 1 }, { time: '7 AM', temp: 28, precip: 1 },
                ]
            }
        }
    }
);


const prompt = ai.definePrompt({
  name: 'weatherForecastPrompt',
  input: {schema: GetWeatherForecastInputSchema},
  output: {schema: GetWeatherForecastOutputSchema},
  tools: [getWeatherForecast],
  prompt: `You are a weather forecasting service. The user wants a 7-day forecast for {{{location}}}. Use the getWeatherForecast tool to get the data and return it.`,
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
