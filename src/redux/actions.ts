// actions.ts
import {createAction} from '@reduxjs/toolkit';

export const sendMessage = createAction<Message>('SEND_MESSAGE');
export const receiveMessage = createAction<Message>('RECEIVE_MESSAGE');

interface Message {
  role: string;
  content: string;
}
