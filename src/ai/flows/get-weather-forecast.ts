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

function mapWeatherIcon(iconUrl: string, isDay: number): 'Sun' | 'CloudSun' | 'Cloudy' | 'CloudRain' | 'Wind' {
    const code = iconUrl.split('/').pop()?.replace('.png', '');
    if (code === '1000') return isDay ? 'Sun' : 'Cloudy'; // Assuming clear night is just 'Cloudy' icon
    if (code === '1003') return 'CloudSun';
    if (['1006', '1009', '1030', '1135', '1147'].includes(code!)) return 'Cloudy'; // Cloudy, Overcast, Mist, Fog
    if (['1063', '1087', '1150', '1153', '1180', '1183', '1186', '1189', '1192', '1195', '1198', '1201', '1240', '1243', '1246', '1273', '1276'].includes(code!)) return 'CloudRain'; // Rain related
    if (['1066', '1069', '1072', '1114', '1117', '1168', '1171', '1204', '1207', '1210', '1213', '1216', '1219', '1222', '1225', '1237', '1249', '1252', '1255', '1258', '1261', '1264', '1279', '1282'].includes(code!)) return 'Cloudy'; // Snow/Sleet related, mapped to cloudy for simplicity
    return 'Sun';
}


const getWeatherForecast = ai.defineTool(
    {
      name: 'getWeatherForecast',
      description: 'Returns a 5-day weather forecast for a given location, including hourly data.',
      inputSchema: GetWeatherForecastInputSchema,
      outputSchema: GetWeatherForecastOutputSchema,
    },
    async (input) => {
        const apiKey = process.env.WEATHERAPI_KEY;
        const days = 5;
        if (!apiKey) {
            console.log("WeatherAPI.com API key not found. Returning mock data.");
            return {
                location: 'Delhi',
                currentTime: '09:37 AM',
                lastUpdated: 'Updated a few minutes ago',
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

        try {
            const forecastResponse = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${input.location}&days=${days}&aqi=no&alerts=no`);
            if (!forecastResponse.ok) throw new Error('Failed to fetch weather forecast.');
            const data = await forecastResponse.json();
            
            const localTime = new Date(data.location.localtime);

            const daily = data.forecast.forecastday.map((item: any, index: number) => {
                let dayLabel = new Date(item.date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
                if (index === 0) dayLabel = 'Today';
                return {
                    day: dayLabel,
                    temp: Math.round(item.day.avgtemp_c),
                    condition: item.day.condition.text,
                    icon: mapWeatherIcon(item.day.condition.icon, 1),
                    temp_max: Math.round(item.day.maxtemp_c),
                    temp_min: Math.round(item.day.mintemp_c),
                    full_description: `Avg. ${Math.round(item.day.avgtemp_c)}°C, ${item.day.condition.text}. High ${Math.round(item.day.maxtemp_c)}°C, Low ${Math.round(item.day.mintemp_c)}°C.`
                };
            });

            const hourly = data.forecast.forecastday[0].hour.filter((item: any) => {
                 const hourDate = new Date(item.time_epoch * 1000);
                 return hourDate > localTime;
            }).slice(0, 8).map((item:any) => ({
                time: new Date(item.time_epoch * 1000).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
                temp: Math.round(item.temp_c),
                precip: Math.round(item.chance_of_rain),
            }));
            
            return {
                location: `${data.location.name}, ${data.location.region}`,
                currentTime: localTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
                lastUpdated: `Updated at ${new Date(data.current.last_updated_epoch * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
                current: {
                    temp: Math.round(data.current.temp_c),
                    condition: data.current.condition.text,
                    icon: mapWeatherIcon(data.current.condition.icon, data.current.is_day),
                    feelsLike: Math.round(data.current.feelslike_c),
                    windSpeed: Math.round(data.current.wind_kph),
                    humidity: data.current.humidity,
                },
                daily,
                hourly
            };

        } catch (error) {
            console.error("Error fetching real weather data from WeatherAPI.com:", error);
            // Fallback to mock data on error
            return {
                location: 'Delhi',
                currentTime: '09:37 AM',
                lastUpdated: 'Updated a few minutes ago',
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
