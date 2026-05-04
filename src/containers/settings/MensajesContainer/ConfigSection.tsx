import React from 'react'
import { Grid, Paper, Skeleton, TextField, Typography } from '@mui/material'
import { Status } from '@/types/status'
import { MensajesConfig } from '@/types/Settings/Mensajes'

interface Props {
	resource: MensajesConfig[]
	status: Status
	handleChange: (id: number, newValue: string) => void
	textFields: { [key: number]: string }
	title: string
	handleKeyDown: (e: React.KeyboardEvent<HTMLDivElement>, id: number) => void
	children?: JSX.Element
}

export const ConfigSection = ({
	resource,
	handleChange,
	handleKeyDown,
	status,
	textFields,
	title,
	children,
}: Props) => {
	return (
		<React.Fragment>
			{/* Nombre de la sección */}
			<Grid item xs={12} sm>
				<Typography variant="h6">{title}</Typography>
			</Grid>

			{children}

			{status === 'resolved' && resource.length > 0 && (
				<React.Fragment>
					{/* Campos */}
					{resource.map((configMensaje) => (
						<Grid item xs={12} key={configMensaje.acronym}>
							<Paper elevation={0}>
								<TextField
									value={
										textFields[
											configMensaje.idEndTypeConversation
										] || ''
									}
									fullWidth
									size="small"
									onChange={(e) =>
										handleChange(
											configMensaje.idEndTypeConversation,
											e.target.value
										)
									}
									onKeyDown={(e) =>
										handleKeyDown(
											e,
											configMensaje.idEndTypeConversation
										)
									}
									multiline
									maxRows={10}
									label={configMensaje.description}
									InputProps={{
										inputProps: {
											maxLength: 255,
										},
									}}
								/>
							</Paper>
						</Grid>
					))}
				</React.Fragment>
			)}

			{status === 'resolved' && resource.length === 0 && (
				<Grid item xs={12}>
					<Typography variant="body1" align="center">
						No hay mensajes para configurar.
					</Typography>
				</Grid>
			)}

			{/* Skeleton */}
			{status !== 'resolved' &&
				Array.from({ length: 4 }).map((_, index) => (
					<Grid item xs={12} key={index}>
						<Paper elevation={0}>
							<Skeleton variant="rectangular" height={40} />
						</Paper>
					</Grid>
				))}
		</React.Fragment>
	)
}
