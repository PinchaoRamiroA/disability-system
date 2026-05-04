import React, { useEffect, useState } from 'react'
import { GridContainer } from '@/components/GridContainer'
import { FilterContainer } from '@/containers/FilterContainer'
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'
import { filterSelector } from '@/store/slices/Filter'
import {
	emptyConversation,
	getHistory,
	getInteractionHistory,
	historySelector,
} from '@/store/slices/reports/humanAgent/history'
import { useCompanyAndIdVa } from '@/hooks/useCompanyAndIdVa'
import { useLoading } from '@/hooks/useLoading'
import { locationsFilters } from '@/utils/helpers/locationsFilters'
import { ConversationsContainer } from '@/containers/ConversationsContainer'
import { useHistoryRouteConversation } from '@/hooks/estadisticas/useHistoryRouteConversation'
import { HistoryViewer } from '@/components/History/HistoryViewer'
import { CONTAINER_HEIGHT_CALC } from '@/utils/constants/containerHeight'

export const HistoryContainer = ({
	params,
}: {
	params?: string | string[]
}) => {
	const dispatch = useAppDispatch()
	const { resource, getStatus } = useAppSelector(historySelector)
	const { idOrg, idVa } = useCompanyAndIdVa()
	const { idConv, idInteraction, resetParams } =
		useHistoryRouteConversation(params)
	const [avoidServiceCall, setAvoidServiceCall] = useState(Boolean(params))
	const interactionsHeight = `${CONTAINER_HEIGHT_CALC} - 3px`

	const {
		start,
		end,
		channels,
		id,
		idType,
		intents,
		regionals,
		departments,
		idsConv,
	} = useAppSelector(filterSelector)

	const { setStatus } = useLoading()

	const {
		currentPage,
		currentResults,
		interactions,
		totalResult,
		totalPages,
	} = resource

	// Servicio que trae interacciones
	const callHistoryService = (page?: number) => {
		if (start && end && idVa && idOrg) {
			// Evitar llamado al servicio si hay información en la URL
			if (avoidServiceCall && idConv) {
				dispatch(
					getInteractionHistory({
						idOrg,
						conversationId: Number(idConv),
					})
				).then(() => {
					setAvoidServiceCall(false)
				})
				return
			}
			if (idConv) {
				resetParams()
			}

			const { idDepartments, idRegionals } = locationsFilters(
				regionals,
				departments
			)

			Promise.all([
				dispatch(emptyConversation()),
				dispatch(
					getHistory({
						idOrg,
						filters: {
							end,
							idVa,
							start,
							channels,
							id,
							idType,
							intents,
							idRegionals,
							idDepartments,
							idConv: idsConv,
							...(page && {
								page,
							}),
						},
					})
				),
			])
		}
	}

	// Paginación
	const handleChangePage = (page: number) => {
		callHistoryService(page)
	}

	// Llamar servicio cuando se apliquen los filtros o se cambie la paginación
	useEffect(() => {
		callHistoryService()
	}, [
		start,
		end,
		channels?.toString(),
		id,
		idType,
		idVa,
		idOrg,
		idConv,
		idsConv?.toString(),
		intents?.toString(),
		regionals?.toString(),
		departments?.toString(),
	])

	useEffect(() => {
		setStatus(getStatus)
	}, [getStatus])

	return (
		<GridContainer>
			<FilterContainer
				filters={{
					dates: true,
					channels: true,
					user: true,
					intents: true,
					virtualAgent: true,
					locations: true,
					idsConv: true,
				}}
			/>

			{/* Historial de la conversación cuando se pasa el id por URL */}
			{idConv && (
				<HistoryViewer
					height={interactionsHeight}
					integrationsHistory
					idInteraction={idInteraction}
				/>
			)}

			{/* Listado de conversaciones cuando se accede a través del menú Reportes > Asesor virtual > Accesos... */}
			{!idConv && (
				<ConversationsContainer
					currentPage={currentPage}
					currentResults={currentResults}
					interactions={interactions}
					attentionInteractions={[]}
					handlePageChange={handleChangePage}
					totalPages={totalPages}
					totalResult={totalResult}
				/>
			)}
		</GridContainer>
	)
}
