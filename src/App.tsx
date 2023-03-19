import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { useSpeechRecognition } from './services/SpeechRecognitionHelper';
import { BsFillMicFill, BsFillMicMuteFill } from "react-icons/bs";
import { AiOutlineQuestionCircle, AiFillSave } from "react-icons/ai";
import { requestChatGPT } from './services/chatBotApi';
import Swal from "sweetalert2";
import { playTextToSpeech } from './services/TextToSpeechHelper';

function App() {
  const apiKey = useRef<string>(null);
  const [enabled, setEnbled] = useState<boolean>(false);
  const [lang, setLang] = useState<"en" | "ja">("en");
  const speechText = useSpeechRecognition({ enabled: enabled, lang: lang, continuous: true, interimResults: true });
  const ref = useRef<HTMLDivElement>();
  const inputRef = useRef<HTMLInputElement>();
  const volumeRef = useRef<number>(0.6);
  const pitchRef = useRef<number>(1.0);
  const speedRef = useRef<number>(1.0);
  const suspendRef = useRef<boolean>(false);

  useEffect(() => {
    const _apiKey = localStorage.getItem("OPENAI_API_KEY");
    if (_apiKey){
      apiKey.current = _apiKey;
      inputRef.current.value = _apiKey;
    }
    const interval = setInterval(() => {
      frameLoop();
    }, 1000 / 5);
    return () => clearInterval(interval);
  }, []);

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
          imageAlt: 'A tall image',
        })
        return;
      }
      const chatbotText = await requestChatGPT({ text: speechText.finishText, apiKey: apiKey.current });
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
      suspendRef.current = false;
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
        imageAlt: 'A tall image',
      })
      return;
    }
    setEnbled(!enabled);
  }

  const changeLang = () => {
    if (lang == "en"){
      setLang("ja");
    }
    else if (lang == "ja"){
      setLang("en");
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
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        localStorage.setItem("OPENAI_API_KEY", apiKey.current);
        Swal.fire('保持しました!', '', 'success')
      }
    })
  }

  return (
    <div className="App">
        <>
          <div>
            <div className="chatroom">
              <div className="header">
                AI英会話
                <a className="icon" onClick={() => {openLinkDesciption()}}>
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
                  ref={inputRef}
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
            </div>
        </div>
        </>
    </div>
  );
}

export default App;
