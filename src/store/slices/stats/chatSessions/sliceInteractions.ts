import { ReducerType } from '@/types/Reducer'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState } from '../../..'
import { getChatSessionsInteractions as getData } from './actions'

const initialState: ReducerType<number> = {
  getStatus: 'idle',
  resource: 0,
}

const Slice = createSlice({
  name: 'chatSessions/interactions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getData.pending, (state) => {
        state.getStatus = 'pending'
        state.resource = initialState.resource
      })
      .addCase(getData.fulfilled, (state, action: PayloadAction<number>) => {
        state.getStatus = 'resolved'
        state.resource = action.payload
      })
      .addCase(getData.rejected, (state) => {
        state.getStatus = 'rejected'
        state.resource = initialState.resource
      })
  },
})

export const selectTotalInteractions = (state: AppState) =>
  state.chatSessionsInteractions
export const interactionsTotalSelector = createSelector(
  selectTotalInteractions,
  (state) => state
)

export const chatSessionsInteractionsReducer = Slice.reducer
