import { isPending, createListenerMiddleware } from '@reduxjs/toolkit'
import { showLoading } from 'react-redux-loading-bar'

// Create the middleware instance and methods
export const pendinglistenerMiddleware = createListenerMiddleware()

// Add one or more listener entries that look for specific actions.
// They may contain any sync or async logic, similar to thunks.
pendinglistenerMiddleware.startListening({
  matcher: isPending,
  effect: async (action, listenerApi) => {
    // send a message to the server here containing info from the action
    listenerApi.dispatch(showLoading())
    // console.log('detecta el evento de pending', action)
    // console.log('action payload: ', action.payload)
  },
})
