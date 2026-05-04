import {
	Route,
	RouteTree,
	RouteType,
	StrictRouteTree,
} from '@/types/GrantAccess'

export const chat: Route = {
	path: 'chat',
	label: 'chat',
	type: 'route',
}

export const indicators: Route = {
	path: 'indicadores',
	label: 'Indicadores',
	type: 'collapse',
	subRoutes: [
		{
			path: 'atencion',
			label: 'Atención',
			type: 'route',
		},
		{
			path: 'experiencia',
			label: 'Experiencia',
			type: 'route',
		},
	],
}

export const virtualAgent: Route = {
	path: 'asesor-virtual',
	label: 'Asesor virtual',
	type: 'collapse',
	subRoutes: [
		{
			path: 'conversaciones-canal',
			label: 'Conversaciones por canal',
			type: 'route',
		},
		{
			path: 'intenciones',
			label: 'Intenciones',
			type: 'route',
		},
		{
			path: 'calificaciones',
			label: 'Calificaciones',
			type: 'route',
		},
		{
			path: 'integraciones',
			label: 'Integraciones',
			type: 'route',
		},
	],
}

export const humanAgent: Route = {
	path: 'asesor-humano',
	label: 'Asesor humano',
	type: 'collapse',
	subRoutes: [
		{
			path: 'chats',
			label: 'Chats',
			type: 'route',
		},
		{
			path: 'chats-por-asesor',
			label: 'Chats por asesor',
			type: 'route',
		},
		{
			label: 'Estado de chats',
			path: 'estado-chats',
			type: 'route',
		},
		{
			path: 'estado-asesores',
			label: 'Estado actual asesores',
			type: 'route',
		},
		{
			path: 'tiempo-promedio',
			label: 'Tiempo promedio',
			type: 'route',
		},
		{
			path: 'tipificaciones',
			label: 'Tipificación de paso a asesor',
			type: 'route',
		},
		{
			path: 'chats-escalados',
			label: 'Chats escalados',
			type: 'route',
		},
	],
}

export const notificacionesStat: Route = {
	path: 'notificaciones',
	label: 'Notificaciones',
	type: 'route',
}

export const statistics: Route = {
	path: 'estadisticas',
	label: 'Estadísticas',
	type: 'collapse',
	subRoutes: [virtualAgent, humanAgent, notificacionesStat],
}

export const agentStatusReport: Route = {
	path: 'historico-asesores',
	label: 'Estado histórico de conexiones',
	type: 'route',
}

export const humanAgentReports: Route = {
	path: 'asesor-humano',
	label: 'Asesor humano',
	type: 'collapse',
	subRoutes: [
		{
			path: 'chats',
			label: 'Chats atendidos y no atendidos',
			type: 'route',
		},
		agentStatusReport,
		{
			path: 'tipificaciones',
			label: 'Tipificación de paso a asesor',
			type: 'route',
		},
	],
}
export const virtualAgentReports: Route = {
	path: 'asesor-virtual',
	label: 'Asesor virtual',
	type: 'collapse',
	subRoutes: [
		{
			path: 'accesos',
			label: 'Accesos',
			type: 'route',
		},
		{
			path: 'historial',
			label: 'Historial y trazabilidad',
			type: 'route',
			params: '[...slug]',
		},
	],
}

export const reports: Route = {
	path: 'reportes',
	label: 'Reportes',
	type: 'collapse',
	subRoutes: [
		virtualAgentReports,
		humanAgentReports,
		{
			path: 'notificaciones',
			label: 'Notificaciones',
			type: 'route',
		},
	],
}

export const analytics: Route = {
	path: 'analitica',
	label: 'Analítica',
	type: 'sidebar',
	subRoutes: [{ ...indicators }, { ...statistics }, { ...reports }],
}

export const virtualAgentSettings: Route = {
	path: 'asesor-virtual',
	label: 'Asesor virtual',
	type: 'collapse',
	subRoutes: [
		{
			label: 'Formulario de entrada',
			path: 'formulario-entrada',
			type: 'route',
		},
		{
			label: 'Regionales',
			path: 'regionales',
			type: 'route',
		},
		{
			label: 'Expiración de sesiones',
			path: 'expiracion-sesion',
			type: 'route',
		},
		{
			path: 'workspaces',
			label: 'Workspaces',
			type: 'route',
		},
	],
}

export const humanAgentSettings: Route = {
	path: 'asesor-humano',
	label: 'Asesor humano',
	type: 'collapse',
	subRoutes: [
		{
			path: 'asesores',
			label: 'Asesores',
			type: 'route',
		},
		{
			path: 'splits',
			label: 'Splits',
			type: 'route',
		},
		{
			path: 'general',
			label: 'Máximo de chats / eventos de pausa',
			type: 'route',
		},
		{
			path: 'causales-negocio',
			label: 'Causales de negocio',
			type: 'route',
		},
		{
			path: 'causales-finalizacion',
			label: 'Causales de finalización',
			type: 'route',
		},
		{
			path: 'mensajes',
			label: 'Configuración de mensajes',
			type: 'route',
		},
		{
			label: 'Plantillas de respuesta',
			path: 'plantillas-respuesta',
			type: 'route',
		},
		{
			label: 'Directorio de contactos',
			path: 'directorio-contactos',
			type: 'route',
		},
	],
}

export const notificationsSettings: Route = {
	path: 'notificaciones',
	label: 'Notificaciones',
	type: 'collapse',
	subRoutes: [
		{
			label: 'Eventos',
			path: 'eventos',
			type: 'route',
		},
		{
			label: 'Emails',
			path: 'emails',
			type: 'route',
		},
	],
}

