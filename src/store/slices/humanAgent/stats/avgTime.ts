import { AvgTime } from '@/types/HumanAgent'
import { ReducerType } from '@/types/Reducer'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState } from '../../..'
import { getAvgTime } from './actions'

const initialState: ReducerType<AvgTime> = {
  getStatus: 'idle',
  resource: {
    count: 0,
    detail: [],
  },
}

const Slice = createSlice({
  name: 'humanAgent/stats/avgTime',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAvgTime.pending, (state) => {
        state.getStatus = 'pending'
        state.resource = initialState.resource
      })
      .addCase(
        getAvgTime.fulfilled,
        (state, action: PayloadAction<AvgTime>) => {
          state.getStatus = 'resolved'
          state.resource = action.payload
        }
      )
      .addCase(getAvgTime.rejected, (state) => {
        state.getStatus = 'rejected'
        state.resource = initialState.resource
      })
  },
})

export const avgTime = (state: AppState) => state.avgTime
export const avgTimeSelector = createSelector(avgTime, (state) => state)

export const avgTimeReducer = Slice.reducer
