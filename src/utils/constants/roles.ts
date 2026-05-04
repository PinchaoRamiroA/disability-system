import { RoleObject } from '@/types/users'

export const SUPERADMIN_ROLE = 1
export const SUPERVIEWER_ROLE = 2
export const ADMIN_ROLE = 3
export const VIEWER_ROLE = 4
export const HUMAN_AGENT_ROLE = 5
export const SUPERVISOR_ROLE = 6

export const roles: RoleObject[] = [
	{ label: 'Superadministrador', role: SUPERADMIN_ROLE },
	{ label: 'Supervisualizador', role: SUPERVIEWER_ROLE },
	{ label: 'Administrador de entidad', role: ADMIN_ROLE },
	{ label: 'Visualizador de entidad', role: VIEWER_ROLE },
	{ label: 'Asesor humano', role: HUMAN_AGENT_ROLE },
	{ label: 'Supervisor de asesor humano', role: SUPERVISOR_ROLE },
]
