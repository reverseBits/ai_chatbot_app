// reducers.ts
import {createReducer} from '@reduxjs/toolkit';
import {sendMessage, receiveMessage} from './actions';

interface Message {
  role: string;
  content: string;
}

interface ChatState {
  messages: Message[];
}

const initialState: ChatState = {
  messages: [],
};

export const chatReducer = createReducer(initialState, builder => {
  builder
    .addCase(sendMessage, (state, action) => {
      // Handle sending message (if needed)
      state.messages.push(action.payload);
    })
    .addCase(receiveMessage, (state, action) => {
      // Handle receiving message (if needed)
      state.messages.push(action.payload);
    });
});
