import React, { Component, ErrorInfo } from 'react'
import { Button, Card, CardContent, Typography } from '@mui/material'
import { useCompanyAndIdVa } from '@/hooks/useCompanyAndIdVa'
import { useAppDispatch } from '@/hooks/useReduxHooks'
import { saveLog } from '@/store/slices/web-chat-human-agent'

interface ErrorBoundaryProps {
	children: React.ReactNode
	idOrg: number
	dispatch: ReturnType<typeof useAppDispatch>
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

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		const { idOrg, dispatch } = this.props

		const detail = {
			error: {
				message: error.message,
				name: error.name,
				cause: error.cause,
				stack: error.stack,
			},
			errorInfo: {
				componentStack: errorInfo?.componentStack ?? '',
			},
		}

		this.setState({
			errorMessage: `${detail.error.name} - ${detail.error.message}`,
		})

		dispatch(
			saveLog({
				idOrg,
				payload: {
					callback: 'errorBoundary',
					detail: JSON.stringify(detail),
					idadviser: 0,
					application: 'Dashboard',
				},
			})
		)
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
	const { idOrg } = useCompanyAndIdVa()
	const dispatch = useAppDispatch()

	return (
		<ErrorBoundaryClass idOrg={idOrg} dispatch={dispatch}>
			{children}
		</ErrorBoundaryClass>
	)
}

export default ErrorBoundary
