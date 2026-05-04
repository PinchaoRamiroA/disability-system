interface Map {
	[key: string]: string | undefined
}

export const dateDictionary: Map = {
	enero: '01',
	febrero: '02',
	marzo: '03',
	abril: '04',
	mayo: '05',
	junio: '06',
	julio: '07',
	agosto: '08',
	septiembre: '09',
	octubre: '10',
	noviembre: '11',
	diciembre: '12',
}

export function getDate(input: string) {
	const date = input.trim().split(' ')
	if (date.length !== 3) {
		return ''
	}
	const [day, localeMonth, year] = date
	const month = dateDictionary[localeMonth?.toLowerCase()]
	if (month == null) {
		return ''
	}
	return `${year}-${month}-${day}`
}

/**
 * Convierte segundos a HH:mm:ss
 * @param totalSeconds Número de segundos a convertir
 * @param indicator Indica que si el tiempo corresponde a un indicador
 */
export const secondsToTime = (totalSeconds: number, indicator = false) => {
	let hours: number | string = Math.floor(totalSeconds / 3600)
	totalSeconds %= 3600
	let minutes: number | string = Math.floor(totalSeconds / 60)
	let seconds: number | string = totalSeconds % 60

	if (indicator) {
		if (minutes < 1) {
			return `${seconds} s`
		}
		if (seconds === 0) {
			return `${minutes} min`
		}
		return `${minutes}.${seconds} min`
	} else {
		hours = hours.toString().padStart(2, '0')
		minutes = minutes.toString().padStart(2, '0')
		seconds = seconds.toString().padStart(2, '0')
		return `${hours}:${minutes}:${seconds}`
	}
}
