import React, { useEffect, useState } from 'react'
import {
	DialogContent,
	Button,
	TextField,
	MenuItem,
	Snackbar,
	Box,
} from '@mui/material'
import MuiAlert, { AlertProps } from '@mui/material/Alert'
import { EventsConfig, UpsertTemplateParams } from '@/types/Notificaciones'
import {
	upsertNotificationTemplate,
	ListTemplates,
	getNotificaciones,
} from '@/store/slices/notifications'
import { enqueueSnackbar } from '@/store/slices/notistack/actions'
import { addSnackbarKey } from '@/utils/helpers/enqueueSnackbar'
import * as snackbars from '@/utils/constants/snackbars/user'
import { useDispatch } from 'react-redux'
import { ConfirmationModal } from '@/components/Dialog/ConfirmationModal'
import { useCompanyAndIdVa } from '@/hooks/useCompanyAndIdVa'

interface ConfigNotificationFormUpdateProps {
	open: boolean
	notification: EventsConfig
	handleClose: () => void
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
	props,
	ref
) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

export const ConfigNotificationFormUpdate: React.FC<
	ConfigNotificationFormUpdateProps
> = ({ open, notification, handleClose }) => {
	const dispatch = useDispatch()

	const initialFormData: EventsConfig = {
		type_notifications: notification.type_notifications || '',
		type_event: notification.type_event || '',
		code_template: notification.code_template || '',
		message: notification.message || '',
		id: notification.id,
	}
	const [formData, setFormData] = useState<EventsConfig>(initialFormData)
	const [bodySms, setBodySms] = useState<string>(notification.message || '')
	const [error, setError] = useState<{ [key: string]: boolean }>({})
	const [openSnack, setOpenSnack] = useState<boolean>(false)
	const [codeTemplate, setCodeTemplate] = useState(
		notification.code_template || ''
	)
	const [templateData, setTemplateData] = useState<
		{ code_template: string; message: string }[]
	>([])
	const [showDropdown, setShowDropdown] = useState(false)
	const [selectedOption, setSelectedOption] = useState(
		notification.type_notifications || ''
	)
	const [snackbarMessage, setSnackbarMessage] = useState<string>('')
	const [snackbarVariant, setSnackbarVariant] = useState<'success' | 'error'>(
		'success'
	)
	const [buttonText, setButtonText] = useState('Existente')
	const { idOrg } = useCompanyAndIdVa()
	useEffect(() => {
		setFormData(notification)
		setBodySms(notification.message || '')
		setCodeTemplate(notification.code_template)
		setSelectedOption(notification.type_notifications)
	}, [notification])

	useEffect(() => {
		if (selectedOption) {
			ListTemplates(selectedOption, idOrg)
				.then((response) => setTemplateData(response))
				.catch((error) =>
					console.error('Error al obtener plantillas:', error)
				)
		}
	}, [selectedOption])

	const handleChange = async (
		event: React.ChangeEvent<{ value: unknown }>
	) => {
		const value = event.target.value as string
		setSelectedOption(value)
		setFormData({ ...formData, type_notifications: value })

		if (value === 'WHATSAPP') {
			setShowDropdown(true)
		} else {
			setShowDropdown(false)
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

	const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData({ ...formData, [name]: value })
	}

	const handleSmsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setBodySms(e.target.value)
	}

	const handleCodeTemplateChange = (
		e: React.ChangeEvent<{ value: unknown }>
	) => {
		const value = e.target.value as string
		setCodeTemplate(value)
		const selectedTemplate = templateData.find(
			(template) => template.code_template === value
		)
		if (selectedTemplate) {
			setBodySms(selectedTemplate.message)
		}
	}

	const handleConfirmUpdate = async () => {
		const newError = {
			type_notifications: !selectedOption,
			type_event: !formData.type_event,
			code_template: selectedOption !== 'WHATSAPP' && !codeTemplate,
			BodySms: selectedOption === 'SMS' && !bodySms,
		}
		setError(newError)

		if (Object.values(newError).some((e) => e)) {
			setSnackbarMessage(
				'Todos los campos son requeridos y el código de plantilla no debe estar vacío.'
			)
			setSnackbarVariant('error')
			setOpenSnack(true)
			return
		}
		const updatedNotification: UpsertTemplateParams = {
			companyId: idOrg,
			id: formData.id,
			eventType: formData.type_event,
			TypeNotification: selectedOption,
			codeTemplate: codeTemplate || formData.code_template,
			BodySms: selectedOption === 'SMS' ? bodySms : undefined,
		}

		try {
			await upsertNotificationTemplate(updatedNotification)
			dispatch(getNotificaciones(idOrg))
			dispatch(
				enqueueSnackbar(addSnackbarKey(snackbars.UpdateEventSuccess))
			)
			resetForm()
			handleClose()
		} catch (error) {
			console.error('Error al actualizar la notificación:', error)
			setSnackbarMessage('Error al actualizar la notificación')
			setSnackbarVariant('error')
			setOpenSnack(true)
		}
	}

	const resetForm = () => {
		setFormData(initialFormData)
		setBodySms('')
		setCodeTemplate('')
		setSelectedOption('')
		setError({})
		setShowDropdown(false)
		setButtonText('Existente')
	}

	const handleCloseAlert = () => {
		setOpenSnack(false)
	}

	const FuncionalidadNuevaOExistente = () => {
		setShowDropdown(!showDropdown)
		setButtonText(buttonText === 'Existente' ? 'Nuevo' : 'Existente')
	}

	return (
		<ConfirmationModal
			open={open}
			handleClose={() => {
				resetForm()
				handleClose()
			}}
			confirmAction={handleConfirmUpdate}
			title="Actualizar Notificación"
		>
			<DialogContent>
				<TextField
					autoFocus
					margin="dense"
					label="Tipo Notificación"
					name="type_notifications"
					value={selectedOption}
					onChange={handleChange}
					fullWidth
					select
					error={!!error.type_notifications}
					helperText={
						error.type_notifications &&
						'Debe seleccionar un tipo de notificación'
					}
				>
					<MenuItem value="EMAIL">Email</MenuItem>
					<MenuItem value="SMS">SMS</MenuItem>
					<MenuItem value="WHATSAPP">Whatsapp</MenuItem>
				</TextField>
				<TextField
					margin="dense"
					label="Tipo Evento"
					name="type_event"
					value={formData.type_event}
					onChange={handleFieldChange}
					fullWidth
					error={!!error.type_event}
					helperText={error.type_event && 'Este campo es requerido'}
				/>
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
							value={codeTemplate}
							name="codeTemplate"
							select
							label="Código de plantilla"
							onChange={handleCodeTemplateChange}
							error={!!error.code_template}
							helperText={
								error.code_template && 'Este campo es requerido'
							}
							SelectProps={{
								MenuProps: {
									PaperProps: {
										style: {
											maxHeight: 200,
											width: '30%',
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
							onChange={handleCodeTemplateChange}
							error={!!error.code_template}
							helperText={
								error.code_template && 'Este campo es requerido'
							}
							InputProps={{
								inputProps: {
									maxLength: 50,
								},
							}}
						/>
					)}

					<Button
						color="secondary"
						variant="contained"
						onClick={FuncionalidadNuevaOExistente}
					>
						{buttonText}
					</Button>
				</Box>

				{selectedOption === 'SMS' && (
					<TextField
						multiline
						rows={4}
						margin="normal"
						name="bodySms"
						label="Cuerpo del SMS"
						value={bodySms}
						onChange={handleSmsChange}
						error={!!error.bodySms}
						helperText={error.bodySms && 'Este campo es requerido'}
						fullWidth
						// InputProps={{
						// 	inputProps: {
						// 		maxLength: 1000,
						// 	},
						// }}
					/>
				)}
			</DialogContent>
			<Snackbar
				open={openSnack}
				autoHideDuration={6000}
				onClose={handleCloseAlert}
			>
				<Alert onClose={handleCloseAlert} severity={snackbarVariant}>
					{snackbarMessage}
				</Alert>
			</Snackbar>
		</ConfirmationModal>
	)
}
