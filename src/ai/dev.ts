import { config } from 'dotenv';
config();

import '@/ai/flows/crop-disease-pest-identification.ts';
import '@/ai/flows/voice-assistant-crop-information.ts';
import '@/ai/flows/prompt-assisted-initial-setup.ts';
import '@/ai/flows/environmental-contextualization.ts';