"use server";

import { Features } from "@/typings";
import { handleSpotifyApiError } from "@/utils/spotify";
import { revalidatePath } from "next/cache";

type PredictionResult = {
  track: SpotifyApi.TrackObjectFull & {
    category:
      | "happy"
      | "sad"
      | "calm"
      | "energetic"
      | "confident"
      | "instrumental";
  };
};

export async function predict(inputs: Features[]): Promise<PredictionResult[]> {
  const apiUrl = `${process.env.MODEL_API_URL}/predict`;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputs),
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(
          "Please inform the admin to start the prediction servers. Sorry for the inconvenience!"
        );
      }
      throw new Error(handleSpotifyApiError(response));
    }

    const result = await response.json();

    // revalidatePath('/')

    return result as PredictionResult[];
  } catch (error) {
    console.error("Error calling prediction API:", error);
    throw error;
  }
}
