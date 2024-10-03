"use server";

import { InputSongAudioFeatures } from "@/typings";
import { revalidatePath } from "next/cache";

type PredictionResult = {
  predicted_category:
    | "happy"
    | "sad"
    | "calm"
    | "energetic"
    | "confident"
    | "instrumental";
};

export async function predictSongCategory(
  input: InputSongAudioFeatures
): Promise<PredictionResult> {
  const apiUrl = `${process.env.MODEL_API_URL}/predict`;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // revalidatePath('/')

    return result as PredictionResult;
  } catch (error) {
    console.error("Error calling prediction API:", error);
    throw error;
  }
}
