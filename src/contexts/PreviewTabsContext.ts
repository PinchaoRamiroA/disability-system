import React from 'react'

export type PreviwTabsContextType = {
	tab: number
	setTab: (tab: number) => void
}

export const PreviewTabsContext =
	React.createContext<PreviwTabsContextType | null>(null)
