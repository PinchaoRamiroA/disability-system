import React, { useEffect, useState } from 'react'
import { LoadingContext } from '@/contexts/LoadingContext'
import { Status } from '@/types/status'

export const LoaderLayout = ({ children }: { children: React.ReactNode }) => {
	const [isLoading, setIsLoading] = useState(false)
	const [fullScreen, setFullScreen] = useState(false)
	const [status, setStatus] = useState<Status>('idle')

	const startLoading = (_fullScreen = false) => {
		setFullScreen(_fullScreen)
		setIsLoading(true)
	}

	const stopLoading = () => {
		setIsLoading(false)
	}

	useEffect(() => {
		setIsLoading(status === 'pending')
	}, [status])

	return (
		<LoadingContext.Provider
			value={{
				isLoading,
				startLoading,
				stopLoading,
				status,
				setStatus,
				fullScreen,
			}}
		>
			{children}
		</LoadingContext.Provider>
	)
}
