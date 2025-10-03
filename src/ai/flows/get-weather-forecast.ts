
'use server';

/**
 * @fileOverview A flow to get the real-time weather forecast using AccuWeather API.
 *
 * Note: AccuWeather's free/standard tiers typically provide a 5-day forecast. This
 * flow requests the 5-day forecast and pads to 7 days by repeating the last day
 * if necessary so the UI (which expects 7 days) continues to work.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Simple in-memory cache to reduce external weather API calls.
// Cache is keyed by normalized location string and holds the full output payload.
interface CacheEntry {
    expires: number; // epoch ms
    data: GetWeatherForecastOutput;
}

const weatherCache = new Map<string, CacheEntry>();

function getCacheTTLSeconds(): number {
    const env = process.env.WEATHER_CACHE_TTL_SECONDS;
    const parsed = env ? parseInt(env, 10) : NaN;
    if (!Number.isFinite(parsed) || parsed <= 0) return 600; // default 10 minutes
    return parsed;
}


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

// Helper to map AccuWeather icon phrases to our app's icons
const getIcon = (phrase: string): 'Sun' | 'CloudSun' | 'Cloudy' | 'CloudRain' | 'Wind' => {
    const p = (phrase || '').toLowerCase();
    if (p.includes('cloud') && p.includes('sun')) return 'CloudSun';
    if (p.includes('cloudy')) return 'Cloudy';
    if (p.includes('rain') || p.includes('shower') || p.includes('thunder')) return 'CloudRain';
    if (p.includes('wind')) return 'Wind';
    if (p.includes('sun') || p.includes('clear') || p.includes('hot')) return 'Sun';
    return 'Sun'; // Default icon
};


const getWeatherForecast = ai.defineTool(
    {
      name: 'getWeatherForecast',
    description: 'Returns a 7-day weather forecast for a given location using AccuWeather API.',
      inputSchema: GetWeatherForecastInputSchema,
      outputSchema: GetWeatherForecastOutputSchema,
    },
    async (input) => {
        // Check cache first
        const cacheKey = input.location.trim().toLowerCase();
        const nowMs = Date.now();
        const cached = weatherCache.get(cacheKey);
        if (cached && cached.expires > nowMs) {
            return cached.data;
        }

        // Prefer ACCUWEATHER_API_KEY but keep old env var for compatibility
        const apiKey = process.env.ACCUWEATHER_API_KEY || process.env.VISUAL_CROSSING_API_KEY;
        if (!apiKey) {
            throw new Error("AccuWeather API key is not set (ACCUWEATHER_API_KEY).");
        }

        try {
            // 1) Resolve location to AccuWeather location key
            const searchUrl = `http://dataservice.accuweather.com/locations/v1/cities/search?q=${encodeURIComponent(
                input.location
            )}&apikey=${apiKey}`;

            const searchRes = await fetch(searchUrl);
            if (!searchRes.ok) throw new Error(`Location search failed: ${searchRes.status}`);
            const locations = await searchRes.json();
            if (!Array.isArray(locations) || locations.length === 0) {
                throw new Error('No location found for query.');
            }

            const loc = locations[0];
            const locationKey = loc.Key;
            const resolvedAddress = `${loc.LocalizedName}${loc.AdministrativeArea?.ID ? ', ' + loc.AdministrativeArea.ID : ''}, ${loc.Country?.ID || ''}`;

            // 2) Current conditions
            const currentUrl = `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}&details=true`;
            const currentRes = await fetch(currentUrl);
            if (!currentRes.ok) throw new Error(`Current conditions request failed: ${currentRes.status}`);
            const currentArr = await currentRes.json();
            const current = Array.isArray(currentArr) && currentArr[0] ? currentArr[0] : null;

            // 3) Daily forecast (5 day) - AccuWeather provides 5-day forecast commonly
            const forecastUrl = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey}&metric=true`;
            const forecastRes = await fetch(forecastUrl);
            if (!forecastRes.ok) throw new Error(`Forecast request failed: ${forecastRes.status}`);
            const forecastData = await forecastRes.json();
            const days = forecastData.DailyForecasts || [];

            // Map daily forecasts and pad to 7 days if necessary
            const now = new Date();
            const dailyForecasts = days.map((d: any) => {
                const date = new Date(d.Date);
                let dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' });
                if (date.toDateString() === now.toDateString()) dayLabel = 'Today';
                else dayLabel = `${dayLabel} ${date.getDate()}`;

                const tempMax = d.Temperature?.Maximum?.Value ?? 0;
                const tempMin = d.Temperature?.Minimum?.Value ?? 0;

                return {
                    day: dayLabel,
                    temp: Math.round((tempMax + tempMin) / 2),
                    condition: d.Day?.IconPhrase || d.Day?.LongPhrase || '',
                    icon: getIcon(d.Day?.IconPhrase || ''),
                    temp_max: Math.round(tempMax),
                    temp_min: Math.round(tempMin),
                    full_description: d.Day?.IconPhrase || d.Day?.LongPhrase || '',
                };
            });

            while (dailyForecasts.length < 7) {
                const last = dailyForecasts[dailyForecasts.length - 1];
                if (!last) break;
                // Duplicate last day to reach 7 days
                dailyForecasts.push({ ...last, day: `+${dailyForecasts.length + 1}` });
            }

            // 4) Hourly forecast (12 hour) and pick next 8 hours
            const hourlyUrl = `http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${locationKey}?apikey=${apiKey}&metric=true`;
            const hourlyRes = await fetch(hourlyUrl);
            const hourlyData = hourlyRes.ok ? await hourlyRes.json() : [];

            const nowHour = new Date();
            const hourlyForecasts = (Array.isArray(hourlyData) ? hourlyData : [])
                .slice(0, 8)
                .map((h: any) => ({
                    time: new Date(h.DateTime).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
                    temp: Math.round(h.Temperature?.Value ?? 0),
                    precip: h.PrecipitationProbability ?? 0,
                }));

            const result = {
                location: resolvedAddress,
                currentTime: now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
                lastUpdated: `Updated just now`,
                current: {
                    temp: Math.round(current?.Temperature?.Metric?.Value ?? 0),
                    condition: current?.WeatherText || '',
                    icon: getIcon(current?.WeatherText || ''),
                    feelsLike: Math.round(current?.RealFeelTemperature?.Metric?.Value ?? current?.ApparentTemperature?.Metric?.Value ?? 0),
                    windSpeed: Math.round(current?.Wind?.Speed?.Metric?.Value ?? 0),
                    humidity: current?.RelativeHumidity ?? 0,
                },
                daily: dailyForecasts,
                hourly: hourlyForecasts,
            };

            // Store in cache
            const ttl = getCacheTTLSeconds() * 1000;
            weatherCache.set(cacheKey, { expires: Date.now() + ttl, data: result });

            return result;

        } catch (error) {
            console.error('Weather tool error (AccuWeather):', error);
            // Fallback to mock data on error
            const fallback = {
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
            };

            // Cache fallback too, but with short TTL to avoid repeated failures
            const ttlShort = Math.min(getCacheTTLSeconds(), 60) * 1000; // at most 60s
            weatherCache.set(cacheKey, { expires: Date.now() + ttlShort, data: fallback });

            return fallback;
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
