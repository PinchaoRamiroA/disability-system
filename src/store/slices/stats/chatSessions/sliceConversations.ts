import { ReducerType } from '@/types/Reducer'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState } from '../../..'
import { getChatSessionsConversations as getData } from './actions'
import { ChatSessions } from '@/types/Statistics/ChatSessions'

const initialState: ReducerType<ChatSessions> = {
  getStatus: 'idle',
  resource: {
    data: [],
    summary: [],
  },
}

const Slice = createSlice({
  name: 'chatSessions/conversations',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getData.pending, (state) => {
        state.getStatus = 'pending'
        state.resource = initialState.resource
      })
      .addCase(
        getData.fulfilled,
        (state, action: PayloadAction<ChatSessions>) => {
          state.getStatus = 'resolved'
          state.resource = action.payload
        }
      )
      .addCase(getData.rejected, (state) => {
        state.getStatus = 'rejected'
        state.resource = initialState.resource
      })
  },
})

export const selectConversations = (state: AppState) =>
  state.chatSessionsConversations
export const conversationsSelector = createSelector(
  selectConversations,
  (state) => state
)

export const chatSessionsConversationReducer = Slice.reducer
