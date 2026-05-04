import { LOGOUT_ACTION_TYPE } from '@/utils/constants/userSession'
import { AnyAction, combineReducers } from '@reduxjs/toolkit'
import { loadingBarReducer } from 'react-redux-loading-bar'
import {
	authReducer,
	notifIdReducer,
	redispatchReducer,
} from './slices/authentication'
import { counterReducer } from './slices/counter'
import { notistackReducer } from './slices/notistack'
import { routeTreeReducer } from './slices/routeTree/slice'
import {
	dashboardLogoReducer,
	dashboardStylesReducer,
} from './slices/dashboard-config'
import { companiesReducer } from './slices/companies/slice'
import { UsersReducer } from './slices/users'
import { RootStateOrAny } from 'react-redux'
import { filterReducer } from './slices/Filter'
import { channelsReducer } from './slices/channels'
import { documentTypesReducer } from './slices/documentTypes'
import { attentionIndicatorsReducer } from './slices/indicators/attention/slice'
import { locationsReducer } from './slices/locations'
import { intentsReducer, intentsQuantitiesReducer } from './slices/intents'
import {
	chatSessionsConversationReducer,
	chatSessionsInteractionsReducer,
	interactionsAVGReducer,
} from './slices/stats/chatSessions'
import { tempFilterReducer } from './slices/Filter/temp_slice'
import {
	integrationsLogReducer,
	virtualAgentsReducer,
} from './slices/virtualAgent'
import { drawerReducer } from './slices/drawer'
import { splitsAsesorReducer, splitsReducer } from './slices/splits'
import { eventsReducer } from './slices/events'
import {
	agentsChatsReducer,
	avgTimeReducer,
	chatsInputInfoReducer,
	humanAgentChatReducer,
	escalatedChatsReducer,
	chatsReducer,
	humanAgentDirectoryReducer,
} from './slices/humanAgent'
import { uploadFileReducer } from './slices/uploadFile'
import { accessReducer } from './slices/reports/humanAgent/access'
import {
	historyReducer,
	interactionHistoryReducer,
	maxEntriesReducer,
} from './slices/reports/humanAgent/history'
import { agentChatsHistoryReducer } from './slices/reports/humanAgent/history/chats'
import { agentsReducer } from './slices/humanAgent/filter'
import {
	notificationsReducer,
	notificationTypesReducer,
	notificationsEventsReducer,
	notificationsConfigReducer,
} from './slices/notifications'
import { notificationsLogsReducer } from './slices/reports/notifications'
import { estadoActualAsesoresReducer } from './slices/humanAgent/estadoActual'
import { estadoHistoricoAsesoresReducer } from './slices/reports/humanAgent/estadoHistorico'
import { pauseEventsReducer } from './slices/pauseEvents'
import {
	workspaceAnswerDetailsReducer,
	workspaceAnswerReducer,
	workspacesReducer,
	workspaceUpdateResumeReducer,
} from './slices/workspaces'
import { ldapReducer } from './slices/authentication/ldapReducer'
import { experienceIndicatorsReducer } from './slices/indicators/experience'
import {
	causalesNegocioAHReducer,
	causalesNegocioReducer,
	estadisticaCausalesNegocioReducer,
} from './slices/causales-negocio'
import { parametrosReducer } from './slices/parametros'
import {
	causalesFinAHReducer,
	causalesFinReducer,
	estadisticaCausalesFinReducer,
} from './slices/causales-fin'
import { googleFontsReducer } from './slices/googleFonts'
import { widgetConfigReducer, widgetAvatarReducer } from './slices/widgetConfig'
import { estadoChatsReducer } from './slices/estado-chats'
import { dashboardPreviewReducer } from './slices/dashboard-config-preview'
import { widgetPreviewReducer } from './slices/widget-config-preview'
import {
	directorioReducer,
	plantillasRespuestaReducer,
} from './slices/settings/asesor-humano'
import {
	configExpiracionReducer,
	configFormEntradaReducer,
} from './slices/settings/asistente-virtual'
import { causalesConversacionReducer } from './slices/causales-conversacion'
import {
	intentsTimeRatingReducer,
	topRatingsReducer,
} from './slices/calificaciones'
import { reporteCausalesReducer } from './slices/reports/humanAgent/tipificaciones'
import {
	causalesPasoAutomaticoReducer,
	estadisticaPasoAutomaticoReducer,
} from './slices/causales-paso-automatico'
import { featuresReducer } from './slices/settings/personalizacion'
import {
	configMensajesReducer,
	fullConfigMensajesReducer,
} from './slices/mensajes'
import {
	parametrosBloqueoReducer,
	parametrosCaducidadReducer,
} from './slices/settings/administracion-usuarios/parametros'
import { changePasswordReducer } from './slices/authentication/changePasswordReducer'
import { emailsConfigReducer } from './slices/settings/notificaciones'

