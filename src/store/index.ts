import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'

import { rootReducer } from '@/store/rootReducer'
import {
	rejectedlistenerMiddleware,
	pendinglistenerMiddleware,
	fulfilledListenerMiddleware,
} from '@/store/middlewares'

export function makeStore() {
	return configureStore({
		reducer: rootReducer,
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware({ serializableCheck: false })
				.prepend(rejectedlistenerMiddleware.middleware)
				.prepend(fulfilledListenerMiddleware.middleware)
				.prepend(pendinglistenerMiddleware.middleware),
	})
}

const store = makeStore()

/**
 * Infer the `AppState` type from the store itself
 */
export type AppState = ReturnType<typeof store.getState>

/**
 * Infer the `AppDispatch` type from the store itself
 */
export type AppDispatch = typeof store.dispatch

export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	AppState,
	unknown,
	Action<string>
>

/**
 * This creates a Redux store, and also automatically configure the Redux DevTools extension
 * so that you can inspect the store while developing.
 */
export default store
