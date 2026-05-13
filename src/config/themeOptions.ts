import { ThemeOptions } from '@mui/material'

export const themeOptions = (): ThemeOptions => {
	return {
		palette: {
			mode: 'light',
			primary: {
				main: '#D4AF37',
				contrastText: '#2C2C2C',
			},
			secondary: {
				main: '#800020',
				contrastText: '#FFFFFF',
			},
			background: {
				default: '#F4F4F4',
			},
		},
		components: {
			MuiTooltip: {
				defaultProps: {
					arrow: true,
				},
			},
			MuiTypography: {
				defaultProps: {
					fontFamily: 'Poppins, sans-serif',
				},
			},
			MuiCssBaseline: {
				styleOverrides: {
					'input:-webkit-autofill': {
						boxShadow: '0 0 0 1000px #f5f5f5 inset',
						WebkitBoxShadow: '0 0 0 1000px #f5f5f5 inset',
						WebkitTextFillColor: '#000',
						transition: 'background-color 5000s ease-in-out 0s',
					},
				},
			},
		},
		typography: {
			fontFamily: 'Poppins, sans-serif',
		},
		status: {
			main: '#D4AF37',
		},
	}
}