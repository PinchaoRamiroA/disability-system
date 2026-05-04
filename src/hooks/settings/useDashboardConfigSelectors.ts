import { useEffect } from 'react'
import {
	dashboardLogoSelector,
	dashboardStylesSelector,
} from '@/store/slices/dashboard-config'
import {
	dashboardPreviewSelector,
	updateDashboardPreview,
} from '@/store/slices/dashboard-config-preview'
import { useAppDispatch, useAppSelector } from '../useReduxHooks'

export const useDashboardConfigSelectors = () => {
	const dispatch = useAppDispatch()

	// Estilos y logo
	const { resource: estilos } = useAppSelector(dashboardStylesSelector)
	const { resource: logo } = useAppSelector(dashboardLogoSelector)
	const { colores } = useAppSelector(dashboardPreviewSelector)

	useEffect(() => {
		dispatch(updateDashboardPreview(estilos))
	}, [estilos])

	return {
		estilosDashboard: estilos,
		logoDashboard: logo,
		coloresDashboard: colores,
	}
}
