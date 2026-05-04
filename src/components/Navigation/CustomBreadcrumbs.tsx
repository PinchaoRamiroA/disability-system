import React, { useEffect, useState } from 'react'
import { Breadcrumbs, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useUrlAccess } from '@/hooks/useUrlAccess'
import { Route } from '@/types/GrantAccess'
import { NavigateNext } from '@mui/icons-material'

export const CustomBreadcrumbs = () => {
	const router = useRouter()
	const currentRoute = router.asPath
	const pathnames = currentRoute.split('/').filter((x) => x)
	const { routeTreeRole } = useUrlAccess()
	const [sections, setSections] = useState<string[]>([])

	// Buscar equivalencias entre secciones de la URL y el sidebar
	useEffect(() => {
		const tempSections: string[] = []
		let searchPath: Route | undefined

		const pushLabelToSections = (label: string | undefined) => {
			if (label) {
				tempSections.push(label)
			}
		}

		// Recorrer secciones de la URL para generar el breadcrumb con las opción del sidebar
		pathnames.forEach((path, i) => {
			// Determinar ruta inicial de búsqueda (analítica o configuración) cuando el índice es 0
			if (i === 0) {
				// Buscar por sección de configuración
				if (path.includes('configuracion')) {
					searchPath = routeTreeRole.settings
				}
				// Buscar por sección de analítica
				else if (path.includes('analitica')) {
					searchPath = routeTreeRole.analytics
				}
			} else {
				// Validar si se puede seguir avanzando consultando las subrutas en el sidebar con las secciones de la URL (path)
				if (searchPath?.subRoutes) {
					for (const subpath of searchPath.subRoutes) {
						// Se encuentra match entre sección de URL y sección del sidebar
						if (subpath.path === path) {
							// Guardar equivalencia de sección del sidebar
							pushLabelToSections(subpath.label)
							// Actualizar ruta para la búsqueda en la(s) siguiente(s) subruta(s)
							searchPath = subpath
							break
						}
					}
				}
			}
		})

		// Actualizar state
		setSections(tempSections)
	}, [currentRoute])

	return (
		<Breadcrumbs
			aria-label="breadcrumb"
			separator={<NavigateNext fontSize="small" />}
			sx={{
				mb: 1,
			}}
		>
			{sections.map((section, index) => {
				const last = index === sections.length - 1

				return (
					<Typography color={last ? 'black' : 'grey'} key={index}>
						{section}
					</Typography>
				)
			})}
		</Breadcrumbs>
	)
}
