import React, { useEffect } from 'react'
import { GridContainer } from '@/components/GridContainer'
import { FilterContainer } from '@/containers/FilterContainer'
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'
import {
	agentChatHistorySelector,
	emptyConversation,
	getAgentChats,
} from '@/store/slices/reports/humanAgent/history'
import { useLoading } from '@/hooks/useLoading'
import { filterSelector } from '@/store/slices/Filter'
import { useCompanyAndIdVa } from '@/hooks/useCompanyAndIdVa'
import { locationsFilters } from '@/utils/helpers/locationsFilters'
import { ConversationsContainer } from '@/containers/ConversationsContainer'
import { filterTempSelector } from '@/store/slices/Filter/temp_slice'

export const AgentChatsContainer = () => {
	const dispatch = useAppDispatch()
	const { resource, getStatus } = useAppSelector(agentChatHistorySelector)

	const { setStatus } = useLoading()

	const { idOrg } = useCompanyAndIdVa()
	const {
		start,
		end,
		channels,
		regionals,
		departments,
		agents,
		events,
		splits,
		attention,
	} = useAppSelector(filterSelector)
	const { attention: tempAttention } = useAppSelector(filterTempSelector)

	const {
		currentPage,
		currentResults,
		interactions,
		totalPages,
		totalResult,
	} = resource

	// Detectar cambios en paginación para llamar el servicio
	const handleChangePage = (page: number) => {
		callService(page)
	}

	const callService = (page?: number) => {
		const { idDepartments, idRegionals } = locationsFilters(
			regionals,
			departments
		)

		if (start && end && idOrg) {
			dispatch(emptyConversation())
			dispatch(
				getAgentChats({
					idOrg,
					filters: {
						agents,
						channels,
						end,
						events,
						splits,
						start,
						idDepartments,
						idRegionals,
						attended: attention === 'attended',
						...(page && {
							page,
						}),
					},
				})
			)
		}
	}

	useEffect(() => setStatus(getStatus), [getStatus])

	// Detectar cambios en filtros para llamar el servicio
	useEffect(() => {
		if (start && end && idOrg && attention) {
			callService()
		}
	}, [
		start,
		end,
		idOrg,
		channels?.toString(),
		agents?.toString(),
		attention?.toString(),
		events?.toString(),
		splits?.toString(),
		regionals?.toString(),
		departments?.toString(),
	])

	return (
		<GridContainer>
			<FilterContainer
				filters={{
					dates: true,
					events: tempAttention === 'notAttended',
					channels: true,
					splits: true,
					locations: true,
					attention: true,
					agents: true,
				}}
			/>

			<ConversationsContainer
				currentPage={currentPage}
				currentResults={currentResults}
				interactions={[]}
				attentionInteractions={interactions}
				handlePageChange={handleChangePage}
				totalPages={totalPages}
				totalResult={totalResult}
				attention={attention}
			/>
		</GridContainer>
	)
}
