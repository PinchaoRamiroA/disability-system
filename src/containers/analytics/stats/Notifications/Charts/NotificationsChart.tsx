import React from 'react'
import { useChartWidth } from '@/hooks/useChartWidth'
import { BarChart } from '@/types/Charts'
import { Bar } from '@nivo/bar'
import { useFormatChartDates } from '@/hooks/estadisticas/useFormatChartDates'

interface Props {
	data: BarChart[]
	keys: string[]
	maxValue: number
	totalPositivas: number
	totalNegativas: number
	ejes: { date: string; value: number }[]
}

const formatChannelText = (value: string | number) => {
	let channel = value.toString()
	if (channel.includes('OK_')) {
		channel = channel.replace('OK_', '') + ' (ok)'
	} else {
		channel += ' (error)'
	}
	return channel
}

export const NotificationsChart = ({
	data,
	keys,
	maxValue,
	totalNegativas,
	totalPositivas,
	ejes,
}: Props) => {
	const { width } = useChartWidth({ defaultScreenSize: 100 })
	const { format } = useFormatChartDates(data)

	return (
		<Bar
			width={width}
			height={350}
			margin={{ top: 80, right: 110, bottom: 70, left: 80 }}
			labelSkipWidth={16}
			labelSkipHeight={16}
			data={data}
			keys={keys}
			padding={0.4}
			// colors={["blue", "aqua", "red", "pink", ]}
			indexBy={'date'}
			minValue={maxValue * -1}
			maxValue={maxValue}
			enableGridX={true}
			enableGridY={false}
			labelTextColor="inherit:darker(1.2)"
			axisTop={{
				tickSize: 0,
				tickPadding: 12,
				// tickRotation: -90,
				format,
			}}
			axisBottom={{
				format: (v) => {
					const value = ejes.find((el) => el.date === v)?.value

					if (value && value > 0) return value
					return ''
				},
			}}
			axisLeft={null}
			axisRight={{
				format: (v: number) =>
					Number.isInteger(v) ? `${Math.abs(v)}` : '',
			}}
			markers={[
				{
					axis: 'y',
					value: 0,
					lineStyle: { strokeOpacity: 0 },
					textStyle: { fill: '#2ebca6' },
					legend: `Exitosas (${totalPositivas})`,
					legendPosition: 'top-left',
					legendOrientation: 'vertical',
					//   legendOffsetY: 120,
				},
				{
					axis: 'y',
					value: 0,
					lineStyle: { stroke: '#f47560', strokeWidth: 1 },
					textStyle: { fill: '#e25c3b' },
					legend: `Fallidas (${totalNegativas})`,
					legendPosition: 'bottom-left',
					legendOrientation: 'vertical',
					//   legendOffsetY: 120,
				},
			]}
			legends={[
				{
					dataFrom: 'keys',
					anchor: 'bottom-left',
					direction: 'row',
					justify: false,
					// translateX: 120,
					translateY: 60,
					itemsSpacing: 25,
					toggleSerie: true,
					itemWidth: 110,
					itemHeight: 20,
					itemDirection: 'left-to-right',
					itemOpacity: 0.85,
					symbolSize: 15,
					effects: [
						{
							on: 'hover',
							style: {
								itemOpacity: 1,
							},
						},
					],
				},
			]}
			legendLabel={(datum) => {
				// const curr = Object.keys(legends).filter((leg) => leg === datum.id)
				// const value = legends[curr[0]]
				// console.log(datum)

				// DATUM
				// {
				//     "id": "SMS",
				//     "value": -1,
				//     "formattedValue": "1",
				//     "hidden": false,
				//     "index": 0,
				//     "indexValue": "2023-07-04",
				//     "data": {
				//         "SMS": -1,
				//         "OK_EMAIL": 2,
				//         "channel": 10,
				//         "date": "2023-07-04",
				//         "count": 1
				//     }
				// }
				// return `${datum.id} (${0})`
				return formatChannelText(datum.id)
			}}
			valueFormat={(v) => `${Math.abs(v)}`}
			tooltipLabel={(v) => {
				return `${formatChannelText(v.id)} - ${v.indexValue}`
			}}
		/>
	)
}
