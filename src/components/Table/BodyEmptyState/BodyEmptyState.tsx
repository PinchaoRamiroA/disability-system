import { TABLE_ROW_HEIGHT } from '@/utils/constants/table'
import { TableCell, TableRow } from '@mui/material'
import React from 'react'

interface Props {
	children: React.ReactNode
	colSpan: number
}
export const BodyEmptyState = ({ colSpan, children }: Props) => {
	return (
		<TableRow sx={{ height: TABLE_ROW_HEIGHT }}>
			<TableCell sx={{ p: 8 }} colSpan={colSpan}>
				{children}
			</TableCell>
		</TableRow>
	)
}
