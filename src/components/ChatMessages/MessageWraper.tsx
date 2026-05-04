import React from 'react'
import { Box, SxProps, useTheme } from '@mui/material'

interface Props {
	children: React.ReactElement
	client: boolean
	interactionScrolled?: boolean
}

export const MessageWrapper = ({
	client,
	interactionScrolled = false,
	children,
}: Props) => {
	const {
		asesorHumano: { mensajeAsesor, mensajeCliente },
	} = useTheme()

	const styles: SxProps = {
		maxWidth: 400,
		backgroundColor: client
			? mensajeCliente.background
			: mensajeAsesor.background,
		color: client ? mensajeCliente.color : mensajeAsesor.color,
		border: interactionScrolled ? 2 : 1,
		borderColor: interactionScrolled ? '#7a7a7a' : '#E5E5E5',
		borderRadius: client ? '0 16px 16px' : '16px 0 16px 16px',
		marginBottom: 1,
		marginLeft: client ? 0 : 4,
		padding: '0.5em 1em',
		wordWrap: 'break-word',
	}

	return (
		<Box sx={styles} alignSelf={client ? 'flex-start' : 'flex-end'}>
			{children}
		</Box>
	)
}
