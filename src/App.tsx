import React, { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import { useSpeechRecognition } from './services/SpeechRecognitionHelper';
import { BsFillMicFill, BsFillMicMuteFill } from "react-icons/bs";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { AiOutlineQuestionCircle, AiFillSave, AiOutlineReload } from "react-icons/ai";
import { requestChatGPT } from './services/chatBotApi';
import Swal from "sweetalert2";
import { playTextToSpeech } from './services/TextToSpeechHelper';

export const App = () => {
  const apiKey = useRef<string>(null);
  const [enabled, setEnbled] = useState<boolean>(false);
  const [reload, setReload] = useState<number>(0);
  const [lang, setLang] = useState<"en-US" | "ja-JP">("en-US");
  const speechText = useSpeechRecognition({ enabled: enabled, lang: lang, continuous: true, interimResults: true });
  const ref = useRef<HTMLDivElement>();
  const volumeRef = useRef<number>(0.6);
  const pitchRef = useRef<number>(1.0);
  const speedRef = useRef<number>(1.0);
  const suspendRef = useRef<boolean>(false);

  const _apiKey = localStorage.getItem("OPENAI_API_KEY");
  if (_apiKey){
    apiKey.current = _apiKey;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      frameLoop();
    }, 1000 / 10);
    const suspend = document.getElementById("suspend");
    suspend.style.display = "none";
    return () => clearInterval(interval);
  }, [enabled, reload]);

  const appendChatBoxText = async () => {
    if (!suspendRef.current){
      suspendRef.current = true;
      if (!apiKey.current || (apiKey && apiKey.current.length < 16)){
        Swal.fire({
          icon: 'error',
          title: 'APIキーが設定されていません。',
          html: 'OpenAIの<a href="https://platform.openai.com/account/api-keys">APIページ</a>よりAPIキーを入手してください。<br/>'
            + '入手後その値を"OpeAIのAPIキーをここに入力してください"と記述されたところ貼り付けてください。',
          imageUrl: 'description-openai-key.jpg',
          imageHeight: 200,
          imageAlt: 'Image',
        })
        return;
      }
      const suspend = document.getElementById("suspend");
      suspend.style.display = "block";
      const chatbotText = await requestChatGPT({ text: speechText.finishText, apiKey: apiKey.current });
      suspendRef.current = false;
      suspend.style.display = "none";
      playTextToSpeech({ 
        text: chatbotText, 
        lang: "Auto",
        // volume: volumeRef.current,
        // speed: speedRef.current,
        // pitch: pitchRef.current
      });
      const newElement = document.createElement('div');
      newElement.className = "message theirs";
      newElement.textContent = chatbotText;
      ref.current.appendChild(newElement);
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }

  const setMineMessage = (text: string) => {
    const newElement = document.createElement('div');
    newElement.className = "message mine";
    newElement.textContent = text;
    ref.current.appendChild(newElement);
    ref.current.scrollTop = ref.current.scrollHeight;
    appendChatBoxText();
  }

  const frameLoop = () => {
    if (speechText.interimText.length > 0){
      const text = document.getElementById("text");
      text.innerText = speechText.interimText;
    }
    if (ref.current){
      const lastChild = ref.current.lastElementChild;
      // console.log(lastChild);
      if (!lastChild || lastChild.classList.contains("system")){
        if (speechText.finishText){
          setMineMessage(speechText.finishText);
        }
      }
      else {
        const lastText = lastChild.textContent;
        if (lastChild.classList.contains("mine")){
          if (lastText != speechText.finishText){
            setMineMessage(speechText.finishText);
          }
        }
        else if (lastChild.classList.contains("theirs")){
          const secondLastElement = ref.current.children[ref.current.children.length - 2];
          const secondLastText = secondLastElement.textContent;
          if (secondLastText != speechText.finishText && speechText.finishText.length > 3){
            setMineMessage(speechText.finishText);
          }
        }
      }
    }
  }

  const startSpeech = () => {
    if (!apiKey.current || (apiKey && apiKey.current.length < 16)){
      Swal.fire({
        icon: 'error',
        title: 'APIキーが設定されていません。',
        html: 'OpenAIの<a href="https://platform.openai.com/account/api-keys">APIページ</a>よりAPIキーを入手してください。<br/>'
          + '入手後その値を"OpeAIのAPIキーをここに入力してください"と記述されたところ貼り付けてください。',
        imageUrl: 'description-openai-key.jpg',
        imageHeight: 200,
        imageAlt: 'Image',
      })
      return;
    }
    setEnbled(!enabled);
  }

  const changeLang = () => {
    if (lang == "en-US"){
      setLang("ja-JP");
    }
    else if (lang == "ja-JP"){
      setLang("en-US");
    }
  } 

  const openLinkDesciption = () => {
    Swal.fire({
      title: 'APIキーの入手してますか?',
      html: 'OpenAIの<a href="https://platform.openai.com/account/api-keys">APIページ</a>よりAPIキーを入手してください。<br/>'
            + '入手後その値を"OpeAIのAPIキーをここに入力してください"と記述されたところ貼り付けてください。',
      imageUrl: 'description-openai-key.jpg',
      imageHeight: 200,
      imageAlt: 'A tall image',
    });
  }

  const saveLocalStorage = () => {
    Swal.fire({
      title: 'APIキーを保持する?',
      showDenyButton: true,
      confirmButtonText: 'する',
      denyButtonText: `しない`,
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.setItem("OPENAI_API_KEY", apiKey.current);
        Swal.fire('保持しました!', '', 'success')
      }
    })
  }

  const startReload = () => {
    suspendRef.current = false;
    const suspend = document.getElementById("suspend");
    suspend.style.display = "none";
    setReload(reload + 1);
  }

  return (
    <div className="App">
        <>
          <div>
            <div className="chatroom">
              <div className="header">
                AI英会話
                <a className="icon desc" onClick={() => {openLinkDesciption()}}>
                  <AiOutlineQuestionCircle/>
                </a>
                <a className="icon mic" onClick={() => startSpeech()}>
                  マイク
                  {enabled?
                     <BsFillMicFill/>: <BsFillMicMuteFill/>
                  }
                </a>
                <a className="icon lang" onClick={() => changeLang()}>
                  言語({lang})
                </a>
              </div>
              <div className="keyinput">
                <input 
                  className='input'
                  type="password" 
                  placeholder='OpenAIのAPIキーをここに入力してください。' 
                  value={apiKey.current}
                  onInput={(e: any) => {apiKey.current = e.target.value}} 
                />
                <a className="save" onClick={() => saveLocalStorage()}>
                  <AiFillSave/>
                </a>
              </div>
              <div className="messages" ref={ref}>
                <div className="message system">
                  <div>
                    APIキーを入力後、<br/>マイクをONにしてください
                  </div>
                  <div className="mic-help">
                    {!enabled &&
                    <a className="btn" onClick={() => startSpeech()}>
                      マイクONにする
                    </a>
                    }
                  </div>
                </div>
              </div>
              <div className='chatthinking'>
                <div id="suspend" className="suspend">
                  回答を作成しています<BiDotsHorizontalRounded/>
                </div>
              </div>
              <div className='nowspeaking'>
                <div className="text">
                  <a className="reload" onClick={() => {startReload()}}><AiOutlineReload/></a>
                  <span id="text"></span>
                </div>
              </div>
            </div>
        </div>
        </>
    </div>
  );
}

const synth = window.speechSynthesis;
const VoiceSelector = ({ selected = 0, setSelected }) => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  const populateVoiceList = useCallback(() => {
    const newVoices = synth.getVoices();
    setVoices(newVoices);
  }, []);

  useEffect(() => {
    populateVoiceList();
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = populateVoiceList;
    }
  }, [populateVoiceList]);

  return (
    <select
      value={selected}
      onChange={(e) => setSelected(parseInt(e.target.value))}
    >
      {voices.map((voice, index) => (
        <option key={index} value={index}>
          {voice.name} ({voice.lang}) {voice.default && ' [Default]'}
        </option>
      ))}
    </select>
  );
};