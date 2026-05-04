import { isRejected, createListenerMiddleware, nanoid } from '@reduxjs/toolkit'
import { enqueueSnackbar } from '@/store/slices/notistack'
import { IEnqueueSnackbar } from '@/types/notistack'
import { hideLoading } from 'react-redux-loading-bar'

import type { TypedStartListening } from '@reduxjs/toolkit'

import type { AppState, AppDispatch } from '@/store/index'

// export const listenerMiddleware = createListenerMiddleware()

export type AppStartListening = TypedStartListening<AppState, AppDispatch>

// Create the middleware instance and methods
export const rejectedlistenerMiddleware = createListenerMiddleware()

// Add one or more listener entries that look for specific actions.
// They may contain any sync or async logic, similar to thunks.
rejectedlistenerMiddleware.startListening({
  matcher: isRejected,
  effect: async (action, listenerApi) => {
    // send a message to the server here containing info from the action
    listenerApi.dispatch(hideLoading())
    const payload = action.payload as IEnqueueSnackbar
    if (typeof payload === 'object' && 'message' in payload) {
      payload.key = nanoid()
      listenerApi.dispatch(enqueueSnackbar(payload))
    }
  },
})
