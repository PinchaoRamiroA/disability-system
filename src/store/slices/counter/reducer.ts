import { createReducer, PayloadAction } from '@reduxjs/toolkit'
import {
  decrement,
  increment,
  incrementByAmount,
  incrementAsync,
} from './actions'

type CounterState = {
  value: number
  status: 'idle' | 'loading' | 'failed'
}

const initialState: CounterState = {
  value: 0,
  status: 'idle',
}

export const counterReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(increment, (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value++
    })
    .addCase(decrement, (state) => {
      state.value--
    })
    .addCase(incrementByAmount, (state, action: PayloadAction<number>) => {
      // Use the PayloadAction type to declare the contents of `action.payload`
      state.value += action.payload
    })
    .addCase(incrementAsync.pending, (state) => {
      state.status = 'loading'
    })
    .addCase(incrementAsync.fulfilled, (state, action) => {
      state.status = 'idle'
      state.value += action.payload
    })
    .addCase(incrementAsync.rejected, (state) => {
      state.status = 'failed'
    })
})
