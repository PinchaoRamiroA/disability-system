import React, { useEffect } from 'react'
import { GridContainer } from '@/components/GridContainer'
import { Indicator } from '@/components/Indicator'
import { FilterContainer } from '@/containers/FilterContainer'
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'
import {
	getAttendedChats,
	getFCR,
	getFaltaRespuestaBot,
	getNivelAbandono,
	getNotAttendedChats,
	getTMAsignacion,
	getTMAtencionAH,
	getTMAtencionAV,
	getTMO,
} from '@/store/slices/indicators/attention/actions'
import {
	AttentionFilters,
	IndicatorObject,
	TMOFilters,
} from '@/types/Indicators'
import { useCompanyAndIdVa } from '@/hooks/useCompanyAndIdVa'
import { filterSelector } from '@/store/slices/Filter'
import { attentionIndicatorSelector } from '@/store/slices/indicators/attention'
import { Grid } from '@mui/material'
import { useLoading } from '@/hooks/useLoading'

const indicatorObject: IndicatorObject[] = [
	{
		id: 'FCR',
		title: 'FCR',
		description: 'Resolución en primer contacto',
		tooltip:
			'Porcentaje de conversaciones que fueron atendidas en primer contacto, sin haber sido escaladas a asesor humano.',
	},
	{
		id: 'TMAsignacion',
		title: 'TM Asignación',
		description: 'Tiempo medio de asignación del asesor humano',
		tooltip:
			'Tiempo que tarda en promedio un usuario en ser asignado a un asesor humano.',
	},
	{
		id: 'TMAtencionAH',
		title: 'TM Atención AH',
		description: 'Tiempo medio de atención del asesor humano',
		tooltip:
			'Tiempo promedio en el que los asesores humanos atienden a los usuarios. Este incluye el tiempo desde que el usuario se conecta con el asesor humano hasta que este finaliza la conversación.',
	},
	{
		id: 'TMAtencionAV',
		title: 'TM Atención AV',
		description: 'Tiempo medio de atención del asesor virtual',
		tooltip:
			'Tiempo promedio en el que el bot atiende a los usuarios. Solo se tiene en cuenta la conversación usuario-bot e incluye el tiempo desde que el usuario inicia la conversación con el bot hasta que el usuario la finaliza o pasa a asesor.',
	},
	{
		id: 'TMO',
		title: 'TMO General',
		description: 'Tiempo medio de atención general',
		tooltip:
			'Tiempo promedio en el que se han atendido a los usuarios, este incluye el tiempo desde que el usuario se conecta hasta que finaliza la conversación. (Tiene en cuenta las conversaciones con el bot y las escaladas a asesor humano).',
	},
	{
		description: 'Chats atendidos por asesor humano',
		id: 'AttendedChats',
		title: 'Chats atendidos',
		tooltip: 'Porcentaje de conversaciones atendidas por el asesor humano.',
	},
	{
		description: 'Chats no atendidos por asesor humano',
		id: 'NotAttendedChats',
		title: 'Chats no atendidos',
		tooltip:
			'Porcentaje de conversaciones no atendidas por el asesor humano.',
	},
	{
		id: 'NivelRespuestaBOT',
		title: 'Nivel de falta de respuesta del BOT',
		tooltip:
			'Este es el porcentaje de conversaciones que han tenido falta de respuesta del bot por malentendido, falta de contenido o falla del servicio.',
	},
	{
		description: 'Nivel abandono de usuarios',
		id: 'NivelAbandono',
		title: 'Nivel de abandono',
		tooltip:
			'Este es el porcentaje de conversaciones que fueron abandonadas por el usuario, es decir que no llegaron a interacción final con el bot (no fueron calificadas o culminaron un flujo). ',
	},
]

export const AttentionContainer = () => {
	const dispatch = useAppDispatch()
	const { start, end, channels, splits } = useAppSelector(filterSelector)
	const { idOrg, idVa } = useCompanyAndIdVa()
	const { resource: indicators } = useAppSelector(attentionIndicatorSelector)
	const { stopLoading } = useLoading()

	// Indicadores con filtros idOrg, idVa, fechas y canales
	useEffect(() => {
		if (idOrg && idVa && start && end) {
			const params: TMOFilters = {
				idOrg,
				payload: {
					idVa,
					end,
					start,
					channels,
				},
			}

			dispatch(getFCR(params))
			dispatch(getTMAtencionAV(params))
			dispatch(getNivelAbandono(params))
		}
	}, [idOrg, idVa, start, end, channels, dispatch])

	// Indicadores con filtros idOrg, idVa, fechas, canales y splits
	useEffect(() => {
		if (idOrg && idVa && start && end) {
			const params: TMOFilters = {
				idOrg,
				payload: {
					idVa,
					end,
					start,
					channels,
					splits,
				},
			}

			dispatch(getTMAsignacion(params))
			dispatch(getTMAtencionAH(params))
			dispatch(getTMO(params))
		}
	}, [start, end, channels, splits, idOrg, idVa, dispatch])

	// Indicadores con filtros idOrg, fechas, canales y splits
	useEffect(() => {
		if (idOrg && start && end) {
			const params: AttentionFilters = {
				idOrg,
				payload: {
					channels,
					end,
					splits,
					start,
				},
			}
			dispatch(getAttendedChats(params))
			dispatch(getNotAttendedChats(params))
		}
	}, [idOrg, start, end, channels, splits, dispatch])

	// Indicadores con filtros idOrg, idVa y fechas
	useEffect(() => {
		if (idOrg && idVa && end && start) {
			dispatch(
				getFaltaRespuestaBot({
					idOrg,
					payload: {
						idVa,
						end,
						start,
					},
				})
			)
		}
	}, [idOrg, idVa, end, start, dispatch])

	useEffect(() => {
		stopLoading()
	}, [])

	return (
		<React.Fragment>
			<GridContainer spacing={2}>
				<FilterContainer
					filters={{
						splits: true,
						channels: true,
						virtualAgent: true,
					}}
				/>

				<Grid
					item
					xs={12}
					container
					justifyContent="space-evenly"
					gap={1}
				>
					{indicators.map((indicator) => {
						const labels = indicatorObject.find(
							(e) => e.id === indicator.resource.id
						)

						if (labels) {
							return (
								<Indicator
									key={indicator.resource.id}
									title={labels.title}
									value={indicator.resource.value}
									subtitle={labels.description}
									height={200}
									loading={
										indicator.getStatus === 'pending' ||
										indicator.getStatus === 'rejected'
									}
									tooltip={labels.tooltip}
								/>
							)
						}
						return null
					})}
				</Grid>
			</GridContainer>
		</React.Fragment>
	)
}
