interface ITextToSpeech {
  text: string;
  lang: "en-US" | "ja-JP" | "Auto"; // ISO 639-1コードの形式
  speed?: number; // 範囲: 0.1 ~ 10
  pitch?: number; // 範囲: 0.1 ~ 10
  volume?: number; // 範囲: 0 ~ 1
  voiceName?: string; // 使用する音声の種類
}

/**
 * 特定の文字をしゃべらせる
 * @param props 
 */
export const playTextToSpeech = (props: ITextToSpeech) => {
  const utterance = new SpeechSynthesisUtterance(props.text);
  if (props.lang == "Auto"){
    utterance.lang = detectLanguage(props.text);
  }
  else {
    utterance.lang = props.lang;
  }
  utterance.rate = props.speed ? props.speed : 1;
  if (props.voiceName) {
    if (
      speechSynthesis.getVoices().find(
        (voice) => voice.name === props.voiceName)
    ) {
      utterance.voice = speechSynthesis.getVoices().find(
        (voice) => voice.name === props.voiceName
      )
    }
  }
  utterance.pitch = (props.pitch) ? props.pitch : 1;
  utterance.volume = (props.volume) ? props.volume : 1;
  console.log("check", utterance.lang, utterance);
  speechSynthesis.speak(utterance);
}

const detectLanguage = (text: string) => {
  const japaneseRegex = /[\u3000-\u30FF\uFF00-\uFFEF\u4E00-\u9FAF]/;
  const englishRegex = /[A-Za-z]/;

  const japaneseMatches = text.match(japaneseRegex);
  const englishMatches = text.match(englishRegex);

  const japaneseCount = japaneseMatches ? japaneseMatches.length : 0;
  const englishCount = englishMatches ? englishMatches.length : 0;

  if (japaneseCount > englishCount) {
    return "ja-JP";
  } else {
    return "en-US";
  }
};