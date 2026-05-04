import React from 'react'
import { Skeleton, TableCell, TableRow } from '@mui/material'
import { TableHeader } from '@/types/Table'
import { TABLE_ROW_HEIGHT } from '@/utils/constants/table'

interface Props {
	headers: TableHeader[]
}

//TODO: MEMOIZADO
export const BodySkeleton = ({ headers }: Props) => {
	return (
		<>
			{[0, 1, 2, 3, 4, 5].map((id) => {
				return (
					<TableRow
						key={id}
						style={{
							height: TABLE_ROW_HEIGHT,
						}}
					>
						{headers.map((_value, headerIndex) => {
							const cellKey = `skeleton-cell-${id}-${headerIndex}`
							return (
								<TableCell key={cellKey}>
									<Skeleton variant="text" />
								</TableCell>
							)
						})}
					</TableRow>
				)
			})}
		</>
	)
}
