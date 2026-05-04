import * as React from 'react'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { SnackbarProvider } from 'notistack'

import { useDefineTheme } from '@/hooks/useDefineTheme'
import { SnackbarCloseButton } from '@/containers/SnackbarCloseButton/SnackbarCloseButton'
import { WarningRounded } from '@mui/icons-material'

export function ThemeLayout({ children }: { children: React.ReactNode }) {
	const theme = useDefineTheme()

	return (
		<ThemeProvider theme={theme}>
			<SnackbarProvider
				maxSnack={3}
				autoHideDuration={10000}
				action={(snackbarKey) => (
					<SnackbarCloseButton snackbarKey={snackbarKey} />
				)}
				iconVariant={{
					error: <WarningRounded fontSize="small" sx={{ mr: 1 }} />,
				}}
			>
				<CssBaseline />
				{children}
			</SnackbarProvider>
		</ThemeProvider>
	)
}
