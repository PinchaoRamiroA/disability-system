import React from 'react'
import { AlertDialog } from '@/components/Dialog'

interface Props {
	open: boolean
	handleConfirm: () => void
	handleClose: () => void
}

export const WorkspaceDelete = ({
	handleClose,
	handleConfirm,
	open,
}: Props) => {
	return (
		<AlertDialog
			open={open}
			title="Eliminar respuesta"
			description="Esta acción es irreversible ¿Está seguro de eliminar la respuesta seleccionada?"
			confirmAction={handleConfirm}
			onClose={handleClose}
		></AlertDialog>
	)
}
