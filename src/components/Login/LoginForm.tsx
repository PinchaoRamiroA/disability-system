import React, { useState } from 'react'
import { Box, Button, TextField } from '@mui/material'
import { useSnackbar } from 'notistack'
import { useAppDispatch } from '@/hooks/useReduxHooks'
import { thunkLogin } from '@/store/slices/authentication'
import { useRouter } from 'next/router'

interface FormValues {
	email: string
	password: string
}

export const LoginForm = () => {
	const dispatch = useAppDispatch()
	const router = useRouter()
	const { enqueueSnackbar } = useSnackbar()
	const [loading, setLoading] = useState(false)
	const [values, setValues] = useState<FormValues>({ email: '', password: '' })
	const [errors, setErrors] = useState<FormValues>({ email: '', password: '' })

	const validate = (): boolean => {
		const newErrors: FormValues = { email: '', password: '' }
		if (!values.email) newErrors.email = 'Email requerido'
		else if (!/\S+@\S+\.\S+/.test(values.email)) newErrors.email = 'Email inválido'
		if (!values.password) newErrors.password = 'Contraseña requerida'
		setErrors(newErrors)
		return !newErrors.email && !newErrors.password
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!validate()) return

		setLoading(true)
		try {
			await dispatch(thunkLogin({ email: values.email, password: values.password })).unwrap()
			router.push('/dashboard')
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : 'Error de autenticación'
			enqueueSnackbar(message, { variant: 'error' })
		} finally {
			setLoading(false)
		}
	}

	return (
		<Box component="form" onSubmit={handleSubmit}>
			<TextField
				fullWidth
				margin="normal"
				name="email"
				label="Email"
				value={values.email}
				onChange={(e) => setValues({ ...values, email: e.target.value })}
				error={!!errors.email}
				helperText={errors.email}
			/>
			<TextField
				fullWidth
				margin="normal"
				name="password"
				type="password"
				label="Contraseña"
				value={values.password}
				onChange={(e) => setValues({ ...values, password: e.target.value })}
				error={!!errors.password}
				helperText={errors.password}
			/>
			<Button
				fullWidth
				variant="contained"
				color="primary"
				type="submit"
				disabled={loading}
				sx={{ mt: 2 }}
			>
				{loading ? 'Ingresando...' : 'Iniciar Sesión'}
			</Button>
		</Box>
	)
}