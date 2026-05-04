import { SidebarCollapse } from '@/types/Sidebar'
import React from 'react'

export type SidebarContextType = {
	collapsableItems: SidebarCollapse[]
	setCollapsableItems: (value: SidebarCollapse[]) => void
}

export const SidebarContext = React.createContext<SidebarContextType | null>(
	null
)
