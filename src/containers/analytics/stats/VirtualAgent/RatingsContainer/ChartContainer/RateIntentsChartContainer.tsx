import React, { useEffect, useState } from 'react'
import { RateIntentsChart } from './RateIntentsChart'
import { BarChart } from '@/types/Charts'
import moment from 'moment'
import { IntentsTimeRating } from '@/types/Statistics/VirtualAgent/Calificaciones'
import { Status } from '@/types/status'
import { RenderChart } from '@/components/Charts/RenderChart'

interface Props {
	resource: IntentsTimeRating[]
	status: Status
}

const star = '⭐'
const thumbUp = '👍'
const thumbDown = '👎'
const rate1 = star
const rate2 = star.repeat(2)
const rate3 = star.repeat(3)
const rate4 = star.repeat(4)
const rate5 = star.repeat(5)
const ratingStars = [rate1, rate2, rate3, rate4, rate5]

export const RateIntentsChartContainer = ({ resource, status }: Props) => {
	const [data, setData] = useState<BarChart[]>([])
	const [keys, setKeys] = useState<string[]>([])

	const formatData = () => {
		// Data y keys
		const tempData: BarChart[] = []
		const tempKeys: string[] = []
		// Indica que se deben mostrar iconos de manito arriba y abajo ya que la data solo tiene calificaciones de 1 y 5 estrellas
		let thumbsUpAndDown = true

		// Primera iteración: Sumar los valores totales
		const genSumForKeys = [...Array(5).fill(0)]

		resource.forEach((el) => {
			el.details.forEach((detail) => {
				genSumForKeys[0] += detail.rating1
				genSumForKeys[1] += detail.rating2
				genSumForKeys[2] += detail.rating3
				genSumForKeys[3] += detail.rating4
				genSumForKeys[4] += detail.rating5
			})
		})

		// Segunda iteración: Validar si se deben mostrar estrellas o pulgares (revisando totales de calificaciones de 2 a 4 estrellas)
		for (let i = 1; i < 4; i++) {
			if (genSumForKeys[i] > 0) {
				thumbsUpAndDown = false
				break
			}
		}

		// Tercera iteración: Crear los datos del gráfico
		resource.forEach((el) => {
			const obj: BarChart = {}
			obj.date = moment(el.date).format('DD/MM/YYYY')
			let sumRate1 = 0
			let sumRate2 = 0
			let sumRate3 = 0
			let sumRate4 = 0
			let sumRate5 = 0

			let idRate1: number[] = []
			let idRate2: number[] = []
			let idRate3: number[] = []
			let idRate4: number[] = []
			let idRate5: number[] = []

			// Separar valores positivos y negativos y contar máximos de la gráfica
			el.details.forEach((detail) => {
				sumRate1 += detail.rating1
				sumRate2 += detail.rating2
				sumRate3 += detail.rating3
				sumRate4 += detail.rating4
				sumRate5 += detail.rating5

				idRate1 = idRate1.concat(detail.convs1)
				idRate2 = idRate2.concat(detail.convs2)
				idRate3 = idRate3.concat(detail.convs3)
				idRate4 = idRate4.concat(detail.convs4)
				idRate5 = idRate5.concat(detail.convs5)
			})
			obj[thumbsUpAndDown ? thumbDown : rate1] = sumRate1
			obj[rate2] = sumRate2
			obj[rate3] = sumRate3
			obj[rate4] = sumRate4
			obj[thumbsUpAndDown ? thumbUp : rate5] = sumRate5
			obj.idRate1 = idRate1.join(',')
			obj.idRate2 = idRate2.join(',')
			obj.idRate3 = idRate3.join(',')
			obj.idRate4 = idRate4.join(',')
			obj.idRate5 = idRate5.join(',')

			// Agregar object a la data del día iterado
			tempData.push(obj)
		})

		// Definir las keys basadas en los totales
		if (thumbsUpAndDown) {
			tempKeys.push(thumbDown, thumbUp)
		} else {
			ratingStars.forEach((rate, index) => {
				if (genSumForKeys[index] > 0) {
					tempKeys.push(rate)
				}
			})
		}
		// Definir keys
		// genSumForKeys.forEach((rating, index) => {
		// 	if (rating > 0) {
		// 		// Index 0 es idRating 1 e index 4 es idRating 5
		// 		const icon = thumbsUpAndDown ? (index === 0 ? thumbDown : thumbUp) : ratingStars[index]
		// 		tempKeys.push(icon)
		// 	}
		// })
		setKeys(tempKeys)
		setData(tempData)
	}

	useEffect(() => {
		formatData()
	}, [resource])

	return (
		<RenderChart
			chartTitle="Calificaciones"
			dataLength={resource.length}
			loading={status === 'pending' || status === 'rejected'}
			tooltip="La gráfica es interactiva. Haz clic en una barra para consultar las conversaciones asociadas"
		>
			<RateIntentsChart data={data} keys={keys} />
		</RenderChart>
	)
}
