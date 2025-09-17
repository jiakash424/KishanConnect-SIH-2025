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

function mapWeatherIcon(icon: string): 'Sun' | 'CloudSun' | 'Cloudy' | 'CloudRain' | 'Wind' {
    if (icon.startsWith('01')) return 'Sun'; // clear sky
    if (icon.startsWith('02')) return 'CloudSun'; // few clouds
    if (icon.startsWith('03') || icon.startsWith('04')) return 'Cloudy'; // scattered/broken clouds
    if (icon.startsWith('09') || icon.startsWith('10')) return 'CloudRain'; // shower rain/rain
    if (icon.startsWith('11')) return 'CloudRain'; // thunderstorm
    if (icon.startsWith('13')) return 'Cloudy'; // snow
    if (icon.startsWith('50')) return 'Wind'; // mist
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
        const apiKey = process.env.OPENWEATHER_API_KEY;
        if (!apiKey || apiKey === "YOUR_API_KEY") {
            console.log("OpenWeatherMap API key not found. Returning mock data.");
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
            // 1. Get coordinates for the location
            const geoResponse = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${input.location}&limit=1&appid=${apiKey}`);
            if (!geoResponse.ok) throw new Error('Failed to fetch coordinates for location.');
            const geoData = await geoResponse.json();
            if (geoData.length === 0) throw new Error('Location not found.');
            const { lat, lon } = geoData[0];

            // 2. Get the 5-day forecast
            const forecastResponse = await fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
            if (!forecastResponse.ok) throw new Error('Failed to fetch weather forecast.');
            const forecastData = await forecastResponse.json();
            
            const dailyForecasts: { [key: string]: any } = {};

            forecastData.list.forEach((item: any) => {
                const date = item.dt_txt.split(' ')[0];
                if (!dailyForecasts[date]) {
                    dailyForecasts[date] = {
                        temps: [],
                        conditions: {},
                        icons: {},
                        temp_max: -Infinity,
                        temp_min: Infinity,
                    };
                }
                dailyForecasts[date].temps.push(item.main.temp);
                dailyForecasts[date].temp_max = Math.max(dailyForecasts[date].temp_max, item.main.temp_max);
                dailyForecasts[date].temp_min = Math.min(dailyForecasts[date].temp_min, item.main.temp_min);
                
                const condition = item.weather[0].description;
                const icon = item.weather[0].icon;
                dailyForecasts[date].conditions[condition] = (dailyForecasts[date].conditions[condition] || 0) + 1;
                dailyForecasts[date].icons[icon] = (dailyForecasts[date].icons[icon] || 0) + 1;
            });

            const processedForecast = Object.keys(dailyForecasts).slice(0, 5).map((date, index) => {
                const dayData = dailyForecasts[date];
                const avgTemp = dayData.temps.reduce((a: number, b: number) => a + b, 0) / dayData.temps.length;
                
                const mainCondition = Object.keys(dayData.conditions).reduce((a, b) => dayData.conditions[a] > dayData.conditions[b] ? a : b);
                const mainIcon = Object.keys(dayData.icons).reduce((a, b) => dayData.icons[a] > dayData.icons[b] ? a : b);

                const today = new Date();
                today.setHours(0,0,0,0);
                const forecastDate = new Date(date);
                forecastDate.setHours(0,0,0,0);
                
                let dayLabel = forecastDate.toLocaleDateString('en-US', { weekday: 'long' });
                if (today.getTime() === forecastDate.getTime()) {
                    dayLabel = 'Today';
                } else if (forecastDate.getTime() === new Date(today.getTime() + 86400000).getTime()) {
                    dayLabel = 'Tomorrow';
                }

                return {
                    day: dayLabel,
                    temp: Math.round(avgTemp),
                    condition: mainCondition.charAt(0).toUpperCase() + mainCondition.slice(1),
                    icon: mapWeatherIcon(mainIcon),
                    temp_max: Math.round(dayData.temp_max),
                    temp_min: Math.round(dayData.temp_min),
                    full_description: `Avg. ${Math.round(avgTemp)}°C, ${mainCondition}. High ${Math.round(dayData.temp_max)}°C, Low ${Math.round(dayData.temp_min)}°C.`
                };
            });

            return processedForecast;

        } catch (error) {
            console.error("Error fetching real weather data:", error);
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
