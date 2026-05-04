import { DashboardConfig } from '@/types/Settings/General/Dashboard'

export const DASHBOARD_STYLES_LS = 'styles'
export const DASHBOARD_IMAGE_LS = 'image'

export const DASHBOARD_DEFAULT_CONFIG: DashboardConfig = {
	colores: {
		asesorHumano: {
			footer: {
				background: '#f7f7f7',
				iconsColor: '#717171',
			},
			header: {
				background: '#f7f7f7',
				color: '#000000',
			},
			mensajeAsesor: {
				background: '#639ad9',
				color: '#ffffff',
			},
			mensajeCliente: {
				background: '#ffffff',
				color: '#000000',
			},
		},
		header: {
			background: '#0298b1',
			color: '#ffffff',
		},
		principal: {
			background: '#1973bb',
			color: '#ffffff',
		},
		secundario: {
			background: '#0298b1',
			color: '#ffffff',
		},
	},
	fuente: {
		category: 'sans-serif',
		family: 'Roboto',
		variant: '',
	},
}
