import { useEffect, useRef, useState } from "react";

interface SpeechRecognitionEvent {
  isTrusted?: boolean;
  resultIndex: number;
  results: {
    isFinal: boolean;
    [key: number]:
    | undefined
    | {
      transcript: string;
    };
  }[];
}

interface SpeechRecognition extends EventTarget {
  grammars: string;
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  serviceURI: string;
  onaudiostart: () => void;
  onaudioend: () => void;
  onend: () => void;
  onerror: () => void;
  onnomatch: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onsoundstart: () => void;
  onsoundend: () => void;
  onspeechstart: () => void;
  onspeechend: () => void;
  onstart: () => void;
  abort(): void;
  start(): void;
  stop(): void;
}

declare global {
  interface Window {
    SpeechRecognition: any | { webkitSpeechRecognition: any };
    webkitSpeechRecognition?: any;
  }
}
declare let webkitSpeechRecognition: any;

export interface IUseSpeechRecognition {
  enabled: boolean;
  lang: "ja-JP" | "en-US";
  continuous: boolean; // 連続的に音声認識
  interimResults: boolean; // 途中結果の出力
  threshold_volume?: number; // 音声認識の閾値
}

export type SpeechRecognitionResultProps = {
  prevFinishText: string;
  prevInterimText: string;
  finishText: string;
  interimText: string;
  isPending: boolean;
  pause: boolean; // 一時停止
}

export interface ISpeechRecognitionOutput {
  finishText: string;
}

/**
 * 音声認識ReactHook
 * @param props 
 * @returns 
 */
export const useSpeechRecognition = (props: IUseSpeechRecognition): React.MutableRefObject<SpeechRecognitionResultProps> => {
  const ref = useRef<SpeechRecognitionResultProps>({
    prevFinishText: "",
    prevInterimText: "",
    finishText: '',
    interimText: '',
    isPending: false,
    pause: false,
  });

  let recognition: SpeechRecognition;
  if (typeof window !== 'undefined') {
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || webkitSpeechRecognition;
    recognition = new window.SpeechRecognition();
    recognition.lang = props.lang;
    recognition.interimResults = props.interimResults;
    recognition.continuous = props.continuous;
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      if (props.enabled) {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (ref.current.pause) return;
          const transcript = event.results[i][0]!.transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
            ref.current.finishText = finalTranscript;
            ref.current.isPending = false;
          } else {
            interimTranscript += transcript;
            ref.current.interimText = interimTranscript;
            ref.current.isPending = true;
          }
        }
      }
      else {
        ref.current.interimText = "";
        ref.current.finishText = "";
      }
    };
    recognition.onerror = (() => {
      console.error("エラーでました");
    });
  }

  const getVolume = (analyser: AnalyserNode) => {
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);
  
    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += dataArray[i];
    }
    const average = sum / bufferLength;
    return average / 255;
  };

  const startRecognition = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream: MediaStream) => {
        if (recognition) recognition.start();
      })
      .catch(error => {
        console.error(error);
      });
  }

  const stopRecognition = () => {
    try {
      recognition.stop();
    }
    catch(e){}
  };

  useEffect(() => {
    if (props.enabled) {
      recognition.onend = () => {
        if (props.enabled) {
          recognition.start();
        }
      };
      startRecognition();
    }
    else {
      recognition.onend = () => {};
      stopRecognition();
    }
    return (() => {
      recognition.onend = () => {};
      stopRecognition();
    })
  }, [props.enabled, props.lang]);

  return ref;
}