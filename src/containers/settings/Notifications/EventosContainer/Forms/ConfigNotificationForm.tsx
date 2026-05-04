import { ConfirmationModal } from '@/components/Dialog'
import {
	upsertNotificationTemplate,
	ListTemplates,
	getNotificaciones,
} from '@/store/slices/notifications'
import { UpsertTemplateParams } from '@/types/Notificaciones'
import {
	Box,
	Button,
	MenuItem,
	Snackbar,
	TextField,
	Tooltip,
} from '@mui/material'
import MuiAlert, { AlertProps } from '@mui/material/Alert'
import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { addSnackbarKey } from '@/utils/helpers/enqueueSnackbar'
import * as snackbars from '@/utils/constants/snackbars/user'
import { enqueueSnackbar } from '@/store/slices/notistack/actions'
import { useCompanyAndIdVa } from '@/hooks/useCompanyAndIdVa'

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
	props,
	ref
) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

export const ConfigNotificationForm = () => {
	const dispatch = useDispatch()
	const [open, setOpen] = useState(false)
	const [selectedOption, setSelectedOption] = useState('')
	const [typeEvent, setTypeEvent] = useState('')
	const [codeTemplate, setCodeTemplate] = useState('')
	const [bodySms, setBodySms] = useState('')
	const [error, setError] = useState(false)
	const [showDropdown, setShowDropdown] = useState(true)
	const [option, setOption] = useState('')
	const [templateData, setTemplateData] = useState<
		{ code_template: string; message: string }[]
	>([])
	const [snackbarOpen, setSnackbarOpen] = useState(false)
	const [snackbarMessage, setSnackbarMessage] = useState('')
	const [snackbarVariant, setSnackbarVariant] = useState<'success' | 'error'>(
		'success'
	)
	const { idOrg } = useCompanyAndIdVa()

	useEffect(() => {
		if (selectedOption) {
			ListTemplates(selectedOption, idOrg)
				.then((response) => setTemplateData(response))
				.catch((error) =>
					console.error('Error al obtener plantillas:', error)
				)
		}
	}, [selectedOption])

	const FuncionalidadNuevaOExistente = () => {
		setShowDropdown(!showDropdown)
		setBodySms('') // Limpiar campo de bodySms
	}

	const handleSaveChanges = async () => {
		// Validar que todos los campos requeridos estén llenos
		if (!selectedOption || !typeEvent || (!codeTemplate && !option)) {
			setError(true)
			return
		}

		const upsertParams: UpsertTemplateParams = {
			companyId: idOrg,
			eventType: typeEvent,
			TypeNotification: selectedOption,
			codeTemplate: codeTemplate || option,
			BodySms: selectedOption === 'SMS' ? bodySms : '',
		}

		try {
			await upsertNotificationTemplate(upsertParams)
			await dispatch(getNotificaciones(idOrg))
			dispatch(
				enqueueSnackbar(addSnackbarKey(snackbars.CreateEventSuccess))
			)
			handleReset() // Resetear los campos después de guardar
		} catch (error) {
			console.error('Error al guardar cambios:', error)
			setSnackbarMessage('Error al guardar cambios')
			setSnackbarVariant('error')
			setSnackbarOpen(true)
		}
	}

	const handleReset = () => {
		setOpen(false)
		setError(false)
		// Limpiar los campos
		setSelectedOption('')
		setTypeEvent('')
		setCodeTemplate('')
		setBodySms('')
		setOption('')
		setShowDropdown(true)
		setTemplateData([])
	}

	const handleChange = async (
		event: React.ChangeEvent<{ value: unknown }>
	) => {
		const value = event.target.value as string
		setSelectedOption(value)
		if (value !== 'WHATSAPP') {
			setShowDropdown(false)
		} else {
			setShowDropdown(true)
		}
		if (value !== '') {
			try {
				const response = await ListTemplates(value, idOrg)
				setTemplateData(response)
			} catch (error) {
				console.error('Error al obtener plantillas:', error)
			}
		}
	}

	const handleOptionChange = (
		event: React.ChangeEvent<{ value: unknown }>
	) => {
		const value = event.target.value as string
		setOption(value)
		const selectedTemplate = templateData.find(
			(template) => template.code_template === value
		)
		if (selectedTemplate) {
			setBodySms(selectedTemplate.message)
		}
	}

	const handleSnackbarClose = (
		event?: React.SyntheticEvent,
		reason?: string
	) => {
		if (reason === 'clickaway') {
			return
		}
		setSnackbarOpen(false)
	}

	return (
		<>
			<Button
				sx={{ ml: 2, display: 'block', flexShrink: 0 }}
				color="secondary"
				variant="contained"
				onClick={() => setOpen(true)}
			>
				Crear
			</Button>
			<ConfirmationModal
				confirmAction={handleSaveChanges}
				handleClose={handleReset}
				open={open}
				title="Crear Plantilla"
			>
				<Box display={'flex'} flexDirection={'column'} gap={2}>
					<TextField
						autoFocus
						margin="normal"
						name="typeNotification"
						label="Tipo de notificacion"
						select
						value={selectedOption}
						onChange={handleChange}
						error={error && !selectedOption}
						helperText={
							error &&
							!selectedOption &&
							'Debe seleccionar un tipo de notificación'
						}
					>
						<MenuItem value="EMAIL">Email</MenuItem>
						<MenuItem value="SMS">SMS</MenuItem>
						<MenuItem value="WHATSAPP">Whatsapp</MenuItem>
					</TextField>
					<TextField
						sx={{
							marginTop: -1,
						}}
						margin="normal"
						name="typeEvent"
						label="Tipo de evento"
						value={typeEvent}
						onChange={(e) => setTypeEvent(e.target.value)}
						error={error && !typeEvent}
						helperText={
							error && !typeEvent && 'Este campo es requerido'
						}
					/>
				</Box>
				<Box
					display="flex"
					flexDirection="row"
					alignItems="center"
					gap={2}
					width="100%"
				>
					{showDropdown ? (
						<TextField
							sx={{ flex: 1, marginTop: 1 }}
							value={option}
							select
							label="Codigo de plantilla"
							onChange={handleOptionChange}
							error={error && !option}
							helperText={
								error && !option && 'Este campo es requerido'
							}
							SelectProps={{
								MenuProps: {
									PaperProps: {
										style: {
											maxHeight: 200, // Altura máxima de la lista
											width: '30%', // Ancho de la lista
										},
									},
								},
							}}
						>
							{templateData.map((template, index) => (
								<MenuItem
									key={index}
									value={template.code_template}
								>
									{template.code_template}
								</MenuItem>
							))}
						</TextField>
					) : (
						<TextField
							sx={{ flex: 1 }}
							margin="normal"
							name="codeTemplate"
							label="Codigo de plantilla"
							value={codeTemplate}
							onChange={(e) => setCodeTemplate(e.target.value)}
							error={error && !codeTemplate}
							helperText={
								error &&
								!codeTemplate &&
								'Este campo es requerido'
							}
							InputProps={{
								inputProps: {
									maxLength: 50,
								},
							}}
						/>
					)}
					<Tooltip
						title={
							showDropdown
								? 'Crear una nueva plantilla: te permite tener un mensaje personalizado, Para los canales Email y WhatsApp es necesario que la plantilla exista en los proveedores.'
								: 'Seleccionar una plantilla existente: te permitirá reutilizar una plantilla ya existente.'
						}
						placement="right-start"
					>
						<Button
							color="secondary"
							variant="contained"
							onClick={FuncionalidadNuevaOExistente}
						>
							{showDropdown ? 'nuevo' : 'Existente'}
						</Button>
					</Tooltip>
				</Box>
				{selectedOption === 'SMS' && (
					<TextField
						multiline
						rows={4}
						margin="normal"
						name="bodySms"
						label="Cuerpo del SMS"
						value={bodySms}
						onChange={(e) => setBodySms(e.target.value)}
						error={error && !bodySms}
						helperText={
							error && !bodySms && 'Este campo es requerido'
						}
						sx={{ width: '100%' }}
						// InputProps={{
						// 	inputProps: {
						// 		maxLength: 1000,
						// 	},
						// }}
					/>
				)}
			</ConfirmationModal>
			<Snackbar open={snackbarOpen} autoHideDuration={6000}>
				<Alert onClose={handleSnackbarClose} severity={snackbarVariant}>
					{snackbarMessage}
				</Alert>
			</Snackbar>
		</>
	)
}
