import { Filter } from '@/types/Filter/Filter'
import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit'
import { AppState } from '../..'
import { format } from 'date-fns'
import { NormalizedCompany } from '@/types/Company'
import { getCompanies } from '../companies'
import {
	SUPERADMIN_ROLE,
	SUPERVIEWER_ROLE,
	// SUPERVISOR_ROLE,
} from '@/utils/constants/roles'

const initialState: Filter = {
	start: format(new Date(), 'yyyy-MM-dd'),
	end: format(new Date(), 'yyyy-MM-dd'),
	attention: 'attended',
}

export const filterSlice = createSlice({
	name: 'filter',
	initialState,
	reducers: {
		updateFields: (state, action: PayloadAction<Filter>) => {
			return { ...state, ...action.payload }
		},
		resetFilter: () => initialState,
		resetDatesFilter: (state) => {
			return { ...state, ...initialState }
		},
	},
	extraReducers: (builder) => {
		builder
			// .addCase(
			// 	getChannels.fulfilled,
			// 	(state, action: PayloadAction<Channels>) => {
			// 		state.channels = Object.keys(action.payload.types).map(
			// 			(key) => Number(key.split('channel')[1])
			// 		)
			// 	}
			// )
			.addCase(
				getCompanies.fulfilled,
				(state, action: PayloadAction<NormalizedCompany[]>) => {
					if (action.payload[0]?.idOrg) {
						state.idOrg = action.payload[0].idOrg
					}
				}
			)
	},
})

export const { updateFields, resetFilter, resetDatesFilter } =
	filterSlice.actions

export const selectFilter = (state: AppState) => state.filter

export const filterSelector = createSelector(selectFilter, (state) => state)

export const selecFilterItem = (_: AppState, filterItemName: string) =>
	filterItemName

export const FilterItemSelector = createSelector(
	selectFilter,
	selecFilterItem,
	(state, filterItemName) => {
		return state[filterItemName as keyof Filter]
	}
)

const selectFilterDates = (state: AppState) => ({
	start: state.filter.start,
	end: state.filter.end,
})
export const filterDatesSelector = createSelector(
	selectFilterDates,
	(state) => state
)

// Id organization. Se intenta tomar primero lo que hay en el filtro, sino, tomar lo que hay en el login
export const selectFilterIdOrg = (state: AppState) => {
	const user = state.auth.user

	// Tomar valor del filtro de compañías
	if (user.role === SUPERADMIN_ROLE || user.role === SUPERVIEWER_ROLE) {
		return state.filter.idOrg ?? 0
	}

	// Retornar id de la empresa del login
	return user.company
}
export const filterIdOrgSelector = createSelector(
	selectFilterIdOrg,
	(state) => state
)

// IdVa (asesor virtual)
export const selectIdVa = (state: AppState) => {
	// Devolver valor del state
	if (state.filter.idVa) return state.filter.idVa

	// Valor por defecto (cuando recién se carga)
	if (state.virtualAgents.resource.length) {
		return state.virtualAgents.resource[0].idVa
	}
	return 0
}
export const filterIdVaSelector = createSelector(selectIdVa, (state) => state)

export const selectFilterResolution = (state: AppState) =>
	state.filter.resolution
export const filterResolutionSelector = createSelector(
	selectFilterResolution,
	(state) => state
)

export const selectFilterAttention = (state: AppState) => ({
	attention: state.filter.attention,
})
export const filterActionAttention = createSelector(
	selectFilterAttention,
	(state) => state
)

export const selectFilterId = (state: AppState) => state.filter.id
export const filterIdSelector = createSelector(selectFilterId, (state) => state)

export const selectFilterIdType = (state: AppState) => state.filter.idType
export const filterIdTypeSelector = createSelector(
	selectFilterIdType,
	(state) => state
)

export const selectFilterUser = (state: AppState) => ({
	id: state.filter.id,
	idType: state.filter.idType,
})
export const filterUserSelector = createSelector(
	selectFilterUser,
	(state) => state
)

