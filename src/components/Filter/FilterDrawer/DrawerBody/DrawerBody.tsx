import React from 'react'
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt'
import { ApplyButton, DrawerForm } from './styles'
import { Box, List } from '@mui/material'

import { CompanyFilter } from '../FilterItem/CompanyFilter'
import { DateRangeFilter } from '../FilterItem/DateRangeFilter'
import { ChannelFilter } from '../FilterItem/ChannelFilter'
import { ResolutionFilter } from '../FilterItem/ResolutionFilter'
import { AttentionFilter } from '../FilterItem/AttentionFilter'
import { UserIdFilter } from '../FilterItem/UserIdFilter'
import { EntriesFilter } from '../FilterItem/EntriesFilter'
import { LocationsFilter } from '../FilterItem/LocationsFilter'
import { IntentsFilter } from '../FilterItem/IntentsFilter'
import { VirtualAgentFilter } from '../FilterItem/VirtualAgentFilter'
import { SingleSplitFilter, SplitsFilter } from '../FilterItem/SplitsFilter'
import { EventsFilter } from '../FilterItem/EventsFilter'

import { ApplyFilters, FilterName } from '@/types/Filter/Filter'
import { useAppSelector } from '@/hooks/useReduxHooks'
import { userSelector } from '@/store/slices/authentication'

import {
	ADMIN_ROLE,
	SUPERADMIN_ROLE,
	SUPERVIEWER_ROLE,
	VIEWER_ROLE,
} from '@/utils/constants/roles'
import { AgentsFilter } from '../FilterItem/AgentsFilter'
import { NotificationTypesFilter } from '../NotificationTypesFilter'
import { RangeFilter } from '../FilterItem/RangeFilter'
import { ConversationIdFilter } from '../FilterItem/ConversationIdFilter'
import { IntegrationStatusFilter } from '../FilterItem/IntegrationStatusFilter'
import { useFilterContext } from '@/hooks/contexts/useFilterContext'
import { CausalesFilter } from '../FilterItem/CausalesFilter'
import { IntegrationServiceFilter } from '../FilterItem/IntegrationServiceFilter'
import { ConversationIdsFilter } from '../FilterItem/ConversationIdsFilter'

interface Props {
	filters: ApplyFilters
	handleFilter: (event: React.FormEvent<HTMLFormElement>) => void
}

export const DrawerBody = ({ filters, handleFilter }: Props) => {
	const {
		dates,
		agents,
		channels,
		resolution,
		attention,
		notificationChannels,
		user,
		entries,
		range,
		virtualAgent,
		locations,
		regionals,
		locationsCities,
		intents,
		splits,
		singleSplit,
		events,
		idConv,
		idsConv,
		integrationStatus,
		integrationService,
		causalesNegocio,
		causalesFin,
		causalesPasoAutomatico,
	} = filters

	const { role } = useAppSelector(userSelector)
	const { clickedFilter } = useFilterContext()

	const checkClickFilter = (name: FilterName) => {
		return clickedFilter === name
	}

	return (
		<DrawerForm onSubmit={handleFilter}>
			<List component="nav" aria-label="Lista de filtros">
				{dates && (
					<DateRangeFilter clicked={checkClickFilter('dates')} />
				)}

				{channels && <ChannelFilter />}

				{notificationChannels && (
					<NotificationTypesFilter
						clicked={checkClickFilter('notificationChannels')}
					/>
				)}

				{resolution && (
					<ResolutionFilter
						clicked={checkClickFilter('resolution')}
					/>
				)}

				{attention && (
					<AttentionFilter clicked={checkClickFilter('attention')} />
				)}

				{user && <UserIdFilter clicked={checkClickFilter('user')} />}

				{idConv && (
					<ConversationIdFilter
						clicked={checkClickFilter('idConv')}
					/>
				)}

				{idsConv && (
					<ConversationIdsFilter
						clicked={checkClickFilter('idsConv')}
					/>
				)}

				{integrationStatus && (
					<IntegrationStatusFilter
						clicked={checkClickFilter('integrationStatus')}
					/>
				)}

				{integrationService && (
					<IntegrationServiceFilter
						clicked={checkClickFilter('integrationService')}
					/>
				)}

				{entries && (
					<EntriesFilter clicked={checkClickFilter('entries')} />
				)}

				{range && <RangeFilter clicked={checkClickFilter('range')} />}

				{(locations || regionals) && (
					<LocationsFilter
						clicked={checkClickFilter('locations')}
						requireCities={locationsCities ?? false}
						requireDepartments={!regionals}
					/>
				)}

				{intents && (
					<IntentsFilter clicked={checkClickFilter('intents')} />
				)}

				{splits && (
					<SplitsFilter clicked={clickedFilter === 'splits'} />
				)}

				{singleSplit && (
					<SingleSplitFilter clicked={checkClickFilter('splits')} />
				)}

				{events && (
					<EventsFilter clicked={checkClickFilter('events')} />
				)}

				{agents && (
					<AgentsFilter clicked={checkClickFilter('agents')} />
				)}

				{causalesNegocio && (
					<CausalesFilter
						clicked={checkClickFilter('causalesNegocio')}
						type="negocio"
					/>
				)}

				{causalesFin && (
					<CausalesFilter
						clicked={checkClickFilter('causalesFin')}
						type="finalizacion"
					/>
				)}

				{causalesPasoAutomatico && (
					<CausalesFilter
						clicked={checkClickFilter('causalesPasoAutomatico')}
						type="paso-automatico"
					/>
				)}

				{(role === SUPERADMIN_ROLE || role === SUPERVIEWER_ROLE) && (
					<CompanyFilter clicked={checkClickFilter('companies')} />
				)}

				{virtualAgent &&
					(role === SUPERADMIN_ROLE ||
						role === SUPERVIEWER_ROLE ||
						role === ADMIN_ROLE ||
						role === VIEWER_ROLE) && (
						<VirtualAgentFilter
							clicked={checkClickFilter('virtualAgent')}
						/>
					)}
			</List>
			<Box
				sx={{
					width: '100%',
					position: 'absolute',
					bottom: 0,
					textAlign: 'center',
				}}
			>
				<ApplyButton
					type="submit"
					variant="contained"
					color="primary"
					endIcon={<ArrowRightAltIcon />}
				>
					Aplicar Filtros
				</ApplyButton>
			</Box>
		</DrawerForm>
	)
}
