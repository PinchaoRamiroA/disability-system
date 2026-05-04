import React, { useEffect, useState } from 'react'
import { RenderChart } from '@/components/Charts/RenderChart'
import { Chart } from './Chart'
import { OverallChatsDetails } from '@/types/HumanAgent/Chats'
import { BarChart } from '@/types/Charts'
import moment from 'moment'

interface Props {
	data: OverallChatsDetails[]
	totalAttended: number
	totalNotAttended: number
	dataLength: number
	loading: boolean
}

export const ChartContainer = ({
	data,
	totalAttended,
	totalNotAttended,
	dataLength,
	loading,
}: Props) => {
	const [formatedData, setFormatedData] = useState<BarChart[]>([])

	const formatData = () => {
		const tempData: BarChart[] = []

		data.forEach((item) => {
			tempData.push({
				date: moment(item.date).format('DD/MM/YYYY'),
				Atendidos: item.rating.rating1,
				'No atendidos': item.rating.rating2,
			})
		})
		setFormatedData(tempData)
	}

	useEffect(() => {
		formatData()
	}, [data])

	return (
		<RenderChart
			chartTitle="Chats"
			dataLength={dataLength}
			loading={loading}
		>
			<Chart
				data={formatedData}
				totalAttended={totalAttended}
				totalNotAttended={totalNotAttended}
			/>
		</RenderChart>
	)
}
