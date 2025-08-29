import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult, DrugInteraction, AlternativeFinderResult, ImagePart } from '../types';

// Fix: Switched from `import.meta.env.VITE_API_KEY` to `process.env.API_KEY` as required by the coding guidelines.
if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    drugs: {
      type: Type.ARRAY,
      description: "List of identified drugs with their descriptions and classes.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "The normalized name of the drug." },
          description: { type: Type.STRING, description: "A brief description of the drug's purpose." },
          classes: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Pharmacological classes of the drug." },
          dosage: { type: Type.STRING, description: "The dosage extracted from the text, e.g., '500 mg'." },
          frequency: { type: Type.STRING, description: "The frequency of administration, e.g., 'every 6 hours'." },
        },
        required: ["name", "description", "classes"]
      }
    },
    interactions: {
      type: Type.ARRAY,
      description: "List of potential drug-drug interactions.",
      items: {
        type: Type.OBJECT,
        properties: {
          pair: { type: Type.ARRAY, items: { type: Type.STRING }, description: "The pair of interacting drugs." },
          severity: { type: Type.STRING, enum: ['low', 'moderate', 'high'], description: "The severity of the interaction." },
          explanation: { type: Type.STRING, description: "An explanation of the interaction's mechanism and risks." },
        },
        required: ["pair", "severity", "explanation"]
      }
    },
    dosageRecommendations: {
      type: Type.ARRAY,
      description: "Dosage recommendations based on patient profile.",
      items: {
        type: Type.OBJECT,
        properties: {
          drug: { type: Type.STRING, description: "The drug for which the dosage is recommended." },
          recommendation: { type: Type.STRING, description: "The specific dosage recommendation." },
          warning: { type: Type.STRING, description: "Any warnings or contraindications based on age or weight. Can be null." },
        },
        required: ["drug", "recommendation"]
      }
    },
    alternativeSuggestions: {
      type: Type.ARRAY,
      description: "Safer alternative medications for drugs with high-risk interactions.",
      items: {
        type: Type.OBJECT,
        properties: {
          forDrug: { type: Type.STRING, description: "The original drug that should be replaced." },
          reason: { type: Type.STRING, description: "The reason for suggesting an alternative (e.g., interaction)." },
          suggestion: { type: Type.STRING, description: "A full sentence suggesting an alternative, like 'Consider replacing with...'" },
          suggestedDrug: { type: Type.STRING, description: "The name of the suggested alternative drug." }
        },
        required: ["forDrug", "reason", "suggestion", "suggestedDrug"]
      }
    }
  },
  required: ["drugs", "interactions", "dosageRecommendations", "alternativeSuggestions"]
};

const interactionCheckResponseSchema = {
  type: Type.OBJECT,
  properties: {
    interactions: {
      type: Type.ARRAY,
      description: "List of potential drug-drug interactions.",
      items: {
        type: Type.OBJECT,
        properties: {
          pair: { type: Type.ARRAY, items: { type: Type.STRING }, description: "The pair of interacting drugs." },
          severity: { type: Type.STRING, enum: ['low', 'moderate', 'high'], description: "The severity of the interaction." },
          explanation: { type: Type.STRING, description: "An explanation of the interaction's mechanism and risks." },
        },
        required: ["pair", "severity", "explanation"]
      }
    },
  },
  required: ["interactions"]
};

const alternativeFinderResponseSchema = {
    type: Type.OBJECT,
    properties: {
        suggestions: {
            type: Type.ARRAY,
            description: "A list of suggested alternative medications.",
            items: {
                type: Type.OBJECT,
                properties: {
                    suggestedDrug: { type: Type.STRING, description: "The name of the suggested alternative drug." },
                    reasoning: { type: Type.STRING, description: "Detailed reasoning for why this drug is a suitable alternative." },
                    benefits: { type: Type.STRING, description: "Specific benefits of the suggested drug over the original one for this patient." },
                    considerations: { type: Type.STRING, description: "Important considerations or potential side effects for this alternative." },
                },
                required: ["suggestedDrug", "reasoning", "benefits", "considerations"],
            },
        },
    },
    required: ["suggestions"],
};


