import { useEffect, useState } from 'react'
import { useAppSelector } from '../useReduxHooks'
import { filterDatesSelector } from '@/store/slices/Filter'
import moment from 'moment'
import { BarChart } from '@/types/Charts'

export const useFormatChartDates = (data: BarChart[]) => {
	const { start } = useAppSelector(filterDatesSelector)
	const [step, setStep] = useState<
		'day' | 'week' | 'month' | 'year' | 'quarter'
	>('day')
	const [datesToShow, setDatesToShow] = useState<string[]>([])
	const [amount, setAmount] = useState(1)

	const len = data.length

	const setChartDates = () => {
		if (data.length === 0) {
			setDatesToShow([])
			return
		}
		setAmount(1)

		// Fecha inicial del filtro
		const startDate = moment(moment(start).format('YYYY-MM-DD'))
		const daysInMonth = moment(startDate).daysInMonth()

		// + 2 años - Intervalo semestral
		if (len > 365 * 2) {
			setStep('month')
			setAmount(6)
		}
		// +1 año - Intervalo trimestral
		else if (len > 365) {
			setStep('quarter')
			setAmount(1)
		}
		// +6 meses - Intervalo mensual
		else if (len > 364 / 2) {
			setStep('month')
			setAmount(1)
		}
		// +3 meses - Intervalo 3 semanas
		else if (len > 90) {
			setStep('week')
			setAmount(3)
		}
		// +2 meses - Intervalo quincenal
		else if (len > 60) {
			setStep('week')
			setAmount(2)
		}
		// +1 mes - Intervalo semanal
		else if (len > daysInMonth) {
			setStep('week')
			setAmount(1)
		}
		// +21 días - Intervalo 3 días
		else if (len > 21) {
			setAmount(3)
		}
		// +7 días - Intervalo 2 días
		else if (len > 7) {
			setAmount(2)
		} else {
			setAmount(1)
		}
	}

	const format = (v: string) => {
		const getValue = (v: string) => {
			if (step === 'month') {
				return v.substring(3)
			} else if (step === 'year') {
				return v.slice(-4)
			}
			return v
		}
		return datesToShow.find((val) => val === v) ? getValue(v) : ''
	}

	useEffect(() => {
		if (len === 0) return

		// Arreglo con fechas de los ejes
		const tempDates: string[] = []
		const initialDate = data[0].date.toString()

		// Tomar primera fecha como acumulador y agregar el primer intervalo
		let tempDate = moment(initialDate, 'DD/MM/YYYY')
		// console.log('STEP', step, amount)

		let i = 0
		while (i < len) {
			const formatTempDate = tempDate.format('DD/MM/YYYY')
			const dataDate = data[i].date.toString()

			if (dataDate === formatTempDate) {
				tempDates.push(dataDate)
				i += amount
			} else {
				tempDate = tempDate.add({ [step]: 1 })
			}

			// Salir de la iteración si no se encontraron más fechas en la data
			if (tempDate.isAfter(moment(dataDate, 'DD/MM/YYYY'))) {
				break
			}
		}

		setDatesToShow(tempDates)
	}, [step, amount, len])

	useEffect(() => {
		setChartDates()
	}, [data])

	return {
		// step,
		setChartDates,
		// datesToShow,
		format,
	}
}
