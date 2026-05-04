import { EscalatedChats } from '@/types/HumanAgent'
import { ReducerType } from '@/types/Reducer'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState } from '../../..'
import { getEscalatedChats } from './actions'

const initialState: ReducerType<EscalatedChats> = {
  getStatus: 'idle',
  resource: {
    count: 0,
    detail: [],
  },
}

const Slice = createSlice({
  name: 'humanAgent/stats/escalatedChats',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getEscalatedChats.pending, (state) => {
        ;(state.getStatus = 'pending'), (state.resource = initialState.resource)
      })
      .addCase(
        getEscalatedChats.fulfilled,
        (state, action: PayloadAction<EscalatedChats>) => {
          state.getStatus = 'resolved'
          state.resource = action.payload
        }
      )
      .addCase(getEscalatedChats.rejected, (state) => {
        state.getStatus = 'rejected'
        state.resource = initialState.resource
      })
  },
})

export const escalatedChats = (state: AppState) => state.escalatedChats
export const escalatedChatsSelector = createSelector(
  escalatedChats,
  (state) => state
)

export const escalatedChatsReducer = Slice.reducer
