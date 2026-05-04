import React from 'react'
import { Box, Button, CircularProgress } from '@mui/material'
import { useChatContext } from '@/hooks/asesor-humano/useChatContext'

export const StartChatButton = ({ loading }: { loading: boolean }) => {
	const { startConversation } = useChatContext()

	const handleClick = () => {
		startConversation()
	}

	return (
		<Box p={2} display="flex" justifyContent="center">
			<Button
				variant="contained"
				onClick={handleClick}
				disabled={loading}
			>
				Iniciar conversación
				{loading && (
					<CircularProgress size={15} thickness={5} sx={{ ml: 1 }} />
				)}
			</Button>
		</Box>
	)
}
