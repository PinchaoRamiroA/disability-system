export type Route = {
	path: string
	label: string
	type: RouteType
	subRoutes?: Route[]
	params?: string
}

export type RouteType = 'route' | 'collapse' | 'sidebar' | 'root'

export type RouteTree = {
	chat?: Route
	analytics?: Route
	settings?: Route
}
export type StrictRouteTree = {
	chat: Route
	analytics: Route
	settings: Route
}
