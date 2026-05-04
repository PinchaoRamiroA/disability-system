import { DashboardConfig } from '@/types/Settings/General/Dashboard'
import { ThemeOptions } from '@mui/material/styles'
import { getFontStyles } from '@/utils/helpers/formatFontVariant'

export const setThemeOptions = (mode: DashboardConfig): ThemeOptions => {
	const { principal, secundario, header, asesorHumano } = mode.colores
	const { family, category, variant } = mode.fuente

	return {
		palette: {
			primary: {
				// main: mode === 'light' ? 'rgb(2, 152, 177)' : '#ffffff',
				main: principal.background,
				contrastText: principal.color,
			},
			secondary: {
				main: secundario.background.length
					? secundario.background
					: '#fff',
				contrastText: secundario.color.length
					? secundario.color
					: '#fff',
			},
			background: {
				default: '#f5f5f5',
				// paper: '#54d335',
			},
		},
		status: {
			main: principal.background,
		},
		toolbar: header,
		asesorHumano,
		components: {
			MuiTooltip: {
				defaultProps: {
					arrow: true,
				},
			},
			MuiAppBar: {
				variants: [
					{
						props: {},
						style: {
							backgroundColor: header.background,
							color: header.color,
						},
					},
				],
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
