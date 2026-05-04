import React, { useState } from 'react'
import { AlertDialog } from '@/components/Dialog'
import { ItemType, WorkspaceAnswerDetail } from '@/types/Workspaces'
import { Autocomplete, TextField } from '@mui/material'
import { itemTypes } from '@/utils/constants/snackbars/settings/workspaces'
import { validateType } from './validate'
import { WorkspaceWarning } from './WorkspaceWarning'
import { FormDialog } from '@/components/Dialog/styles'

interface Props {
	open: boolean
	detail: WorkspaceAnswerDetail
	handleConfirm: (itemType: number, answer: string) => void
	handleClose: () => void
}

export const WorkspaceEdit = ({
	open,
	detail,
	handleConfirm,
	handleClose,
}: Props) => {
	const [itemTypeValue, setItemTypeValue] = useState<ItemType | null>(
		itemTypes.filter((e) => e.value === detail.elementTypesIdType)[0]
	)
	const [answerValue, setAnswerValue] = useState<string>(detail.elementValue)
	const [submitting, setSubmitting] = useState(false)
	const [openWarning, setOpenWarning] = useState(false)

	const handleSubmit = () => {
		const answer = answerValue.trim()
		if (itemTypeValue && answer.length > 0) {
			if (validateType(itemTypeValue.value, answer)) {
				setOpenWarning(true)
			} else {
				handleSubmitConfirm()
			}
		}
	}

	const handleSubmitConfirm = () => {
		if (itemTypeValue) {
			setOpenWarning(false)
			setSubmitting(true)
			handleConfirm(itemTypeValue.value, answerValue)
		}
	}

	return (
		<AlertDialog
			open={open}
			title="Actualizar respuesta"
			confirmAction={handleSubmit}
			onClose={handleClose}
			submitting={submitting}
		>
			<FormDialog>
				<Autocomplete
					options={itemTypes}
					value={itemTypeValue}
					onChange={(_, value) => setItemTypeValue(value)}
					renderInput={(props) => (
						<TextField {...props} placeholder="Tipo" size="small" />
					)}
				/>
				<TextField
					fullWidth
					size="small"
					placeholder={
						itemTypeValue?.value === 1
							? 'Escribe tu respuesta'
							: 'Ingresa la URL'
					}
					value={answerValue}
					onChange={(e) => setAnswerValue(e.target.value)}
					multiline
				/>
			</FormDialog>

			<WorkspaceWarning
				handleClose={() => setOpenWarning(false)}
				handleConfirm={handleSubmitConfirm}
				open={openWarning}
			/>
		</AlertDialog>
	)
}
