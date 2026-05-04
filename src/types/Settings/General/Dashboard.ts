export interface DashboardConfig {
	colores: Colores
	fuente: Fuente
}

export type Color = {
	background: string
	color: string
}

export interface AsesorHumano {
	header: Color
	mensajeAsesor: Color
	mensajeCliente: Color
	footer: {
		background: string
		iconsColor: string
	}
}

export interface ColoresSinAsesorHumano {
	header: Color
	principal: Color
	secundario: Color
}

export interface Colores extends ColoresSinAsesorHumano {
	asesorHumano: AsesorHumano
}

export interface Fuente {
	family: string
	category: string
	variant: string
}

export interface GetDashboardConfig {
	idOrg: number
}

export type UpdateColores = Partial<ColoresSinAsesorHumano> & {
	asesorHumano?: Partial<AsesorHumano>
}
export interface UpdateDashboardConfigPayload {
	colores?: Partial<UpdateColores>
	fuente?: Fuente
}

export interface UpdateDashboardConfig {
	idOrg: number
	payload: UpdateDashboardConfigPayload
}

export interface UpdateDashboardLogo {
	idOrg: number
	payload: {
		nameImage: string
	}
}

export interface UpdateDashboardLogoResponse {
	Imagen: string
}

export interface LogoType {
	url: string
	file: File | null
}

export interface IsWidgetConfig {
	widget?: boolean
}
