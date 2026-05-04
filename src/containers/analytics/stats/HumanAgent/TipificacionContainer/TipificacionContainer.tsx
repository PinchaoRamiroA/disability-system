import React, { useEffect } from 'react'
import { CausalesNegocio } from './CausalesNegocio'
import { CausalesFin } from './CausalesFin'
import { GridContainer } from '@/components/GridContainer'
import { FilterContainer } from '@/containers/FilterContainer'
import { Indicator } from '@/components/Indicator'
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'
import { useLoading } from '@/hooks/useLoading'
import { useCompanyAndIdVa } from '@/hooks/useCompanyAndIdVa'
import { filterSelector } from '@/store/slices/Filter'
import {
	getEstadisticaCausalesFin,
	estadisticaCausalesFinSelector,
} from '@/store/slices/causales-fin'
import {
	getEstadisticaCausalesNegocio,
	estadisticaCausalesNegocioSelector,
} from '@/store/slices/causales-negocio'
import { CausalesStatsParams } from '@/types/Causales'
import {
	estadisticaPasoAutomaticoSelector,
	getEstadisticaPasoAutomatico,
} from '@/store/slices/causales-paso-automatico'
import { PasoAutomatico } from './PasoAutomatico'

export const TipificacionContainer = () => {
	const dispatch = useAppDispatch()
	const { stopLoading } = useLoading()
	const { idOrg } = useCompanyAndIdVa()
	const {
		channels,
		start,
		end,
		splits,
		causalesFin,
		causalesNegocio,
		causalesPasoAutomatico,
	} = useAppSelector(filterSelector)

	const { resource: pasoAutoResource, getStatus: statusPasoAuto } =
		useAppSelector(estadisticaPasoAutomaticoSelector)
	const { resource: negocioResource, getStatus: statusNegocio } =
		useAppSelector(estadisticaCausalesNegocioSelector)
	const { resource: finResource, getStatus: statusFin } = useAppSelector(
		estadisticaCausalesFinSelector
	)

	// Obtener causales para mostrar en la gráfica
	useEffect(() => {
		if (idOrg && start && end) {
			const params: CausalesStatsParams = {
				idOrg,
				payload: {
					end,
					start,
					channels,
					splits,
				},
			}

			// Causales de negocio
			params.payload.categories = causalesNegocio
			dispatch(getEstadisticaCausalesNegocio(params))
			// Causales finalización
			params.payload.categories = causalesFin
			dispatch(getEstadisticaCausalesFin(params))
			// Paso automático
			params.payload.categories = causalesPasoAutomatico
			dispatch(getEstadisticaPasoAutomatico(params))
		}
	}, [
		start,
		end,
		idOrg,
		channels,
		splits,
		causalesFin,
		causalesNegocio,
		causalesPasoAutomatico,
		dispatch,
	])

	useEffect(() => {
		stopLoading()
	}, [])

	return (
		<React.Fragment>
			<GridContainer justify="flex-start">
				<FilterContainer
					filters={{
						channels: true,
						splits: true,
						causalesFin: true,
						causalesNegocio: true,
						causalesPasoAutomatico: true,
					}}
				/>

				<Indicator
					title="Causales de la conversación"
					value={negocioResource.Total}
				/>
				<Indicator
					title="Causales de finalización"
					value={finResource.Total}
				/>
				<Indicator
					title="Causales de paso"
					value={pasoAutoResource.Total}
				/>

				<CausalesNegocio
					resource={negocioResource}
					status={statusNegocio}
				/>
				<CausalesFin resource={finResource} status={statusFin} />
				<PasoAutomatico
					resource={pasoAutoResource}
					status={statusPasoAuto}
				/>
			</GridContainer>
		</React.Fragment>
	)
}
