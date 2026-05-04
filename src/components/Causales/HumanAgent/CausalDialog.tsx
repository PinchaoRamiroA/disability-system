import React, { useEffect, useState } from 'react'
import { AlertDialog } from '@/components/Dialog'
import {
	Autocomplete,
	IconButton,
	TextField,
	Tooltip,
	Typography,
} from '@mui/material'
import { Causal, CausalConversacion } from '@/types/Causales'
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'
import { saveCausalesNegocio } from '@/store/slices/causales-negocio'
import { saveCausalesFin } from '@/store/slices/causales-fin'
import { useLoading } from '@/hooks/useLoading'
import { useChatContext } from '@/hooks/asesor-humano/useChatContext'
import { Info } from '@mui/icons-material'
import {
	addCausalConversacion,
	causalesConversacionSelector,
	removeCausalConversacion,
	updateCausalConversacion,
} from '@/store/slices/causales-conversacion'
import { causalsSetted, markAsTransfer } from '@/store/slices/humanAgent'
import { useCompanyAndIdVa } from '@/hooks/useCompanyAndIdVa'

interface Props {
	causalesFin: Causal[]
	causalesNegocio: Causal[]
	handleClose: () => void
	idConversacion: number
	mostrarCausalesFin: boolean
	mostrarCausalesNegocio: boolean
	open: boolean
	isTransfer: boolean
}

