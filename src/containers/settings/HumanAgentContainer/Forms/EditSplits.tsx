import React, { useEffect, useState } from 'react'
import { AlertDialog } from '@/components/Dialog'
import { Autocomplete, TextField } from '@mui/material'
import {
	CreateSplitAsesorParams,
	DeleteSplitAsesorParams,
	SplitsAutocomplete,
} from '@/types/Splits'
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'
import {
	createAgentSplit,
	deleteAgentSplit,
	splitsAsesorSelector,
} from '@/store/slices/splits'
import { useCompanyAndIdVa } from '@/hooks/useCompanyAndIdVa'
import { useLoading } from '@/hooks/useLoading'
import { useSnackbar } from 'notistack'
import { updateSplitsSuccess } from '@/utils/constants/snackbars/settings/asesor-humano/asesores'

interface Props {
	open: boolean
	userName: string
	userId: number
	splits: SplitsAutocomplete[]
	handleClose: () => void
	handleConfirm: () => void
}

export const EditSplits = ({
	handleClose,
	open,
	userName,
	userId,
	splits,
}: Props) => {
	const dispatch = useAppDispatch()
	const { startLoading, stopLoading } = useLoading()
	const { resource, getStatus } = useAppSelector(splitsAsesorSelector)
	const { idOrg, idVa } = useCompanyAndIdVa()

	const [splitsAsesor, setSplitsAsesor] = useState<SplitsAutocomplete[]>([])
	const [loading, setLoading] = useState(false)

	const { enqueueSnackbar } = useSnackbar()

	const handleChange = (newValues: SplitsAutocomplete[]) => {
		setSplitsAsesor(newValues)
	}

	const handleConfirm = () => {
		setLoading(true)
		startLoading()

		const toDelete: DeleteSplitAsesorParams[] = []
		const toCreate: CreateSplitAsesorParams[] = []

		// Filtrar splits borrados
		resource.forEach((prevSplit) => {
			const encontrado = splitsAsesor.find(
				(el) => el.idSplit === prevSplit.idSplit
			)

			// Split borrado
			if (!encontrado) {
				toDelete.push({ idSplitUsuario: prevSplit.id })
			}
		})

		// Filtrar splits nuevos
		splitsAsesor.forEach((newSplit) => {
			const encontrado = resource.find(
				(el) => el.idSplit === newSplit.idSplit
			)

			// Split nuevo
			if (!encontrado && idOrg && idVa) {
				toCreate.push({
					idorg: idOrg,
					idSplit: newSplit.idSplit,
					idUsuario: userId,
					idva: idVa,
				})
			}
		})

		Promise.all([
			...toDelete.map((params) => dispatch(deleteAgentSplit(params))),
			...toCreate.map((params) => dispatch(createAgentSplit(params))),
		]).then(() => {
			const { message, options } = updateSplitsSuccess
			enqueueSnackbar(message, options)
			stopLoading()
			setLoading(false)
			handleClose()
		})
	}

	// Filtrar splits
	useEffect(() => {
		const newSplits: SplitsAutocomplete[] = []

		// Buscar splits del asesor en el array de splits
		resource.forEach((split) => {
			const foundSplit = splits.find((e) => e.idSplit === split.idSplit)

			// Agregar split (en el resource de splits del asesor vienen sin el campo nombre)
			if (foundSplit) {
				newSplits.push(foundSplit)
			}
		})

		setSplitsAsesor(newSplits)
	}, [resource])

	return (
		<AlertDialog
			open={open}
			title={`Actualizar splits ${userName}`}
			description="Selecciona uno o varios splits."
			confirmAction={() => {
				startLoading()
				handleConfirm()
			}}
			onClose={handleClose}
			submitting={loading}
		>
			<br />
			<Autocomplete
				loading={getStatus !== 'resolved'}
				options={splits}
				getOptionLabel={(option) => option.nombre ?? ''}
				multiple
				disableCloseOnSelect
				// limitTags={3}
				value={splitsAsesor}
				onChange={(_, value) => handleChange(value)}
				renderInput={(params) => (
					<TextField {...params} name="splits" label="Splits" />
				)}
				renderOption={(props, option) => (
					<li {...props} key={option.idSplit}>
						{option.nombre}
					</li>
				)}
			/>
		</AlertDialog>
	)
}
