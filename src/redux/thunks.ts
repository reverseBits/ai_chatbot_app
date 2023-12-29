// thunks.ts
import {Dispatch} from 'redux';
import {sendMessage, receiveMessage} from './actions';
import axios, {AxiosError} from 'axios';
import {RootState} from './store';

// Your OpenAI API key
const OPENAI_API_KEY = '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';

const client = axios.create({
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${OPENAI_API_KEY}`,
  },
});

const chatGptEndPoint = 'https://api.openai.com/v1/chat/completions';
const dalleEndPoint = 'https://api.openai.com/v1/images/generations';

export const sendMessageAsync =
  (
    message: {role: string; content: string},
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  ) =>
  async (dispatch: Dispatch, getState: () => RootState) => {
    try {
      // Dispatch the user message
      setIsLoading(true);
      dispatch(sendMessage(message));

      // Ask ChatGPT whether the message wants to generate an image
      const conversation = getState().chat.messages; // Get the entire conversation

      const responseChatGPT = await client.post(chatGptEndPoint, {
        model: 'gpt-3.5-turbo',
        messages: conversation.concat([message]),
      });

      // Dispatch the bot's response
      dispatch(receiveMessage(responseChatGPT.data.choices[0].message));
      if (responseChatGPT.data) {
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      if (axios.isAxiosError(error)) {
        setIsLoading(false);
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 429) {
          // Handle rate-limiting or other errors
          console.error('API Rate Limit Exceeded');
        }
      }
    }
  };

export const sendMesageDalleAsync =
  (
    message: {role: string; content: string},
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  ) =>
  async (dispatch: Dispatch) => {
    try {
      // Dispatch the user message
      setIsLoading(true);
      dispatch(sendMessage(message));
      // Ask ChatGPT whether the message wants to generate an image

      const responseDalle = await client.post(dalleEndPoint, {
        prompt: message.content,
        n: 1,
        size: '512x512',
      });

      // Dispatch the bot's response
      dispatch(
        receiveMessage({
          role: 'assistant',
          content: 'dalleImage : ' + responseDalle.data.data[0].url,
        }),
      );
      if (responseDalle.data) {
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      setIsLoading(false);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 429) {
          // Handle rate-limiting or other errors
          console.error('API Rate Limit Exceeded');
        }
      }
    }
  };
