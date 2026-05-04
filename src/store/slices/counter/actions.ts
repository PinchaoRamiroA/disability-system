import { createAsyncThunk, createAction } from '@reduxjs/toolkit'
import { AppThunk } from '@/store/index'
import { selectCount } from './selectors'

//The createAction helper takes an action type and returns an action creator for that type
export const increment = createAction('counter/increment')

export const decrement = createAction('counter/decrement')

export const incrementByAmount = createAction<number>(
  'counter/incrementByAmount'
)

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const incrementAsync = createAsyncThunk(
  'counter/fetchCount',
  async (amount: number, { dispatch }) => {
    dispatch(increment())
    // The value we return becomes the `fulfilled` action payload
    return new Promise<number>(function (resolve, reject) {
      if (amount % 2 === 0) {
        // Setting 2000 ms time
        setTimeout(() => resolve(amount), 2000)
      } else {
        reject()
      }
    })
  }
)

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
export const incrementIfOdd =
  (amount: number): AppThunk =>
  (dispatch, getState) => {
    const currentValue = selectCount(getState())
    if (currentValue % 2 === 1) {
      dispatch(incrementByAmount(amount))
    }
  }
