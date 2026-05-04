import { WidgetConfig } from '@/types/Settings/General/Widget'

export const WIDGET_CONFIG_DEFAULT: WidgetConfig = {
	colores: {
		chat: {
			background: '#ffffff',
			messages: {
				agent: {
					background: '#f2f2f2',
					color: '#0097ae',
				},
				client: {
					background: '#f2f2f2',
					color: '#0097ae',
				},
			},
		},
		footer: {
			background: '#f3f3f3',
			icons: '#0097ae',
		},
		header: {
			background: '#0097ae',
			color: '#ffffff',
		},
		popups: {
			body: {
				background: '#ffffff',
				color: '#333333',
			},
			buttons: {
				default: {
					background: '#acacac',
					color: '#ffffff',
				},
				primary: {
					background: '#0097ae',
					color: '#ffffff',
				},
			},
			header: {
				background: '#a7babe',
				color: '#ffffff',
			},
		},
		steps: {
			buttons: {
				background: '#0097ae',
				color: '#ffffff',
			},
		},
	},
	font: {
		category: 'sans-serif',
		family: 'Roboto',
		variant: '',
	},
}
