import React from 'react'
import { AlertDialog } from '@/components/Dialog'

interface Props {
	open: boolean
	onClose: () => void
	onConfirm: () => void
}

export const WorkspaceUpdate = ({ onClose, onConfirm, open }: Props) => {
	return (
		<AlertDialog
			open={open}
			title="Actualizar Workspace"
			onClose={onClose}
			confirmAction={onConfirm}
			description="Esta acción puede tardar varios minutos y es irreversible."
			confirmButtonText="Continuar"
		/>
	)
}
