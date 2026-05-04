import React, { useEffect, useState } from 'react'
import { FormDialog } from '@/components/Dialog/styles'
import { NormalizedUser, RoleObject } from '@/types/users'
import { IconButton, InputAdornment, MenuItem, TextField } from '@mui/material'
import { useFormik } from 'formik'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import {
	ADMIN_ROLE,
	HUMAN_AGENT_ROLE,
	roles,
	SUPERADMIN_ROLE,
	SUPERVIEWER_ROLE,
} from '@/utils/constants/roles'
import { useAppSelector } from '@/hooks/useReduxHooks'
import { companiesSelector } from '@/store/slices/companies'
import { userSelector } from '@/store/slices/authentication'
import { AlertDialog } from '@/components/Dialog'
import { validate } from './validate'

interface Props {
	open: boolean
	user: Partial<NormalizedUser>
	confirmAction: (company: Partial<NormalizedUser>) => void
	cancelAction: (company?: Partial<NormalizedUser>) => void
	confirmText?: string
	cancelText?: string
	isCreateForm?: boolean
	isAgentCreate?: boolean
	isAgentUpdate?: boolean
	hideRoleList?: boolean
}

export const UserForm = ({
	open,
	user,
	confirmAction,
	cancelAction,
	confirmText = 'Confirmar',
	cancelText = 'Cancelar',
	isCreateForm,
	isAgentCreate,
	isAgentUpdate,
	hideRoleList,
}: Props) => {
	const [showPassword, setShowPassword] = useState(false)

	const { getStatus, resource } = useAppSelector(companiesSelector)
	const { role: adminRole, company: adminCompany } =
		useAppSelector(userSelector)

	const formik = useFormik({
		validateOnChange: false,
		validateOnBlur: false,
		initialValues: isCreateForm
			? {
					company: adminRole === SUPERADMIN_ROLE ? 0 : adminCompany,
					role: isAgentCreate || isAgentUpdate ? HUMAN_AGENT_ROLE : 0,
					email: '',
					fullName: '',
					password: '',
			  }
			: { ...user },
		validate: (values) => validate(values, isCreateForm),
		onSubmit: (values) => {
			values.fullName = values.fullName?.trim()
			values.email = values.email?.trim()
			values.password = values.password?.trim()

			// Evitar envío de nombre de usuario y contraseña cuando el formulario es de edición
			if (!isCreateForm) {
				delete values.email
				if (!values.password) {
					delete values.password
				}
			}

			confirmAction(values)
		},
	})

	const handleClickShowPassword = () => {
		setShowPassword(!showPassword)
	}

	const handleMouseDownPassword = (
		event: React.MouseEvent<HTMLButtonElement>
	) => {
		event.preventDefault()
	}

	const filterRoles = ({ role }: RoleObject) => {
		if (adminRole === SUPERADMIN_ROLE) {
			return [SUPERVIEWER_ROLE, ADMIN_ROLE].includes(role)
		} else if (adminRole === ADMIN_ROLE) {
			return role >= ADMIN_ROLE
		}
		return false
	}

	const customOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const isSuperAdmin = adminRole === SUPERADMIN_ROLE
		const hasChangedToSuperviewerRole =
			Number(e.target.value) === SUPERVIEWER_ROLE
		const isSameCompany = formik.values.company === adminCompany

		if (isSuperAdmin) {
			if (hasChangedToSuperviewerRole) {
				formik.setFieldValue('company', adminCompany)
			} else if (isSameCompany) {
				formik.setFieldValue('company', user.company)
			}
		}

		formik.handleChange(e)
	}

	// Limpiar formulario cuando se cierra el popup
	useEffect(() => {
		if (!open) {
			formik.resetForm()
		}
	}, [open])

	return (
		<AlertDialog
			open={open}
			title={isCreateForm ? 'Crear usuario' : 'Actualizar usuario'}
			confirmButtonText={confirmText}
			closeButtonText={cancelText}
			onClose={cancelAction}
			formikFormId="create-user-form"
			submitting={getStatus === 'pending' || getStatus === 'rejected'}
		>
			<FormDialog onSubmit={formik.handleSubmit} id="create-user-form">
				<TextField
					id="fullName"
					name="fullName"
					type="text"
					onChange={formik.handleChange}
					value={formik.values.fullName}
					error={Boolean(formik.errors.fullName)}
					label="Nombre completo"
					placeholder="Nombre completo"
					variant="outlined"
					helperText={formik.errors.fullName}
					inputProps={{
						maxLength: 200,
					}}
				/>
				<TextField
					id="email"
					name="email"
					type="text"
					onChange={formik.handleChange}
					value={formik.values.email}
					helperText={formik.errors.email}
					error={Boolean(formik.errors.email)}
					label="Nombre de usuario"
					placeholder="Nombre de usuario"
					variant="outlined"
					inputProps={{
						maxLength: 100,
					}}
					disabled={!isCreateForm}
				/>
				<TextField
					id="password"
					name="password"
					type={showPassword ? 'text' : 'password'}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					value={formik.values.password}
					helperText={
						formik.touched.password && formik.errors.password
					}
					error={
						formik.touched.password &&
						Boolean(formik.errors.password)
					}
					label="Contraseña"
					placeholder="Contraseña"
					variant="outlined"
					InputProps={{
						autoComplete: 'new-password',
						endAdornment: (
							<InputAdornment sx={{ mr: 2 }} position="end">
								<IconButton
									aria-label="Palanca de cambio de visibilidad de la contraseña"
									onClick={handleClickShowPassword}
									onMouseDown={handleMouseDownPassword}
									edge="end"
								>
									{!showPassword ? (
										<VisibilityOff />
									) : (
										<Visibility />
									)}
								</IconButton>
							</InputAdornment>
						),
						inputProps: {
							maxLength: 50,
						},
					}}
				/>
				{/* Selección de rol: Se muestra en modo de creación o en modo de edición del administrador */}
				{!hideRoleList && (
					<TextField
						id="role"
						name="role"
						select
						label="Rol"
						placeholder="Selecciona un rol"
						onChange={customOnChange}
						value={formik.values.role}
						helperText={formik.errors.role}
						error={Boolean(formik.errors.role)}
					>
						<MenuItem value={0}>{'Seleccione un rol'}</MenuItem>
						{roles.filter(filterRoles).map((option) => (
							<MenuItem
								key={option.role}
								value={option.role}
								className="role-options"
							>
								{option.label}
							</MenuItem>
						))}
					</TextField>
				)}

				{/* Selección de compañía: Se muestra cuando el usuario es superadministrador y el rol seleccionado no es supervisualizador */}
				{adminRole === SUPERADMIN_ROLE &&
					formik.values.role !== SUPERVIEWER_ROLE && (
						<TextField
							id="company"
							name="company"
							select
							label="Compañía"
							placeholder="Selecciona una compañía"
							onChange={formik.handleChange}
							value={formik.values.company}
							helperText={formik.errors.company}
							error={Boolean(formik.errors.company)}
							disabled={
								getStatus === 'pending' ||
								getStatus === 'rejected'
							}
						>
							<MenuItem value={0}>
								{getStatus === 'rejected'
									? 'Error al cargar compañías'
									: 'Selecciona una compañía'}
							</MenuItem>
							{resource.map((option) => (
								<MenuItem key={option.id} value={option.idOrg}>
									{option.name}
								</MenuItem>
							))}
						</TextField>
					)}
			</FormDialog>
		</AlertDialog>
	)
}
