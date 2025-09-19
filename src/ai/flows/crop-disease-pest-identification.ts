// A plant problem diagnosis AI agent that identifies diseases and pests.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CropDiseasePestIdentificationInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type CropDiseasePestIdentificationInput =
  z.infer<typeof CropDiseasePestIdentificationInputSchema>;

const TreatmentSchema = z.object({
    type: z.enum(['Organic', 'Chemical']).describe('The type of treatment.'),
    name: z.string().describe('The name of the treatment product or method.'),
    description: z.string().describe('A description of how to apply the treatment.'),
    estimatedCost: z.string().describe('The estimated cost of the treatment (e.g., "₹500 - ₹800 per acre").'),
});

const CropDiseasePestIdentificationOutputSchema = z.object({
  identification: z.object({
    plantName: z.string().describe('The common name of the identified plant/crop.'),
    diseaseOrPest: z.string().describe('The identified disease or pest.'),
    confidence: z
      .number()
      .describe('The confidence level of the identification (0-1).'),
  }),
  treatmentGuidance: z.object({
    organic: z.array(TreatmentSchema).describe('Recommended organic treatment options.'),
    chemical: z.array(TreatmentSchema).describe('Recommended chemical treatment options.'),
  }),
  preventativeMeasures: z.array(z.string()).describe('Preventative measures.'),
});
export type CropDiseasePestIdentificationOutput =
  z.infer<typeof CropDiseasePestIdentificationOutputSchema>;

export async function identifyCropProblem(
  input: CropDiseasePestIdentificationInput
): Promise<CropDiseasePestIdentificationOutput> {
  return cropDiseasePestIdentificationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'cropDiseasePestIdentificationPrompt',
  input: {schema: CropDiseasePestIdentificationInputSchema},
  output: {schema: CropDiseasePestIdentificationOutputSchema},
  prompt: `You are an expert in plant pathology and botany.
  Your task is to first identify the plant/crop in the image and then identify potential diseases and pests affecting it.
  Based on your identification, provide detailed treatment guidance, including both organic and chemical options. For each treatment, include the name, description, and an estimated cost.
  Also, suggest a list of preventative measures.
  
  Use the following as the primary source of information about the plant.
  Photo: {{media url=photoDataUri}}

  Please return the plant name, the identified disease/pest, confidence score, detailed treatment options (organic and chemical), and preventative measures.
  `,
});

const cropDiseasePestIdentificationFlow = ai.defineFlow(
  {
    name: 'cropDiseasePestIdentificationFlow',
    inputSchema: CropDiseasePestIdentificationInputSchema,
    outputSchema: CropDiseasePestIdentificationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
