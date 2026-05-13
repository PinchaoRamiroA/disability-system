import List from '@mui/material/List'
import { DrawerItem } from '../DrawerItem'

const menuItems = [
	{ path: 'dashboard', label: 'Dashboard' },
	{ path: 'incapacidades', label: 'Incapacidades' },
	{ path: 'documentos', label: 'Documentos' },
	{ path: 'transcripcion', label: 'Transcripción EPS/ARL' },
	{ path: 'seguimiento', label: 'Seguimiento y Cobro' },
	{ path: 'pagos', label: 'Pagos' },
	{ path: 'conciliacion', label: 'Conciliación' },
	{ path: 'alertas', label: 'Alertas' },
	{ path: 'reportes', label: 'Reportes' },
	{ path: 'usuarios', label: 'Usuarios' },
	{ path: 'configuracion', label: 'Configuración' },
	{ path: 'auditoria', label: 'Auditoría' },
]

export const DrawerList = () => {
	return (
		<List component="nav" aria-label="barra de navegación">
			{menuItems.map((item) => (
				<DrawerItem
					key={item.path}
					path={item.path}
					label={item.label}
				/>
			))}
		</List>
	)
}