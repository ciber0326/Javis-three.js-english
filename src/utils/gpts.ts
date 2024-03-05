import { MathUtils } from "three";

export type GPTResProps = {
  id: string;
  jarvis: string;
  jp: string;
  words: string[];
  words_jp: string[];
};

/**
 * JsonModeをobjectにparse
 */
export const parseJsonGpt = (json: string): GPTResProps | null => {
  try {
    const data = JSON.parse(json);
    data.id = MathUtils.generateUUID();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}