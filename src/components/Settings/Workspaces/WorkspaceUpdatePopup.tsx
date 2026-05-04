import { AlertDialog } from '@/components/Dialog'
import { useAppSelector } from '@/hooks/useReduxHooks'
import { workspaceUpdateResumeSelector } from '@/store/slices/workspaces'
import { Box, Typography } from '@mui/material'
import React from 'react'

interface Props {
	open: boolean
	success: boolean
	onClose: () => void
}

export const WorkspaceUpdatePopup = ({ onClose, open, success }: Props) => {
	const { resource } = useAppSelector(workspaceUpdateResumeSelector)

	return (
		<AlertDialog
			open={open}
			title="Resumen de actualización del Workspace"
			onClose={onClose}
		>
			<Typography variant="h6" mb={2} align="center">
				Operación {success ? 'exitosa' : 'fallida'}
			</Typography>
			<Box
				display={'flex'}
				alignItems={'center'}
				flexDirection={'column'}
				mb={2}
			>
				<Typography>
					Cantidad de preguntas creadas:{' '}
					{resource.listNewResponseNodes.length}
				</Typography>
				<Typography>
					Cantidad de preguntas actualizadas:{' '}
					{resource.listUpdatedResponseNodes.length}
				</Typography>
				<Typography>
					Cantidad de variaciones nuevas agregadas:{' '}
					{resource.listNewAnswersConfigElement.length}
				</Typography>
			</Box>
		</AlertDialog>
	)
}
