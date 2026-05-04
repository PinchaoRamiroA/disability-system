import React from 'react'
import { RenderChart } from '@/components/Charts/RenderChart'
import { Chart } from './Chart'
import { BarChart } from '@/types/Charts'
import { Status } from '@/types/status'

interface Props {
	data: BarChart[]
	keys: string[]
	total: number
	title: string
	status: Status
	tooltip?: string
}

export const CausalChartWrapper = ({
	data,
	keys,
	total,
	title,
	status,
	tooltip,
}: Props) => {
	return (
		<RenderChart
			chartTitle={`${title} (${total})`}
			dataLength={data.length}
			tooltip={tooltip}
			loading={status === 'pending' || status === 'rejected'}
			resizeHeight
		>
			<Chart data={data} keys={keys} total={total} />
		</RenderChart>
	)
}
