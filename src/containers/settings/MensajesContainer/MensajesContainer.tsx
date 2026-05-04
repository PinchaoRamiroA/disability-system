import React, { useEffect, useState } from 'react'
import { Box, Button, Grid } from '@mui/material'
import { GridContainer } from '@/components/GridContainer'
import { GridDivider } from '@/components/GridDivider'
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'
import { useLoading } from '@/hooks/useLoading'
import {
	configMensajesSelector,
	getMensajesConfig,
	updateMensajeConfig,
} from '@/store/slices/mensajes'
import { ConfigSection } from './ConfigSection'
import { MensajesConfig } from '@/types/Settings/Mensajes'
import { enqueueSnackbar } from '@/store/slices/notistack'
import { nanoid } from '@reduxjs/toolkit'

export const MensajesContainer = () => {
	const dispatch = useAppDispatch()
	const { startLoading, stopLoading } = useLoading()
	const { resource, getStatus } = useAppSelector(configMensajesSelector)
	const [textFields, setTextFields] = useState<{ [key: number]: string }>({})

	// Actualizar mensajes
	const handleClick = () => {
		// Buscar items modificados
		const modifiedResource: MensajesConfig[] = []
		resource.forEach((item) => {
			const fieldValue = textFields[item.idEndTypeConversation].trim()

			// Validar cambios entre valor original y valor del formulario
			if (fieldValue.length > 0 && item.clientMessage !== fieldValue) {
				modifiedResource.push({
					...item,
					clientMessage: fieldValue,
				})
			}
		})

		// Mostrar mensaje informativo
		if (modifiedResource.length === 0) {
			dispatch(
				enqueueSnackbar({
					message: 'No se detectaron cambios',
					options: { variant: 'info' },
					key: nanoid(),
				})
			)
		}
		// Actualizar valores
		else {
			startLoading()
			Promise.all(
				modifiedResource.map((params) =>
					dispatch(updateMensajeConfig(params))
				)
			).then(stopLoading)
		}
	}

	const handleChange = (id: number, newValue: string) => {
		setTextFields((prevState) => ({
			...prevState,
			[id]: newValue,
		}))
	}

	// Manejo de evento onKeyDown para hacer salto de línea
	const handleKeyDown = (
		e: React.KeyboardEvent<HTMLDivElement>,
		id: number
	) => {
		// Nueva línea
		if (e.key === 'Enter') {
			e.preventDefault()
			handleChange(id, textFields[id] + '\r\n')
		}
	}

	useEffect(() => {
		resource.forEach((item) => {
			setTextFields((prevState) => ({
				...prevState,
				[item.idEndTypeConversation]: item.clientMessage,
			}))
		})
	}, [resource])

	useEffect(() => {
		dispatch(getMensajesConfig()).then(stopLoading)
	}, [])

	return (
		<Box>
			<GridContainer justify="flex-start">
				{/* Configuración general de mensajes */}
				<ConfigSection
					resource={resource.filter((item) => !item.fin)}
					status={getStatus}
					title="Configuración general de mensajes"
					handleChange={handleChange}
					handleKeyDown={handleKeyDown}
					textFields={textFields}
				>
					{/* Botón de actualizar (oculto en sm) */}
					<Grid
						item
						xs="auto"
						sx={{ display: { xs: 'none', sm: 'block' } }}
					>
						<Button variant="contained" onClick={handleClick}>
							Guardar cambios
						</Button>
					</Grid>
				</ConfigSection>

				{/* Divider */}
				<GridDivider my={0} />

				{/* Configuración de mensajes de finalización */}
				<ConfigSection
					resource={resource.filter((item) => item.fin)}
					status={getStatus}
					title="Configuración de mensajes de fin de conversación"
					handleChange={handleChange}
					handleKeyDown={handleKeyDown}
					textFields={textFields}
				/>

				{/* Botón de actualizar (visible en xs) */}
				<Grid
					item
					xs
					sx={{
						display: { xs: 'block', sm: 'none' },
						textAlign: 'end',
					}}
				>
					<Button variant="contained" onClick={handleClick}>
						Guardar cambios
					</Button>
				</Grid>
			</GridContainer>
		</Box>
	)
}
