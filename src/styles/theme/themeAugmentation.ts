import { AsesorHumano, Color } from '@/types/Settings/General/Dashboard'
import { Popups, WidgetChat } from '@/types/Settings/General/Widget'

export {}

/**
 * Module augmentation. It allows adding custom values to the theme
 */
declare module '@mui/material/styles' {
	interface Theme {
		// customValue: {
		//   customPropertie: number
		// }
		asesorHumano: AsesorHumano
		toolbar: Color
		status: {
			main: string
		}
		// Configuración Widget
		widgetChat: WidgetChat
		widgetForm: Color
		widgetPopup: Popups
	}

	// allow configuration using `createTheme`
	interface ThemeOptions {
		// customValue?: {
		//   customPropertie?: number
		// }
		status?: {
			main?: string
		}
		asesorHumano?: AsesorHumano
		widgetChat?: WidgetChat
		widgetForm?: Color
		widgetPopup?: Popups
		toolbar: Color
	}

	interface PaletteOptions {
		status?: {
			main?: string
		}
	}
}
