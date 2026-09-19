import { configureStore } from '@reduxjs/toolkit'
import authReducer, { logout } from './slices/auth.slice'
import { onAuthLogout } from '@/lib/api/axios'

export const store = configureStore({
    reducer: {
        auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})

// Bind automatic 401 logout to Redux store
if (typeof window !== 'undefined') {
    onAuthLogout(() => {
        store.dispatch(logout())
    })
}

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
