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

const CropDiseasePestIdentificationOutputSchema = z.object({
  identification: z.object({
    diseaseOrPest: z.string().describe('The identified disease or pest.'),
    confidence: z
      .number()
      .describe('The confidence level of the identification (0-1).'),
  }),
  solutions: z.array(z.string()).describe('Recommended solutions.'),
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
  prompt: `You are an expert in plant pathology and entomology.
  Your task is to identify potential plant diseases and pests from the image provided and suggest solutions and preventative measures.  Use the following as the primary source of information about the plant.

  Photo: {{media url=photoDataUri}}

  Please provide the identification, solutions, and preventative measures in the output. Return a confidence score between 0 and 1 for the identification.
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
