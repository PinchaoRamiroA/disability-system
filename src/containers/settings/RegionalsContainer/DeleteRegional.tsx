import React from 'react'
import { AlertDialog } from '@/components/Dialog'

interface Props {
	open: boolean
	regional: string
	onClose: () => void
	onConfirm: () => void
}

export const DeleteRegional = ({
	open,
	regional,
	onClose,
	onConfirm,
}: Props) => {
	return (
		<AlertDialog
			open={open}
			title={`Eliminar regional ${regional}`}
			description="Esta acción es irreversible ¿estás seguro de continuar?"
			confirmButtonText="Eliminar"
			confirmAction={onConfirm}
			onClose={onClose}
		/>
	)
}
