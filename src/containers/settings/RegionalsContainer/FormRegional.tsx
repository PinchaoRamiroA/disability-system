import React, { useState } from 'react'
import { AlertDialog } from '@/components/Dialog'
import { Region } from '@/types/Locations'
import { TextField } from '@mui/material'

interface Props {
	open: boolean
	onClose: () => void
	onConfirm: (value: string) => void
	edit?: boolean
	regional?: Region
}

export const FormRegional = ({
	open,
	onClose,
	onConfirm,
	edit = true,
	regional = {
		id: -1,
		name: '',
	},
}: Props) => {
	const [newName, setNewName] = useState(regional.name)

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNewName(e.target.value)
	}

	const handleConfirm = () => {
		onConfirm(newName)
		setNewName('')
	}

	return (
		<AlertDialog
			open={open}
			title={
				edit ? `Actualizar regional ${regional.name}` : 'Crear regional'
			}
			description={
				edit
					? 'Actualice el nombre de la regional'
					: 'Cree una nueva regional'
			}
			actions={true}
			confirmAction={handleConfirm}
			onClose={onClose}
			submitting={
				regional.name === newName || newName.trim().length === 0
			}
			confirmButtonText={edit ? 'Actualizar' : 'Crear'}
		>
			<TextField
				label={edit ? 'Nuevo nombre' : 'Nombre regional'}
				value={newName}
				onChange={handleChange}
			/>
		</AlertDialog>
	)
}