export const CausalDialog = ({
	causalesFin,
	causalesNegocio,
	handleClose,
	idConversacion,
	mostrarCausalesFin,
	mostrarCausalesNegocio,
	open,
	isTransfer,
}: Props) => {
	const dispatch = useAppDispatch()
	const { startLoading, stopLoading, isLoading } = useLoading()
	const { drawerWidth, transferConversation, currentChat } = useChatContext()
	const { idOrg } = useCompanyAndIdVa()

	// Causales de negocio seleccionadas en el formulario
	const [causalesSelected, setCausalesSelected] = useState<Causal[]>([])
	// Causal de finalización seleccionada en el formulario
	const [causalFinSelected, setCausalFinSelected] = useState<Causal | null>(
		null
	)
	// Casuales de la conversación seleccionadas
	const causalesConversacion = useAppSelector(causalesConversacionSelector)

	const [conversacionActual, setConversacionActual] = useState<
		CausalConversacion | undefined
	>()

	// Resetear formulario después de guardar las causales
	const handleCallback = () => {
		setCausalFinSelected(null)
		setCausalesSelected([])
		handleClose()

		if (isTransfer) {
			dispatch(
				markAsTransfer({
					conversationId: idConversacion,
					transfer: false,
				})
			)
		} else {
			dispatch(
				removeCausalConversacion({ conversationId: idConversacion })
			)
		}
		stopLoading()
	}

	// Manejar cambios en causales de negocio
	const handleCausalNegocioChange = (values: Causal[]) => {
		setCausalesSelected(values)
		dispatch(
			updateCausalConversacion({
				conversationId: idConversacion,
				business: values,
				ending: causalFinSelected,
			})
		)
	}

	// Manejar cambios en causales de finalización
	const handleCausalFinChange = (value: Causal | null) => {
		setCausalFinSelected(value)
		dispatch(
			updateCausalConversacion({
				conversationId: idConversacion,
				business: causalesSelected,
				ending: value,
			})
		)
	}

	// Guardar causales
	const handleConfirm = () => {
		// Se va a realizar una transferencia
		if (
			isTransfer &&
			conversacionActual?.transfer &&
			conversacionActual.splitId
		) {
			transferConversation(
				conversacionActual.splitId,
				conversacionActual.conversationId
			)
			handleCallback()

			return
		}

		// Guardar causal de finalización, luego validar si hay de negocio para guardar
		if (mostrarCausalesFin && causalFinSelected) {
			startLoading()
			dispatch(
				saveCausalesFin({
					idConversacion,
					idCausalFinalizacion: causalFinSelected.idCausal,
					logErrorPayload: {
						idadviser:
							currentChat?.conversacionAgenteHumano.idAsesor ?? 0,
						idOrg,
					},
				})
			).then(() => {
				// No hay causales de negocio, cerrar formulario
				if (!mostrarCausalesNegocio) {
					handleCallback()
					dispatch(causalsSetted({ conversationId: idConversacion }))
				}
			})
		}

		// Guardar causales de negocio
		if (mostrarCausalesNegocio && causalesSelected.length > 0) {
			startLoading()
			dispatch(
				saveCausalesNegocio({
					body: {
						idConversacion,
						listIdCausales: causalesSelected.map((e) => ({
							idCausal: e.idCausal,
						})),
					},
					callback: () => {
						handleCallback()
						dispatch(
							causalsSetted({ conversationId: idConversacion })
						)
					},
					logErrorPayload: {
						idOrg,
						idadviser:
							currentChat?.conversacionAgenteHumano.idAsesor ?? 0,
					},
				})
			).then(stopLoading)
		}
	}

	// Setea las causales seleccionadas en una conversación después de cambiar a las causales de otra conversación
	const setCausalesConversacion = (
		business: Causal[],
		ending: Causal | null
	) => {
		const tempNegocio: Causal[] = []
		causalesNegocio.forEach((causal) => {
			if (business.find((pivot) => pivot.idCausal === causal.idCausal)) {
				tempNegocio.push(causal)
			}
		})

		let tempFin: Causal | null = null
		causalesFin.forEach((causal) => {
			if (ending?.idCausal == causal.idCausal) {
				tempFin = causal
			}
		})
		setCausalesSelected(tempNegocio)
		setCausalFinSelected(tempFin)
	}

	// Validar si hay causales seleccionadas por conversación para reutilizarlas
	useEffect(() => {
		if (open) {
			let notFound = true
			causalesConversacion.forEach((item) => {
				if (item.conversationId === idConversacion) {
					notFound = false
					// Comparar causales seleccionadas en la conversación con las causales disponibles
					setCausalesConversacion(item.business, item.ending)
					if (
						!conversacionActual ||
						conversacionActual.conversationId !== idConversacion
					) {
						setConversacionActual(item)
					}
				}
			})

			// No se encontraron causales de la conversación en el reducer, agregarlas
			if (notFound) {
				setCausalesSelected([])
				setCausalFinSelected(null)
				dispatch(
					addCausalConversacion({ conversationId: idConversacion })
				)
			}
		}
	}, [idConversacion, causalesConversacion, open])

	useEffect(() => {
		if (open) {
			// Resetear state
			setConversacionActual(undefined)
		}
	}, [open])

	return (
		<AlertDialog
			open={open}
			title="Causales de la conversación"
			confirmAction={handleConfirm}
			confirmButtonText="Guardar"
			submitting={
				isLoading ||
				(mostrarCausalesNegocio && causalesSelected.length === 0) ||
				(mostrarCausalesFin && !causalFinSelected)
			}
			fullWidth
			backdropProps={{
				left: drawerWidth,
				top: 64,
			}}
			{...(isTransfer && {
				onClose: handleCallback,
				closeButtonText: 'Cancelar transferencia',
			})}
			cancelOut={!isTransfer}
		>
			{/* Causales de negocio */}
			{mostrarCausalesNegocio && causalesNegocio.length > 0 && (
				<>
					<Typography mb={1}>
						Causales de la conversación
						<Tooltip title="Razón por la cual el usuario solicitó asesoría">
							<IconButton
								aria-label="info"
								color="secondary"
								sx={{ mt: '-4px' }}
							>
								<Info />
							</IconButton>
						</Tooltip>
					</Typography>
					<Autocomplete
						options={causalesNegocio}
						fullWidth
						value={causalesSelected}
						multiple
						getOptionLabel={(option) => option.nombre ?? ''}
						onChange={(_, values) =>
							handleCausalNegocioChange(values)
						}
						renderOption={(props, option) => (
							<li {...props} key={option.idCausal}>
								{option.nombre}
							</li>
						)}
						renderInput={(params) => (
							<TextField
								{...params}
								name="causalesNegocio"
								label="Selecciona una o varias causales"
							/>
						)}
					/>
				</>
			)}

			{/* Causal de finalización */}
			{mostrarCausalesFin && causalesFin.length > 0 && (
				<>
					<Typography mb={1} mt={3}>
						Causal de finalización
						<Tooltip title="Por qué das cierre a la conversación con el usuario">
							<IconButton
								aria-label="info"
								color="secondary"
								sx={{ mt: '-4px' }}
							>
								<Info />
							</IconButton>
						</Tooltip>
					</Typography>
					<Autocomplete
						options={causalesFin}
						fullWidth
						value={causalFinSelected}
						getOptionLabel={(option) => option.nombre ?? ''}
						onChange={(_, value) => handleCausalFinChange(value)}
						renderOption={(props, option) => (
							<li {...props} key={option.idCausal}>
								{option.nombre}
							</li>
						)}
						renderInput={(params) => (
							<TextField
								{...params}
								name="causalesFin"
								label="Selecciona una causal"
							/>
						)}
					/>
				</>
			)}
		</AlertDialog>
	)
}
