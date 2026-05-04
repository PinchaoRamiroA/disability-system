import React, { useEffect, useState } from 'react'
import { RenderChart } from '@/components/Charts/RenderChart'
import { BarChart } from '@/types/Charts'
import { TopRatingChart } from './TopRatingChart'
import { TopRating } from '@/types/Statistics/VirtualAgent/Calificaciones'
import { Status } from '@/types/status'

interface Props {
	resource: TopRating
	status: Status
}

const star = '⭐'
const thumbUp = '👍'
const thumbDown = '👎'

export const TopRatingChartContainer = ({ resource, status }: Props) => {
	const [keys, setKeys] = useState<string[]>([])
	const [data, setData] = useState<BarChart[]>([])

	useEffect(() => {
		const tempKeys: string[] = []
		const tempData: BarChart[] = []

		// Indica que se deben mostrar iconos de manito arriba y abajo ya que la data solo tiene calificaciones de 1 y 5 estrellas
		let thumbsUpAndDown = true

		// Validar si la data corresponde a calificaciones de manito arriba y manito abajo (1 - 5)
		resource.detail.forEach(({ detail, idRating }) => {
			detail.forEach((details) => {
				if (idRating !== 1 && idRating !== 5 && details.detail.length) {
					thumbsUpAndDown = false
				}
			})
		})

		if (resource.count) {
			resource.detail.forEach((rating) => {
				const obj: BarChart = {}

				if (rating.detail.length) {
					obj.idRating = thumbsUpAndDown
						? rating.idRating === 1
							? thumbDown
							: thumbUp
						: star.repeat(rating.idRating)
					// const ratingDetails = rating.detail.reverse()

					// Calcular totales por califación e intención
					rating.detail.forEach((ratingDetail) => {
						const { intent, detail } = ratingDetail
						const total = detail.reduce((a, b) => a + b.count, 0)

						obj[intent] = total

						if (!tempKeys.includes(intent)) {
							tempKeys.push(intent)
						}
					})
					tempData.push(obj)
				}
			})

			setData(tempData)
			setKeys(tempKeys)
		}
	}, [resource])

	return (
		<RenderChart
			chartTitle="Top de calificaciones"
			dataLength={resource.count}
			loading={status === 'pending'}
		>
			<TopRatingChart data={data} keys={keys} />
		</RenderChart>
	)
}
