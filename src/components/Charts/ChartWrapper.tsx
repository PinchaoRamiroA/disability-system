import React from 'react'
import { Box, SxProps, Typography } from '@mui/material'

type Props = {
	children: React.ReactNode
	dataLength: number
	styles?: SxProps
}

export const ChartWrapper = ({ dataLength, children, styles }: Props) => {
	if (dataLength === 0) {
		return (
			<Typography variant="body2" paragraph textAlign="center">
				No hay datos para mostrar
			</Typography>
		)
	}
	return <Box sx={styles}>{children}</Box>
}