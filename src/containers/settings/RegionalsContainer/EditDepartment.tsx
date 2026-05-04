import React, { useState } from 'react'
import { AlertDialog } from '@/components/Dialog'
import { Department, Region } from '@/types/Locations'
import { Autocomplete, TextField } from '@mui/material'
import { useRegionalContext } from './Context'

interface Props {
	open: boolean
	department: Department
	onClose: () => void
	onConfirm: (regional: Region | null) => void
}

export const EditDepartment = ({
	open,
	department,
	onClose,
	onConfirm,
}: Props) => {
	const { regionales } = useRegionalContext()

	const [selectedRegional, setSelectedRegional] = useState<Region | null>(
		null
	)

	const handleChange = (value: Region | null) => {
		setSelectedRegional(value)
	}

	return (
		<AlertDialog
			open={open}
			title={`Actualizar regional ${department.name}`}
			description="Selecciona la regional a la que desea mover el departamento"
			confirmAction={() => onConfirm(selectedRegional)}
			confirmButtonText="Actualizar"
			onClose={onClose}
			submitting={!Boolean(selectedRegional)}
		>
			<Autocomplete
				options={regionales.filter(
					(reg) => reg.id !== department.idRegional
				)}
				value={selectedRegional}
				onChange={(_, value) => handleChange(value)}
				renderInput={(params) => (
					<TextField
						{...params}
						name="regionales"
						label="Regionales"
					/>
				)}
			/>
		</AlertDialog>
	)
}
