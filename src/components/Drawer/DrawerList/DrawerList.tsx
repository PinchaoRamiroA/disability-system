import List from '@mui/material/List'
import { DrawerItem } from '../DrawerItem'
import { usePermission, Permission } from '@/hooks/usePermission'

interface MenuItem {
	path: string
	label: string
	permiso: Permission
}

const menuItems: MenuItem[] = [
	{ path: 'dashboard', label: 'Dashboard', permiso: 'consultar_incapacidad' },
	{ path: 'incapacidades', label: 'Incapacidades', permiso: 'consultar_incapacidad' },
	{ path: 'documentos', label: 'Documentos', permiso: 'consultar_incapacidad' },
	{ path: 'transcripcion', label: 'Transcripción EPS/ARL', permiso: 'consultar_incapacidad' },
	{ path: 'seguimiento', label: 'Seguimiento y Cobro', permiso: 'gestionar_cobro_persuasivo' },
	{ path: 'pagos', label: 'Pagos', permiso: 'registrar_pago' },
	{ path: 'conciliacion', label: 'Conciliación', permiso: 'realizar_conciliacion' },
	{ path: 'alertas', label: 'Alertas', permiso: 'consultar_incapacidad' },
	{ path: 'reportes', label: 'Reportes', permiso: 'consultar_reportes' },
	{ path: 'usuarios', label: 'Usuarios', permiso: 'gestionar_usuarios' },
	{ path: 'configuracion', label: 'Configuración', permiso: 'gestionar_usuarios' },
	{ path: 'auditoria', label: 'Auditoría', permiso: 'gestionar_usuarios' },
]

export const DrawerList = () => {
	const { hasPermission } = usePermission()

	const visibleItems = menuItems.filter((item) =>
		hasPermission(item.permiso)
	)

	return (
		<List component="nav" aria-label="barra de navegación">
			{visibleItems.map((item) => (
				<DrawerItem
					key={item.path}
					path={item.path}
					label={item.label}
				/>
			))}
		</List>
	)
}