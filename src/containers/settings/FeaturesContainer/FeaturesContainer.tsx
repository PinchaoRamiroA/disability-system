import React, { useEffect, useState } from 'react'
import { GridContainer } from '@/components/GridContainer'
import { AdminFilters } from '@/components/Filter/AdminFilters'
import { Table } from '@/components/Table'
import { RowSwitchAction, TableHeader } from '@/types/Table'
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'
import {
	featuresSelector,
	getFeaturesConfig,
	updateFeatureConfig,
} from '@/store/slices/settings/personalizacion'
import { useCompanyAndIdVa } from '@/hooks/useCompanyAndIdVa'
import { Grid } from '@mui/material'
import { ConfigFeature } from '@/types/Settings/personalizacion/funcionalidades'
import { useLoading } from '@/hooks/useLoading'

const headers: TableHeader[] = [
	{
		label: 'Activo',
		propertyName: 'status',
		type: 'switch',
	},
	{
		label: 'Funcionalidad',
		propertyName: 'name',
	},
	{
		label: 'Descripción',
		propertyName: 'description',
	},
]

interface FormattedResource extends ConfigFeature {
	[key: string]: number | string | boolean
	id: number
}

export const FeaturesContainer = () => {
	const dispatch = useAppDispatch()
	const { getStatus, resource } = useAppSelector(featuresSelector)
	const { idOrg, idVa } = useCompanyAndIdVa()
	const { startLoading, stopLoading } = useLoading()
	const [tooltipRow, setTooltipRow] = useState<
		{ rowId: number; text: string } | undefined
	>()
	const [formattedResource, setFormattedResource] = useState<
		FormattedResource[]
	>([])

	/**
	 * Activar/Desactivar funcionalidad
	 */
	const handleToggleActive = (param: ConfigFeature) => {
		startLoading()
		const { description, idFeature, name, status } = param

		dispatch(
			updateFeatureConfig({
				idOrg,
				idVa,
				payload: {
					description,
					idFeature,
					name,
					status: !status,
				},
			})
		).then(stopLoading)
	}

	// Switch de la tabla
	const switchAction: RowSwitchAction<ConfigFeature> = handleToggleActive

	// Obtener configuración actual de funcionalidades
	useEffect(() => {
		if (idOrg && idVa) {
			startLoading()
			dispatch(getFeaturesConfig({ idOrg, idVa })).then(stopLoading)
		}
	}, [idOrg, idVa])

	// Buscar fila que debe mostrar el tooltip
	useEffect(() => {
		setFormattedResource(
			resource.map((item, id) => {
				// Id 2 es la funcionalidad Expiración de sesiones
				if (item.idFeature === 2) {
					setTooltipRow({
						rowId: id,
						text: 'Cuando se deshabilita, la encuesta NPS deja de ser visible para el canal WhatsApp',
					})
				}
				return {
					...item,
					id,
				}
			})
		)
	}, [resource])

	return (
		<GridContainer>
			{/* Filtro de organización y/o agente virtual*/}
			<AdminFilters />

			{/* Tabla con las funcionalidades */}
			<Grid item xs={12}>
				<Table
					data={formattedResource}
					headers={headers}
					status={getStatus}
					activeColumn="status"
					switchAction={switchAction}
					tooltip={tooltipRow}
				/>
			</Grid>
		</GridContainer>
	)
}
