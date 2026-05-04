import React, { useEffect, useState } from 'react'
import { useAppDispatch } from '@/hooks/useReduxHooks'
import { loginAsync } from '@/store/slices/authentication'
import { Credentials } from '@/types/auth'
import {
	Box,
	Button,
	CircularProgress,
	IconButton,
	InputAdornment,
	TextField,
} from '@mui/material'
import { useFormik } from 'formik'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { AlertDialog } from '../Dialog'
import { useSnackbar } from 'notistack'
import axios from 'axios'

const getPublicIP = async () => {
	try {
		const { data } = await axios.get('https://api.ipify.org?format=json')
		return data.ip
	} catch (error) {
		console.error('Error fetching IP:', error)
		return null
	}
}

export const LoginForm = () => {
	const dispatch = useAppDispatch()
	const { closeSnackbar } = useSnackbar()

	const [showPass, setShowPass] = useState(false)
	const [openLocked, setOpenLocked] = useState(false) // Estado inicial del diálogo
	const [userLocked, setUserLocked] = useState(false)

	const toggleShowPass = () => setShowPass((prevValue) => !prevValue)

	const handleCloseParam = () => {
		setUserLocked(false)
		setOpenLocked(false) // Cerrar el diálogo
	}

	const validate = (values: Credentials) => {
		const errors: Partial<Credentials> = {}
		if (!values.email) {
			errors.email = 'Ingrese su usuario'
		} else if (values.email.length === 0) {
			errors.email = 'El campo está vacío'
		}

		if (!values.password) {
			errors.password = 'Ingrese la contraseña'
		} else if (values.password.length === 0) {
			errors.password = 'El campo está vacío'
		} else if (values.password.length < 6 || values.password.length > 20) {
			errors.password = 'La contraseña debe tener entre 6 y 20 caracteres'
		}

		return errors
	}

	const formik = useFormik({
		initialValues: {
			email: '',
			password: '',
			ip: '',
			userAgentData: '',
		},
		validate,
		onSubmit: async (values) => {
			const errors = validate(values)
			if (Object.keys(errors).length > 0) {
				formik.setErrors(errors)
				return
			}

			//📡 Obtener IP
			const ipAddress = await getPublicIP()

			dispatch(
				loginAsync({
					credentials: {
						...values,
						ip: ipAddress,
						userAgentData: JSON.stringify(navigator.userAgentData),
					},
					setUserLocked,
				})
			).then(() => {
				formik.setSubmitting(false)
				formik.setFieldValue('password', '')
				formik.setFieldTouched('password', false)
			})
		},
	})

	useEffect(() => {
		if (userLocked) {
			setOpenLocked(true)
		}
	}, [userLocked])

	useEffect(() => {
		// Limpiar snackbars
		closeSnackbar()
	}, [closeSnackbar])

	return (
		<>
			<Box
				component="form"
				noValidate
				sx={{ mt: 1 }}
				onSubmit={formik.handleSubmit}
			>
				<TextField
					margin="normal"
					required
					fullWidth
					id="email"
					label="Usuario"
					name="email"
					autoComplete="email"
					autoFocus
					value={formik.values.email}
					onChange={formik.handleChange}
					error={formik.touched.email && Boolean(formik.errors.email)}
					helperText={formik.touched.email && formik.errors.email}
				/>
				<TextField
					margin="normal"
					required
					fullWidth
					name="password"
					label="Contraseña"
					id="password"
					autoComplete="current-password"
					type={showPass ? 'text' : 'password'}
					value={formik.values.password}
					onChange={formik.handleChange}
					error={
						formik.touched.password &&
						Boolean(formik.errors.password)
					}
					helperText={
						formik.touched.password && formik.errors.password
					}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<IconButton onClick={toggleShowPass}>
									{showPass ? (
										<VisibilityOff />
									) : (
										<Visibility />
									)}
								</IconButton>
							</InputAdornment>
						),
					}}
				/>
				<Button
					type="submit"
					fullWidth
					variant="contained"
					sx={{ mt: 3 }}
					disabled={formik.isSubmitting}
				>
					INGRESAR
					{formik.isSubmitting && (
						<CircularProgress
							size={15}
							thickness={5}
							sx={{ ml: 1 }}
						/>
					)}
				</Button>
			</Box>
			<AlertDialog
				open={openLocked}
				title="Se ha superado el número máximo de intentos"
				onClose={handleCloseParam}
			>
				El usuario ha sido bloqueado. Por favor, póngase en contacto con
				el administrador.
			</AlertDialog>
		</>
	)
}
