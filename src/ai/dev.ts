import { config } from 'dotenv';
config();

import '@/ai/flows/crop-disease-pest-identification.ts';
import '@/ai/flows/voice-assistant-crop-information.ts';
import '@/ai/flows/prompt-assisted-initial-setup.ts';
import '@/ai/flows/environmental-contextualization.ts';
import '@/ai/flows/get-weather-forecast.ts';
import '@/ai/flows/get-market-price.ts';
import '@/ai/flows/get-soil-analysis.ts';
import '@/ai/flows/get-pest-prediction.ts';
