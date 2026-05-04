import React, { useEffect, useState } from 'react'
import { ConfirmationModal } from '@/components/Dialog'
import { ModalType } from '@/types/Modal'
import { Autocomplete, Box, TextField } from '@mui/material'
import { PauseEvent } from '@/types/PauseEvents'
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'
import { getPauseEvents, pauseEventsSelector } from '@/store/slices/pauseEvents'
import { useLoading } from '@/hooks/useLoading'

interface Props extends ModalType {
	confirmAction: (idPauseEvent: number) => void
}

export const PauseEventsModal = ({
	open,
	handleClose,
	confirmAction,
}: Props) => {
	const dispatch = useAppDispatch()
	const { resource } = useAppSelector(pauseEventsSelector)
	const { startLoading, stopLoading } = useLoading()

	const [eventSelected, setEventSelected] = useState<PauseEvent | null>(null)

	// Cargar eventos de pausa
	useEffect(() => {
		if (open) {
			startLoading()
			setEventSelected(null)
			dispatch(getPauseEvents()).then(stopLoading)
		}
	}, [open])

	const handleConfirm = () => {
		if (eventSelected) {
			confirmAction(eventSelected.id)
		}
	}

	return (
		<ConfirmationModal
			open={open}
			handleClose={handleClose}
			confirmAction={handleConfirm}
			title="Selecciona el motivo de pausa"
			confirmButtonText="Seleccionar"
			disableButton={!eventSelected}
		>
			<Box m={2}>
				<Autocomplete
					options={resource}
					value={eventSelected}
					size="small"
					fullWidth
					onChange={(_, newValue) => setEventSelected(newValue)}
					isOptionEqualToValue={(option, value) =>
						option.id === value.id
					}
					renderInput={(params) => (
						<TextField
							{...params}
							name="splits"
							label="Selecciona el evento de pausa"
						/>
					)}
					getOptionLabel={(option) => option.name}
					ListboxProps={{
						style: { backgroundColor: '#f9f9f9' },
					}}
				/>
			</Box>
		</ConfirmationModal>
	)
}
