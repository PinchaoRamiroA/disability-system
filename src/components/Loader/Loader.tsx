import React, { useContext } from 'react'
import { Box } from '@mui/material'
import { LoadingContext, LoadingContextType } from '@/contexts/LoadingContext'

interface Props {
	drawerWidth?: number
}

export const Loader = ({ drawerWidth }: Props) => {
	const { isLoading, status, fullScreen } = useContext(
		LoadingContext
	) as LoadingContextType

	if (isLoading || status === 'pending') {
		return (
			<Box
				sx={{
					zIndex: (theme) => theme.zIndex.drawer * 3,
					width: drawerWidth
						? `calc(100% - ${fullScreen ? 0 : drawerWidth}px)`
						: '100%',
					height: !fullScreen ? 'calc(100vh - 64px)' : '100vh',
					position: 'fixed',
					backgroundColor: 'rgba(0, 0, 0, 0.2)',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					color: 'white',
					bottom: 0,
					right: 0,
				}}
			>
				<p>Cargando...</p>
			</Box>
		)
	}
	return null
}
