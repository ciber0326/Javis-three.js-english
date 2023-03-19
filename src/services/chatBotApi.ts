import axios from "axios";

const endpoint = 'https://api.openai.com/v1/chat/completions';

interface IReqChatGPT {
    text: string;
    apiKey: string;
}
export const requestChatGPT = async (props: IReqChatGPT): Promise<string> => {
    const config = {
        headers: {
            'Authorization': `Bearer ${props.apiKey}`,
            'Content-Type': 'application/json'
        }
    };
    
    const data = {
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "user", "content": props.text}],
        "temperature": 0.7
    };

    try {
        const response = await axios.post(endpoint, data, config);
        return response.data.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}