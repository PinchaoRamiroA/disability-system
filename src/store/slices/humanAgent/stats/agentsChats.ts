import { AgentsChats } from '@/types/HumanAgent'
import { ReducerType } from '@/types/Reducer'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState } from '../../..'
import { getAgentsChats } from './actions'

const initialState: ReducerType<AgentsChats> = {
  getStatus: 'idle',
  resource: {
    count: 0,
    detail: [],
  },
}

const Slice = createSlice({
  name: 'humanAgent/stats/agentsChats',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAgentsChats.pending, (state) => {
        state.getStatus = 'pending'
        state.resource = initialState.resource
      })
      .addCase(
        getAgentsChats.fulfilled,
        (state, action: PayloadAction<AgentsChats>) => {
          state.getStatus = 'resolved'
          state.resource = action.payload
        }
      )
      .addCase(getAgentsChats.rejected, (state) => {
        state.getStatus = 'rejected'
        state.resource = initialState.resource
      })
  },
})

const agentsChats = (state: AppState) => state.agentsChats
export const agentsChatsSelector = createSelector(agentsChats, (state) => state)

export const agentsChatsReducer = Slice.reducer
