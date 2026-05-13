export interface Route {
	path: string
	label: string
	type: 'route' | 'collapse' | 'sidebar'
	subRoutes?: Route[]
}

export const menuItems: Route[] = [
	{ path: 'dashboard', label: 'Dashboard', type: 'route' },
	{ path: 'incapacidades', label: 'Incapacidades', type: 'route' },
]