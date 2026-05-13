import React, { Component, ErrorInfo } from 'react'
import { Button, Card, CardContent, Typography } from '@mui/material'

interface ErrorBoundaryProps {
	children: React.ReactNode
}

interface ErrorBoundaryState {
	hasError: boolean
	errorMessage: string
}

class ErrorBoundaryClass extends Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	state = { hasError: false, errorMessage: '' }

	static getDerivedStateFromError() {
		return { hasError: true }
	}

	componentDidCatch(error: Error, _errorInfo: ErrorInfo) {
		this.setState({
			errorMessage: `${error.name} - ${error.message}`,
		})
	}

	render() {
		if (this.state.hasError) {
			return (
				<Card
					sx={{
						maxWidth: 400,
						margin: 'auto',
						mt: 5,
						textAlign: 'center',
					}}
				>
					<CardContent>
						<Typography variant="h5" color="error" gutterBottom>
							Algo salió mal
						</Typography>
						<Typography
							variant="body2"
							color="textSecondary"
							gutterBottom
						>
							{this.state.errorMessage}
						</Typography>
						<Button
							variant="contained"
							color="primary"
							sx={{ mt: 2 }}
							onClick={() => window.location.reload()}
						>
							Recargar Página
						</Button>
					</CardContent>
				</Card>
			)
		}
		return this.props.children
	}
}

const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
	return <ErrorBoundaryClass>{children}</ErrorBoundaryClass>
}

export default ErrorBoundary