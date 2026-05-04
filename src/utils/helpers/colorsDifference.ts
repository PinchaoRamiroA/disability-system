import {
	Color,
	Colores,
	UpdateColores,
} from '@/types/Settings/General/Dashboard'

export const dashboardColorsDifference = (
	original: Colores,
	modificado: Colores
): UpdateColores => {
	const res: UpdateColores = {}

	const differ = (color1: Color, color2: Color) => {
		return (
			color1.background !== color2.background ||
			color1.color !== color2.color
		)
	}

	// Diferencias header
	if (differ(original.header, modificado.header)) {
		res.header = modificado.header
	}
	// Diferencias color principal
	if (differ(original.principal, modificado.principal)) {
		res.principal = modificado.principal
	}
	// Diferencias color secundario
	if (differ(original.secundario, modificado.secundario)) {
		res.secundario = modificado.secundario
	}
	// Diferencias color asesor humano - header
	if (differ(original.asesorHumano.header, modificado.asesorHumano.header)) {
		res.asesorHumano = {
			header: modificado.asesorHumano.header,
		}
	}
	// Diferencias color asesor humano - mensajes asesor
	if (
		differ(
			original.asesorHumano.mensajeAsesor,
			modificado.asesorHumano.mensajeAsesor
		)
	) {
		res.asesorHumano = {
			...res.asesorHumano,
			mensajeAsesor: modificado.asesorHumano.mensajeAsesor,
		}
	}
	// Diferencias color asesor humano - mensajes cliente
	if (
		differ(
			original.asesorHumano.mensajeCliente,
			modificado.asesorHumano.mensajeCliente
		)
	) {
		res.asesorHumano = {
			...res.asesorHumano,
			mensajeCliente: modificado.asesorHumano.mensajeCliente,
		}
	}
	// Diferencias color asesor humano - footer
	const footer1 = original.asesorHumano.footer
	const footer2 = modificado.asesorHumano.footer
	if (
		differ(
			{ background: footer1.background, color: footer1.iconsColor },
			{ background: footer2.background, color: footer2.iconsColor }
		)
	) {
		res.asesorHumano = {
			...res.asesorHumano,
			footer: modificado.asesorHumano.footer,
		}
	}

	return res
}
