import React from 'react'
import { Breadcrumbs, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { NavigateNext } from '@mui/icons-material'

export const CustomBreadcrumbs = () => {
	const router = useRouter()
	const currentRoute = router.asPath
	const pathnames = currentRoute.split('/').filter((x) => x)

	const labels: Record<string, string> = {
		dashboard: 'Dashboard',
		incapacidades: 'Incapacidades',
		documentos: 'Documentos',
		transcripcion: 'Transcripción',
		seguimiento: 'Seguimiento',
		pagos: 'Pagos',
		conciliacion: 'Conciliación',
		alertas: 'Alertas',
		reportes: 'Reportes',
		usuarios: 'Usuarios',
		configuracion: 'Configuración',
		auditoria: 'Auditoría',
	}

	return (
		<Breadcrumbs
			aria-label="breadcrumb"
			separator={<NavigateNext fontSize="small" />}
			sx={{ mb: 1 }}
		>
			{pathnames.map((path, index) => {
				const last = index === pathnames.length - 1
				return (
					<Typography color={last ? 'black' : 'grey'} key={index}>
						{labels[path] || path}
					</Typography>
				)
			})}
		</Breadcrumbs>
	)
}