import { AlertDialog } from '@/components/Dialog'
import React from 'react'

interface Props {
	open: boolean
	handleConfirm: () => void
	handleClose: () => void
}

export const WorkspaceWarning = ({
	handleClose,
	handleConfirm,
	open,
}: Props) => {
	return (
		<AlertDialog
			open={open}
			title="URL no permitida"
			description="Este recurso no se encuentra en el dominio de su servidor de contenido, o su extensión no es del tipo indicado. ¿Desea continuar?"
			confirmAction={handleConfirm}
			onClose={handleClose}
		></AlertDialog>
	)
}
