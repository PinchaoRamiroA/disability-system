import React from 'react'
import { Box } from '@mui/material'

export const LogoPreview = ({
	borderRadius,
	height,
	width,
}: {
	borderRadius?: boolean
	height?: number
	width?: number
}) => {
	return (
		<Box
			sx={{
				height: height ?? 50,
				width: width ?? 150,
				backgroundSize: 'contain',
				backgroundRepeat: 'no-repeat',
				backgroundPosition: 'center',
				backgroundImage: 'url(/images/logo-horizontal.jpg)',
				borderRadius: borderRadius ? '50%' : 'none',
			}}
		/>
	)
}
