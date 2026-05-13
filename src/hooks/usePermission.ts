import { useSelector } from 'react-redux'
import { selectAuth } from '@/store/slices/authentication/selectors'

export type Permission =
	| 'crear_incapacidad'
	| 'editar_incapacidad'
	| 'consultar_incapacidad'
	| 'validar_documentos'
	| 'rechazar_documentos'
	| 'registrar_pago'
	| 'consultar_reportes'
	| 'gestionar_usuarios'
	| 'gestionar_roles'
	| 'generar_alertas'
	| 'consultar_historial'
	| 'realizar_conciliacion'
	| 'gestionar_cobro_persuasivo'
	| 'gestionar_cobro_juridico'
	| 'archivar_incapacidad'

export const ROLES_PERMITIDOS_REGISTRO_USUARIOS = [
	'Administrador',
	'Gerencia',
	'Gestión Humana',
]

export const usePermission = () => {
	const { permisos, role } = useSelector(selectAuth)

	const hasPermission = (permission: Permission): boolean => {
		return permisos.includes(permission)
	}

	const hasAnyPermission = (permissions: Permission[]): boolean => {
		return permissions.some((p) => permisos.includes(p))
	}

	const canRegisterUsers = (): boolean => {
		return ROLES_PERMITIDOS_REGISTRO_USUARIOS.includes(role || '')
	}

	const canManageRoles = (): boolean => {
		return (
			hasPermission('gestionar_usuarios') ||
			hasPermission('gestionar_roles')
		)
	}

	return {
		permisos,
		role,
		hasPermission,
		hasAnyPermission,
		canRegisterUsers,
		canManageRoles,
	}
}