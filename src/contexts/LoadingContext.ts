import React from 'react'
import { Status } from '@/types/status'

export interface LoadingContextType {
	isLoading: boolean
	status: Status
	fullScreen: boolean
	setStatus: (newStatus: Status) => void
	startLoading: (fullScreen?: boolean) => void
	stopLoading: () => void
}

export const LoadingContext = React.createContext<LoadingContextType | null>(
	null
)
