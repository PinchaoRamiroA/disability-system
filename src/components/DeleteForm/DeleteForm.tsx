import React from 'react'
import { AlertDialog } from '@/components/Dialog'
import { Box } from '@mui/material'

interface Props {
	open: boolean
	keyword: string
	propertyToDelete: string
	handleClose: () => void
	handleConfirm: () => void
	femme?: boolean
}

export const DeleteForm = ({
	handleClose,
	handleConfirm,
	open,
	propertyToDelete,
	keyword,
	femme = false,
}: Props) => {
	return (
		<AlertDialog
			open={open}
			title={`Eliminar ${keyword}`}
			confirmAction={handleConfirm}
			onClose={handleClose}
		>
			<Box textAlign="center">
				¿Estás seguro de eliminar {femme ? 'la' : 'el'}{' '}
				{keyword.toLowerCase()} <strong>{propertyToDelete}</strong>?
				<br />
				Esta acción es irreversible.
			</Box>
		</AlertDialog>
	)
}