const stats = {
	chatSessionsConversations: chatSessionsConversationReducer,
	chatSessionsInteractions: chatSessionsInteractionsReducer,
	chatSessionsInteractionsAVG: interactionsAVGReducer,
}

export const combinedReducer = combineReducers({
	// Chat de asesor humano
	causalesNegocioAH: causalesNegocioAHReducer,
	causalesFinAH: causalesFinAHReducer,
	causalesConversacion: causalesConversacionReducer,
	humanAgentChats: humanAgentChatReducer,
	humanAgentDirectory: humanAgentDirectoryReducer,
	loadingBar: loadingBarReducer,
	auth: authReducer,
	changePasswordReducer,
	routeTree: routeTreeReducer,
	filter: filterReducer,
	tempFilter: tempFilterReducer,
	agents: agentsReducer,
	channels: channelsReducer,
	locations: locationsReducer,
	intents: intentsReducer,
	intentsQuantities: intentsQuantitiesReducer,
	topRating: topRatingsReducer,
	intentsTimeRating: intentsTimeRatingReducer,
	documentTypes: documentTypesReducer,
	dashboardStyles: dashboardStylesReducer,
	dashboardPreview: dashboardPreviewReducer,
	dashboardLogo: dashboardLogoReducer,
	counter: counterReducer,
	notistack: notistackReducer,
	companies: companiesReducer,
	users: UsersReducer,
	parametrosBloqueo: parametrosBloqueoReducer,
	parametrosCaducidad: parametrosCaducidadReducer,
	attentionIndicators: attentionIndicatorsReducer,
	experienceIndicators: experienceIndicatorsReducer,
	// Estadísticas
	...stats,
	virtualAgents: virtualAgentsReducer,
	estadoChats: estadoChatsReducer,
	drawer: drawerReducer,
	splits: splitsReducer,
	events: eventsReducer,
	notifications: notificationsReducer,
	notificationTypes: notificationTypesReducer,
	notificationEvents: notificationsEventsReducer,
	// Estadísitcas - Asesor humano
	escalatedChats: escalatedChatsReducer,
	avgTime: avgTimeReducer,
	agentsChats: agentsChatsReducer,
	uploadFile: uploadFileReducer,
	chats: chatsReducer,
	chatsInputInfo: chatsInputInfoReducer,
	estadoActualAsesores: estadoActualAsesoresReducer,
	integrationsLog: integrationsLogReducer,
	estadisticaCausalesNegocio: estadisticaCausalesNegocioReducer,
	estadisticaCausalesFin: estadisticaCausalesFinReducer,
	estadisticaPasoAutomatico: estadisticaPasoAutomaticoReducer,
	/**
	 * Reportes
	 */
	// Asesor humano
	access: accessReducer,
	maxEntries: maxEntriesReducer,
	interactionHistory: interactionHistoryReducer,
	history: historyReducer,
	agentChatsHistory: agentChatsHistoryReducer,
	estadoHistoricoAsesores: estadoHistoricoAsesoresReducer,
	// Notificaciones
	notificationsLogs: notificationsLogsReducer,
	// Redispatch (asociado refreshToken)
	redispatch: redispatchReducer,
	reporteCausales: reporteCausalesReducer,
	/**
	 * Configuración
	 */
	// Asesor humano
	configMensajes: configMensajesReducer,
	fullConfigMensajes: fullConfigMensajesReducer,
	splitsAsesor: splitsAsesorReducer,
	pauseEvents: pauseEventsReducer,
	parametros: parametrosReducer,
	plantillasRespuesta: plantillasRespuestaReducer,
	causalesNegocio: causalesNegocioReducer,
	causalesFin: causalesFinReducer,
	causalesPasoAutomatico: causalesPasoAutomaticoReducer,
	directorioContactos: directorioReducer,

	// Asesor virtual
	// Expiración de sesión
	configExpiracion: configExpiracionReducer,
	configFormEntrada: configFormEntradaReducer,
	// Workspaces
	workspaces: workspacesReducer,
	workspaceAnswer: workspaceAnswerReducer,
	workspaceAnswerDetails: workspaceAnswerDetailsReducer,
	workspaceUpdateResume: workspaceUpdateResumeReducer,
	// LDAP
	ldap: ldapReducer,
	// Id para notificaciones
	notifId: notifIdReducer,
	// Configuración de notificaciones
	notificationsConfig: notificationsConfigReducer,
	emailsConfig: emailsConfigReducer,

	/** Personalización */
	features: featuresReducer,
	// Widget
	googleFonts: googleFontsReducer,
	// Personalización de widget
	widgetAvatar: widgetAvatarReducer,
	widgetConfig: widgetConfigReducer,
	widgetPreviewConfig: widgetPreviewReducer,
})

export const rootReducer = (
	state: RootStateOrAny | undefined,
	action: AnyAction
) => {
	if (action.type === LOGOUT_ACTION_TYPE) {
		state = undefined
	}

	return combinedReducer(state, action)
}
