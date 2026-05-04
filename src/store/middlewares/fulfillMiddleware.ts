import { isFulfilled, createListenerMiddleware } from '@reduxjs/toolkit'
import { hideLoading } from 'react-redux-loading-bar'

// Create the middleware instance and methods
export const fulfilledListenerMiddleware = createListenerMiddleware()

// Add one or more listener entries that look for specific actions.
// They may contain any sync or async logic, similar to thunks.
fulfilledListenerMiddleware.startListening({
  matcher: isFulfilled,
  effect: async (action, listenerApi) => {
    // send a message to the server here containing info from the action
    listenerApi.dispatch(hideLoading())
    // console.log('detecta el evento de fulfilled', action)
    // console.log('action payload: ', action.payload)
  },
})
