export {}

declare module '@mui/material/styles' {
	interface Theme {
		status: {
			main: string
		}
	}

	interface ThemeOptions {
		status?: {
			main?: string
		}
	}

	interface PaletteOptions {
		status?: {
			main?: string
		}
	}
}