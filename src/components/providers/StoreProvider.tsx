'use client'

import React, { useEffect } from 'react'
import { Provider } from 'react-redux'
import { store } from '@/store'
import { hydrateAuth } from '@/store/slices/auth.slice'

export function StoreProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        store.dispatch(hydrateAuth())
    }, [])

    return <Provider store={store}>{children}</Provider>
}

export default StoreProvider
