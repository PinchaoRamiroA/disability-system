import React, { useEffect, useState } from 'react'
import { ConfirmationModal } from '@/components/Dialog'
import { Autocomplete, Box, TextField } from '@mui/material'
import { Splits } from '@/types/Splits'
import { useChatContext } from '@/hooks/asesor-humano/useChatContext'
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'
import { addCausalConversacion } from '@/store/slices/causales-conversacion'
import { markAsTransfer } from '@/store/slices/humanAgent'
import { useLoading } from '@/hooks/useLoading'
import { getAvailableTransferSplits } from '@/store/slices/web-chat-human-agent'
import { splitsSelector } from '@/store/slices/splits'

interface Props {
	open: boolean
	handleClose: () => void
}

export const TransferModal = ({ open, handleClose }: Props) => {
	const dispatch = useAppDispatch()
	const { resource } = useAppSelector(splitsSelector)
	const { agentSplits, currentChat, drawerWidth } = useChatContext()
	const { startLoading, stopLoading } = useLoading()

	// Splits de transferencia
	const [transferSplits, setTransferSplits] = useState<Splits[]>([])
	const [splitSelected, setSplitSelected] = useState<Splits | null>(null)

	// Cargar splits
	useEffect(() => {
		if (open) {
			setSplitSelected(null)
			startLoading()
			dispatch(getAvailableTransferSplits()).then(stopLoading)
		}
	}, [open])

	// Filtrar splits (no mostrar splits del asesor conectado)
	useEffect(() => {
		setTransferSplits(
			resource.filter((split) => {
				return !agentSplits
					.map((agntSplit) => agntSplit.idSplit)
					.includes(split.idSplit)
			})
		)
	}, [resource])

	// Confirmar transferencia de split
	const handleConfirm = () => {
		if (splitSelected && currentChat) {
			const { conversationId } = currentChat
			dispatch(markAsTransfer({ conversationId, transfer: true }))

			// Encolar causales de la conversación con id del split seleccionado
			dispatch(
				addCausalConversacion({
					conversationId,
					transfer: true,
					splitId: splitSelected.idSplit,
				})
			)

			handleClose()
		}
	}

	return (
		<ConfirmationModal
			open={open}
			handleClose={handleClose}
			title="Transferir chat del cliente"
			confirmAction={handleConfirm}
			confirmButtonText="Transferir"
			disableButton={!splitSelected}
			backdropProps={{
				left: drawerWidth,
				top: 64,
			}}
		>
			<Box m={2}>
				<Autocomplete
					options={transferSplits}
					value={splitSelected}
					size="small"
					fullWidth
					onChange={(_, newValue) => setSplitSelected(newValue)}
					renderInput={(params) => (
						<TextField
							{...params}
							name="splits"
							label="Selecciona el split"
						/>
					)}
					getOptionLabel={(option) => option.nombre}
					ListboxProps={{
						style: { backgroundColor: '#f9f9f9' },
					}}
				/>
			</Box>
		</ConfirmationModal>
	)
}
