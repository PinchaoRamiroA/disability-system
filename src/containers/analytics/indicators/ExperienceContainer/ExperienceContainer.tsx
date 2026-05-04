import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'
import { GridContainer } from '@/components/GridContainer'
import { FilterContainer } from '@/containers/FilterContainer'
import { Indicator } from '@/components/Indicator'
import {
	experienceIndicatorSelector,
	getNPS,
	getNS,
	getRU,
} from '@/store/slices/indicators/experience'
import { filterSelector } from '@/store/slices/Filter'
import { useCompanyAndIdVa } from '@/hooks/useCompanyAndIdVa'
import { ExpIndicatorObject, ExperienceFilters } from '@/types/Indicators'
import { Grid } from '@mui/material'
import { useLoading } from '@/hooks/useLoading'

const indicatorObject: ExpIndicatorObject[] = [
	{
		description: 'Porcentaje de usuarios satisfechos',
		id: 'NS',
		title: 'Nivel de satisfacción',
		tooltip:
			'Porcentaje de satisfacción relacionado con las conversaciones calificadas por los usuarios.',
	},
	{
		description: 'Número de usuarios recurrentes',
		id: 'RU',
		title: 'Usuarios recurrentes',
		tooltip:
			'Cantidad de usuarios que han entrado al bot de manera recurrente en el periodo de tiempo evaluado.',
	},
	{
		description: 'Net Promoter Score',
		id: 'NPS',
		title: 'NPS',
		tooltip:
			'Calificación que le dan los usuarios al servicio recibido. Se mide en una escala de -100 a 100.',
	},
]

export const ExperienceContainer = () => {
	const dispatch = useAppDispatch()
	const { resource } = useAppSelector(experienceIndicatorSelector)
	const { start, end } = useAppSelector(filterSelector)
	const { idOrg, idVa } = useCompanyAndIdVa()
	const { stopLoading } = useLoading()

	useEffect(() => {
		if (idOrg && idVa && start && end) {
			const params: ExperienceFilters = {
				idOrg,
				payload: {
					end,
					start,
					idVa,
				},
			}
			dispatch(getNS(params))
			dispatch(getRU(params))
			dispatch(getNPS(params))
		}
	}, [dispatch, idOrg, idVa, start, end])

	useEffect(() => {
		stopLoading()
	}, [])

	return (
		<GridContainer>
			<FilterContainer filters={{ virtualAgent: true }} />

			<Grid item xs={12} container justifyContent="space-evenly" gap={1}>
				{resource.map((indicator) => {
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
	)
}
