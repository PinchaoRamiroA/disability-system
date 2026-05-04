import List from '@mui/material/List'
import { useAppSelector } from '@/hooks/useReduxHooks'
import { sidebarSelector } from '@/store/slices/routeTree'
import { DrawerItem } from '../DrawerItem'
import { DrawerCollapse } from '../DrawerCollapse'
import { Route } from '@/types/GrantAccess'
import { useRouter } from 'next/router'
import { AppState } from '@/store/index'
import { useEffect, useState } from 'react'
import { SidebarCollapse } from '@/types/Sidebar'
import { SidebarContext } from '@/contexts/SidebarContext'

const generateRoute = (
	route: Route,
	height = 0,
	parentPath = '',
	parent?: boolean
): React.ReactNode => {
	const fullPath = `${parentPath}/${route.path}`

	switch (route.type) {
		//case 0: it's a route so it returns a listItem
		case 'route':
			return (
				<DrawerItem
					key={fullPath}
					path={fullPath}
					height={height}
					label={route.label}
				/>
			)

		case 'collapse':
			return (
				<DrawerCollapse
					key={fullPath}
					height={height}
					label={route.label}
					parent={parent}
					path={fullPath}
				>
					{route.subRoutes?.map((subRoute) =>
						generateRoute(subRoute, height + 1, fullPath)
					)}
				</DrawerCollapse>
			)
		case 'sidebar':
			return route.subRoutes?.map((subRoute) =>
				generateRoute(subRoute, 0, route.path, true)
			)
	}
}

export const DrawerList = () => {
	const router = useRouter()
	const sidebarName = router.asPath.split('/')[1]
	const [collapsableItems, setCollapsableItems] = useState<SidebarCollapse[]>(
		[]
	)

	const sidebar = useAppSelector((state: AppState) =>
		sidebarSelector(state, sidebarName)
	)

	const iterateRoutes = (route: Route, height = 0, parentPath = '') => {
		if (route.type === 'sidebar') {
			route.subRoutes?.map((subroute) =>
				iterateRoutes(subroute, 0, route.path)
			)
		} else if (route.type === 'collapse') {
			if (route.subRoutes) {
				const fullPath = `${parentPath}/${route.path}`
				const item: SidebarCollapse = {
					collapsed: false,
					height,
					path: fullPath,
				}
				setCollapsableItems((prevState) => [...prevState, item])
				route.subRoutes.map((subroute) =>
					iterateRoutes(subroute, height + 1, fullPath)
				)
			}
		}
	}

	useEffect(() => {
		// Iterar árbol de rutas recursivamente
		if (sidebar) {
			iterateRoutes(sidebar)
		}
	}, [sidebar])

	if (sidebar) {
		return (
			<SidebarContext.Provider
				value={{ collapsableItems, setCollapsableItems }}
			>
				<List
					component="nav"
					aria-label="barra de navegación horizontal"
				>
					{generateRoute(sidebar)}
				</List>
			</SidebarContext.Provider>
		)
	} else return null
}
