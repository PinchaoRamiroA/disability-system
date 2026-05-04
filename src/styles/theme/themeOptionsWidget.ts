import { ThemeOptions } from '@mui/material/styles'
import { getFontStyles } from '@/utils/helpers/formatFontVariant'
import { WidgetChat, WidgetConfig } from '@/types/Settings/General/Widget'

export const setThemeOptionsWidget = (mode: WidgetConfig): ThemeOptions => {
	const { chat, footer, header, popups, steps } = mode.colores
	const { family, category, variant } = mode.font
	const widgetChat: WidgetChat = {
		header,
		messages: chat.messages,
		footer,
	}

	return {
		// palette: {
		// 	primary: {
		// 		// main: mode === 'light' ? 'rgb(2, 152, 177)' : '#ffffff',
		// 		main: principal.background,
		// 		contrastText: principal.color,
		// 	},
		// 	secondary: {
		// 		main: secundario.background,
		// 		contrastText: secundario.color,
		// 	},
		// 	background: {
		// 		default: '#f5f5f5',
		// 		// paper: '#54d335',
		// 	},
		// },
		toolbar: header,
		widgetChat,
		widgetForm: steps.buttons,
		widgetPopup: popups,
		components: {
			MuiTooltip: {
				defaultProps: {
					arrow: true,
				},
			},
			MuiTypography: {
				defaultProps: {
					fontFamily: `${family}, ${category}`,
					...getFontStyles(variant),
				},
			},
		},
		typography: {
			// Tell MUI what's the font-size on the html element is.
			// htmlFontSize: 10,
			fontFamily: `${family}, ${category}`,
			...getFontStyles(variant),
		},
	}
}
