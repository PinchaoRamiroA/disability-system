import { ReducerType } from '@/types/Reducer'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState } from '../..'
import { getEvents } from './actions'
import { Events } from '@/types/Events'

const initialState: ReducerType<Events[]> = {
  getStatus: 'idle',
  resource: [],
}

const Slice = createSlice({
  name: 'splits',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getEvents.pending, (state) => {
        state.getStatus = 'pending'
        state.resource = initialState.resource
      })
      .addCase(
        getEvents.fulfilled,
        (state, action: PayloadAction<Events[]>) => {
          state.getStatus = 'resolved'
          state.resource = action.payload
        }
      )
      .addCase(getEvents.rejected, (state) => {
        state.getStatus = 'rejected'
        state.resource = initialState.resource
      })
  },
})

export const selectEvents = (state: AppState) => state.events
export const eventsSelector = createSelector(selectEvents, (state) => state)

export const eventsReducer = Slice.reducer
