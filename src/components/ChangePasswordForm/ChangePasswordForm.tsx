import React, { useState } from 'react'
import {
	Button,
	Grid,
	IconButton,
	InputAdornment,
	TextField,
} from '@mui/material'
import { useFormik } from 'formik'
import { validate } from './validate'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { useAppDispatch } from '@/hooks/useReduxHooks'
import { updateUserPassword } from '@/store/slices/users'
import { useLoading } from '@/hooks/useLoading'

interface Props {
	showSubmitButton?: boolean
	successCallback?: () => void
}

export const ChangePasswordForm = ({
	showSubmitButton = false,
	successCallback,
}: Props) => {
	const dispatch = useAppDispatch()

	const { startLoading, stopLoading } = useLoading()
	const [showCurrentPassword, setShowCurrentPassword] = useState(false)
	const [showNewPassword, setShowNewPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)

	const formik = useFormik({
		initialValues: {
			currentPassword: '',
			newPassword: '',
			confirmationPassword: '',
		},
		validate,
		onSubmit: (values) => {
			startLoading()
			dispatch(
				updateUserPassword({
					newPassword: values.newPassword,
					oldPassword: values.currentPassword,
					callback: successCallback,
				})
			).then(() => {
				stopLoading()
				formik.setSubmitting(false)
			})
		},
	})

	return (
		<form id="change-password-form" onSubmit={formik.handleSubmit}>
			<Grid container justifyContent={'center'}>
				{/* Contraseña actual */}
				<Grid item xs={12} mb={2}>
					<TextField
						name="currentPassword"
						fullWidth
						label="Contraseña actual"
						type={showCurrentPassword ? 'text' : 'password'}
						value={formik.values.currentPassword}
						onChange={formik.handleChange}
						error={Boolean(formik.errors.currentPassword)}
						helperText={formik.errors.currentPassword}
						inputProps={{
							maxLength: 50,
						}}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<IconButton
										onClick={() =>
											setShowCurrentPassword(
												!showCurrentPassword
											)
										}
									>
										{showCurrentPassword ? (
											<VisibilityOff />
										) : (
											<Visibility />
										)}
									</IconButton>
								</InputAdornment>
							),
						}}
					/>
				</Grid>

				<Grid item xs={12} mb={2}>
					<TextField
						name="newPassword"
						fullWidth
						label="Nueva contraseña"
						type={showNewPassword ? 'text' : 'password'}
						value={formik.values.newPassword}
						onChange={formik.handleChange}
						error={Boolean(formik.errors.newPassword)}
						helperText={formik.errors.newPassword}
						inputProps={{
							maxLength: 50,
						}}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<IconButton
										onClick={() =>
											setShowNewPassword(!showNewPassword)
										}
									>
										{showNewPassword ? (
											<VisibilityOff />
										) : (
											<Visibility />
										)}
									</IconButton>
								</InputAdornment>
							),
						}}
					/>
				</Grid>

				<Grid item xs={12} mb={2}>
					<TextField
						name="confirmationPassword"
						fullWidth
						label="Confirmar contraseña"
						type={showConfirmPassword ? 'text' : 'password'}
						value={formik.values.confirmationPassword}
						onChange={formik.handleChange}
						error={Boolean(formik.errors.confirmationPassword)}
						helperText={formik.errors.confirmationPassword}
						inputProps={{
							maxLength: 50,
						}}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<IconButton
										onClick={() =>
											setShowConfirmPassword(
												!showConfirmPassword
											)
										}
									>
										{showConfirmPassword ? (
											<VisibilityOff />
										) : (
											<Visibility />
										)}
									</IconButton>
								</InputAdornment>
							),
						}}
					/>
				</Grid>

				{showSubmitButton && (
					<Button
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						disabled={!formik.isValid || formik.isSubmitting}
					>
						Actualizar contraseña
					</Button>
				)}
			</Grid>
		</form>
	)
}
