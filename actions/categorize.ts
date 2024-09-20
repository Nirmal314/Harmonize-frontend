"use server";

import { revalidatePath } from "next/cache";

export type SongAudioFeatures = {
  danceability: number;
  energy: number;
  acousticness: number;
  valence: number;
  tempo: number;
};

type PredictionResult = {
  predicted_category: string;
};

export async function predictSongCategory(
  input: SongAudioFeatures
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