// Filtro Rango de ingresos
const selectFilterEntries = (state: AppState) => ({
	since: state.filter.since,
	until: state.filter.until,
})
export const filterEntriesSelector = createSelector(
	selectFilterEntries,
	(state) => state
)

// Filtro de locaciones
const selectFilterLocations = (state: AppState) => ({
	regions: state.filter.regionals,
	departments: state.filter.departments,
	cities: state.filter.cities,
})
export const filterLocationsSelector = createSelector(
	selectFilterLocations,
	(state) => state
)

// Filtro de locaciones - Regiones y departamentos
export const selectFilterRegions = (state: Filter) => state.regionals
export const selectFilterDepartments = (state: Filter) => state.departments
export const filterRegionsSelector = createSelector(
	selectFilterRegions,
	(state) => state
)

// Filtro de intenciones
export const selectFilterIntents = (state: AppState) => ({
	intents: state.filter.intents,
})
export const filterIntentsSelector = createSelector(
	selectFilterIntents,
	(state) => state
)

// Canales
export const selectChannels = (state: AppState) => ({
	channels: state.filter.channels,
})
export const filterChannelsSelector = createSelector(
	selectChannels,
	(state) => state
)

// Splits
export const selectSplits = (state: AppState) => ({
	splits: state.filter.splits,
})
export const filterSplitsSelector = createSelector(
	selectSplits,
	(state) => state
)

export const selectSingleSplit = (state: AppState) => ({
	singleSplit: state.filter.singleSplit,
})
export const filterSingleSplitSelector = createSelector(
	selectSingleSplit,
	(state) => state
)

// Eventos
export const selectEvents = (state: AppState) => ({
	events: state.filter.events,
})
export const filterEventsSelector = createSelector(
	selectEvents,
	(state) => state
)

// Asesores humanos
export const selectAgents = (state: AppState) => ({
	agents: state.filter.agents,
})
export const filterAgentsSelector = createSelector(
	selectAgents,
	(state) => state
)

// Tipos de notificación
export const selectNotifTypes = (state: AppState) => ({
	notifChannels: state.filter.notifChannels,
})
export const filterNotificationTypesSelector = createSelector(
	selectNotifTypes,
	(state) => state
)

// Id Conversación
export const selectIdConv = (state: AppState) => ({
	idConv: state.filter.idConv,
})
export const filterIdConvSelector = createSelector(
	selectIdConv,
	(state) => state
)

// Ids Conversación
export const selectIdsConv = (state: AppState) => ({
	idsConv: state.filter.idsConv,
})
export const filterIdsConvSelector = createSelector(
	selectIdsConv,
	(state) => state
)

// Estatus Integración
export const selectIntegrationStatusConv = (state: AppState) => ({
	integrationStatus: state.filter.integrationStatus,
})
export const filterIntegrationStatusSelector = createSelector(
	selectIntegrationStatusConv,
	(state) => state
)

// Nombre servicio Integración
export const selectIntegrationServiceName = (state: AppState) => ({
	integrationService: state.filter.integrationService,
})
export const filterIntegrationServiceNameSelector = createSelector(
	selectIntegrationServiceName,
	(state) => state
)

// Causales de negocio
export const selectCausalesNegocio = (state: AppState) => ({
	causales: state.filter.causalesNegocio,
})
export const filterCausalesNegocioSelector = createSelector(
	selectCausalesNegocio,
	(state) => state
)

// Causales de finalización
export const selectCausalesFin = (state: AppState) => ({
	causales: state.filter.causalesFin,
})
export const filterCausalesFinSelector = createSelector(
	selectCausalesFin,
	(state) => state
)

// Causales de paso automático
export const selectCausalesPasoAutomatico = (state: AppState) => ({
	causales: state.filter.causalesPasoAutomatico,
})
export const filterCausalesPasoAutomaticoSelector = createSelector(
	selectCausalesPasoAutomatico,
	(state) => state
)

export const filterReducer = filterSlice.reducer
