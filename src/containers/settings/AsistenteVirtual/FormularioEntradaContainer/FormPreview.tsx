import React, { useEffect, useState } from 'react'
import { useWidgetConfigSelectors } from '@/hooks/settings/useWidgetConfigSelectors'
import { useDefinePreviewWidgetTheme } from '@/hooks/useDefinePreviewWidgetTheme'
import { Box, Grid, IconButton, Paper, Typography } from '@mui/material'
import { FormEntrada } from '@/types/Settings/asistente-virtual/FormularioEntrada'
import { LogoTab } from '@/components/Settings/Customization/Preview/DashboardTabs/LogoTab'
import { RenderFieldPreview } from './RenderFieldPreview'

interface Props {
	fields: FormEntrada[][]
}

export const FormPreview = ({ fields }: Props) => {
	useWidgetConfigSelectors()
	const [currentStep, setCurrentStep] = useState<number>(1)
	const [currentField, setCurrentField] = useState<FormEntrada[]>([])

	// Estilos de personalización del widget para previsualización
	const { toolbar, widgetForm } = useDefinePreviewWidgetTheme()

	const handleSelectStep = (stepIndex: number) => {
		setCurrentStep(stepIndex + 1)
	}

	useEffect(() => {
		if (fields.length) {
			let indexStep = currentStep - 1
			indexStep = indexStep >= fields.length ? 0 : indexStep
			setCurrentField(fields[indexStep])
		}
	}, [fields, currentStep])

	return (
		<Box>
			<Paper>
				<Grid container>
					<Grid
						container
						item
						xs={12}
						p={2}
						bgcolor={toolbar.background}
						color={toolbar.color}
						height={'50%'}
						justifyContent="space-evenly"
						alignItems="center"
						flexDirection="column"
					>
						<Typography variant="h5" align="center">
							Nombre del Bot
						</Typography>
						<Box>
							<LogoTab
								borderRadius
								widget
								height={100}
								width={100}
							/>
						</Box>
						<Typography align="center" mb={4}>
							Texto descriptivo
						</Typography>
					</Grid>
					<Grid
						container
						item
						xs={12}
						p={2}
						px={5}
						justifyContent="space-evenly"
						flexDirection="column"
						height={'50%'}
					>
						<Typography textAlign="center" m={0}>
							Paso actual: {currentStep}{' '}
						</Typography>
						<Box
							display="flex"
							justifyContent="space-evenly"
							alignItems="center"
						>
							{[...Array(fields.length)].map((_, index) => (
								<IconButton
									key={index}
									sx={{
										backgroundColor: widgetForm.background,
										borderRadius: '50px',
										height: 50,
										width: 50,
										border: 3,
										borderColor: widgetForm.color,
										color: widgetForm.color,
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										mx: 3,
										':hover': {
											backgroundColor:
												widgetForm.background,
										},
									}}
									onClick={() => {
										handleSelectStep(index)
									}}
								>
									{index + 1}
								</IconButton>
							))}
						</Box>

						{/* Pasos */}
						{currentField.map((field) => (
							<Box key={field.name}>
								<RenderFieldPreview
									field={field}
									showLabel
									mode="add-remove"
								/>
							</Box>
						))}
					</Grid>
				</Grid>
			</Paper>
		</Box>
	)
}