export const analyzePrescription = async (
  input: string | ImagePart,
  age: number,
  weight?: number
): Promise<AnalysisResult> => {

  const patientProfile = `Patient Age: ${age} years${weight ? `, Patient Weight: ${weight} kg` : ''}.`;
  
  const instruction = `
    Analyze the following medical prescription based on the provided patient profile. The prescription may be in text or image format.
    Identify all drugs, check for interactions, provide dosage recommendations, and suggest alternatives for high-risk interactions.
    
    Patient Profile: ${patientProfile}
    
    Based on this information, provide a comprehensive analysis.
    - Identify each drug mentioned. For each drug, extract its name, its dosage (e.g., '500mg'), and its frequency (e.g., 'every 6 hours') if mentioned.
    - List all potential drug-drug interactions with their severity and a clear explanation.
    - For each identified drug, provide a dosage recommendation appropriate for the patient's age and weight. Include any specific warnings.
    - If any 'high' or 'moderate' severity interactions are found, suggest a safer alternative medication for one of the interacting drugs.
    
    Return the analysis strictly in the provided JSON format. Do not add any commentary before or after the JSON object.
  `;

  const contents = (typeof input === 'string')
    ? [{ text: instruction }, { text: `Prescription Text: "${input}"` }]
    : [{ text: instruction }, input];


  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: contents },
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
      },
    });

    const jsonString = response.text.trim();
    const result: AnalysisResult = JSON.parse(jsonString);
    return result;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get analysis from AI. The model may have returned an invalid response.");
  }
};

export const checkDrugInteractions = async (
  drugListText: string
): Promise<DrugInteraction[]> => {
  const prompt = `
    Analyze the following list of drugs for potential drug-drug interactions.
    The list of drugs is: "${drugListText}".
    
    For each interaction found, provide the pair of drugs, the severity level (low, moderate, or high), and a clear explanation of the interaction.
    If no interactions are found, return an empty array for "interactions".
    
    Return the analysis strictly in the provided JSON format. Do not add any commentary before or after the JSON object.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: interactionCheckResponseSchema,
      },
    });

    const jsonString = response.text.trim();
    const result: { interactions: DrugInteraction[] } = JSON.parse(jsonString);
    return result.interactions;

  } catch (error) {
    console.error("Error calling Gemini API for interaction check:", error);
    throw new Error("Failed to get interaction analysis from AI. The model may have returned an invalid response.");
  }
};

export const findAlternativeMedication = async (
    originalDrug: string,
    condition: string,
    patientContext: string
): Promise<AlternativeFinderResult[]> => {
    const prompt = `
      Act as a clinical pharmacologist. A patient needs an alternative to a specific medication.
      
      - Original Drug: ${originalDrug}
      - Condition Being Treated: ${condition}
      - Patient Context: "${patientContext}"
      
      Based on this, suggest one or two suitable alternative medications. For each suggestion, provide:
      1.  'suggestedDrug': The name of the alternative drug.
      2.  'reasoning': A clear rationale explaining why this is a good alternative, considering the patient's context (e.g., avoids a specific interaction, better side-effect profile).
      3.  'benefits': Key benefits of choosing this alternative over the original drug.
      4.  'considerations': Important things to consider, such as common side effects or monitoring requirements.

      If the original drug is appropriate and no alternative is needed based on the context, you can return an empty list of suggestions.
      Return the analysis strictly in the provided JSON format.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: alternativeFinderResponseSchema,
            },
        });

        const jsonString = response.text.trim();
        const result: { suggestions: AlternativeFinderResult[] } = JSON.parse(jsonString);
        return result.suggestions;

    } catch (error) {
        console.error("Error calling Gemini API for alternative finder:", error);
        throw new Error("Failed to get alternative suggestions from AI. The model may have returned an invalid response.");
    }
};