export const personalizacionSettings: Route = {
	path: 'personalizacion',
	label: 'Personalización',
	type: 'collapse',
	subRoutes: [
		{
			label: 'Dashboard',
			path: 'dashboard',
			type: 'route',
		},
		{
			label: 'Widget',
			path: 'widget',
			type: 'route',
		},
		{
			path: 'funcionalidades',
			label: 'Funcionalidades',
			type: 'route',
		},
	],
}

export const settings: Route = {
	path: 'configuracion',
	label: 'Configuración',
	type: 'sidebar',
	subRoutes: [
		{
			path: 'companias',
			label: 'Compañías',
			type: 'route',
		},
		{
			path: 'administrar-usuarios',
			label: 'Administrar usuarios',
			type: 'collapse',
			subRoutes: [
				{
					label: 'Usuarios',
					path: 'usuarios',
					type: 'route',
				},
				{
					label: 'Parámetros de bloqueo/caducidad',
					path: 'parametros',
					type: 'route',
				},
			],
		},
		virtualAgentSettings,
		humanAgentSettings,
		notificationsSettings,
		personalizacionSettings,
	],
}

// Configuración de superadmin
export const superAdminSettingsGeneral: Route[] | undefined =
	settings.subRoutes?.map((route) => {
		if (route.path === 'asesor-virtual') {
			return {
				...route,
				subRoutes: route.subRoutes?.filter((item) =>
					['expiracion-sesion', 'formulario-entrada'].includes(
						item.path
					)
				),
			}
		}
		// Retornar solo configuración de directorio
		else if (route.path === 'asesor-humano') {
			const subRoutes = route.subRoutes?.filter((item) =>
				['directorio-contactos'].includes(item.path)
			)
			return {
				...route,
				subRoutes,
			}
		}
		return route
	})

export const superAdminSettings: Route[] | undefined = superAdminSettingsGeneral
// .sort((a, b) => (a.label < b.label ? -1 : 1))

export const routeTree: StrictRouteTree = {
	chat,
	analytics,
	settings,
}

export const agent: RouteTree = {
	chat,
}

export const supervisor: RouteTree = {
	analytics: {
		...analytics,
		subRoutes: [
			{
				...statistics,
				subRoutes: [{ ...humanAgent }],
			},
			{
				...reports,
				subRoutes: [
					{
						...humanAgentReports,
						// subRoutes: humanAgentReports.subRoutes?.filter((r) =>
						// 	['historico-asesores', 'tipificaciones'].includes(
						// 		r.path
						// 	)
						// ),
					},
				],
			},
		],
	},
	settings: {
		...settings,
		subRoutes: settings.subRoutes?.filter(
			(route) => route.path === 'asesor-humano'
		),
	},
}

export const analyst: RouteTree = {
	analytics: {
		...analytics,
		subRoutes: [
			{ ...indicators },
			{
				...statistics,
				subRoutes: [
					{ ...virtualAgent },
					{
						...humanAgent,
						// subRoutes: humanAgent.subRoutes?.filter(
						// 	(route) => route.path !== 'estado-chats'
						// ),
					},
					{ ...notificacionesStat },
				],
			},
			{ ...reports },
		],
	},
}

export const admin: RouteTree = {
	analytics,
	settings: {
		...settings,
		subRoutes: settings.subRoutes?.filter(
			(route) => route.path !== 'companias'
		),
	},
}

export const superAnalyst: RouteTree = {
	analytics: {
		...analytics,
		subRoutes: [
			{ ...indicators },
			{ ...statistics },
			{
				...reports,
				subRoutes: reports.subRoutes?.filter(
					(route) => route.path !== 'estado-de-asesores'
				),
			},
		],
	},
}

export const superAdmin: RouteTree = {
	analytics,
	settings: {
		...settings,
		subRoutes: superAdminSettingsGeneral,
	},
}

/**
 * routeTreeList for the 6 actual roles
 */
export const routeTreeList: RouteTree[] = [
	{},
	superAdmin, // 1
	superAnalyst, // 2
	admin, // 3
	analyst, // 4
	agent, // 5
	supervisor, // 6
]

const generateRoutes = (
	parent: string,
	subRoutes: Route[] | undefined,
	paths: string[],
	parentType?: RouteType
): string[] => {
	if (subRoutes) {
		for (const i in subRoutes) {
			if (subRoutes[i].type === 'route') {
				const path = `/${parent}/${subRoutes[i].path}`
				paths.push(path)

				if (subRoutes[i].params) {
					paths.push(`${path}/${subRoutes[i].params}`)
				}
			}
			generateRoutes(
				`${parent}/${subRoutes[i].path}`,
				subRoutes[i].subRoutes,
				paths
			)
		}
	} else if (parentType === 'route') {
		paths.push(`/${parent}`)
	}
	return paths
}

const setRoleRoutes = (role: number) => {
	const valores = routeTreeList[role]
	const paths: string[] = ['/login']

	if (valores) {
		if (valores.analytics) {
			paths.push(
				...generateRoutes(
					valores.analytics.path,
					valores.analytics.subRoutes,
					[],
					valores.analytics.type
				)
			)
		}
		if (valores.chat) {
			paths.push(
				...generateRoutes(
					valores.chat.path,
					valores.chat.subRoutes,
					[],
					valores.chat.type
				)
			)
		}
		if (valores.settings) {
			paths.push(
				...generateRoutes(
					valores.settings.path,
					valores.settings.subRoutes,
					['/configuracion'],
					valores.settings.type
				)
			)
		}
	}
	return paths
}

export const roleAccess = [
	[],
	setRoleRoutes(1),
	setRoleRoutes(2),
	setRoleRoutes(3),
	setRoleRoutes(4),
	setRoleRoutes(5),
	setRoleRoutes(6),
]
