interface ITextToSpeech {
  text: string;
  lang?: "en-US" | "ja-JP" | "Auto"; // ISO 639-1コードの形式
  speed?: number;     // 範囲: 0.1 ~ 10
  pitch?: number;     // 範囲: 0.1 ~ 10
  volume?: number;    // 範囲: 0 ~ 1
  voiceName?: string; // 使用する音声の種類
}

let utterance: SpeechSynthesisUtterance;
if (typeof SpeechSynthesisUtterance !== 'undefined') {
  // SpeechSynthesisUtteranceを使用
  utterance = new SpeechSynthesisUtterance();
} else {
  console.warn("SpeechSynthesisUtterance is not supported.");
}

const maxLen = 500;

/**
 * 特定の文字をしゃべらせる
 * @param props 
 */
export const playTextToSpeech = ({
  text,
  lang = "Auto",
  speed = 1.0,
  pitch = 1.0,
  volume = 0.8,
  voiceName = "",
}: ITextToSpeech): Promise<void> => {
  if (!utterance) {
    try {
      utterance = new SpeechSynthesisUtterance();
    }
    catch (e) {
      console.log(e);
      return Promise.resolve();
    }
    utterance = new SpeechSynthesisUtterance();
  }
  return new Promise((resolve) => {
    utterance.text = text.length > maxLen ? text.substring(0, maxLen - 1) : text;
    if (lang == "Auto" || !lang) {
      utterance.lang = detectLanguage(text);
    } else {
      utterance.lang = lang ;
    }
    utterance.rate = speed ? speed : 1;
    if (voiceName) {
      if (
        window.speechSynthesis.getVoices().find(
          (voice) => voice.name === voiceName)
      ) {
        utterance.voice = window.speechSynthesis.getVoices().find(
          (voice) => voice.name === voiceName
        ) as SpeechSynthesisVoice;
      }
    }
    utterance.pitch = (pitch) ? pitch : 1.0;
    utterance.volume = (volume) ? volume : 0.8;

    // Resolve the promise when the speech ends
    utterance.onend = () => {
      resolve();
    };

    window.speechSynthesis.speak(utterance);
  });
};

const detectLanguage = (text: string) => {
  const textLength = text.length;
  let japaneseCount = 0;
  for(let i=0; i < textLength; i++){
    if(text.charCodeAt(i) >= 256) {
      japaneseCount++;
    }
  }
  if (japaneseCount > textLength/2) {
    return "ja-JP";
  } else {
    return "en-US";
  }
};