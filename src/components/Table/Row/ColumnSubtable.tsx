import React from 'react'
import {
	Collapse,
	IconButton,
	Table,
	TableBody,
	TableCell,
	TableRow,
	Tooltip,
} from '@mui/material'
import { GenericObject } from '@/types/GenericObject'
import { ExpandLess, ExpandMore } from '@mui/icons-material'

interface Props<T> {
	expandRow: boolean
	colSpan: number
	data: T[]
	columns: string[]
	handleExpand: () => void
}

export const ColumnSubtable = <T extends GenericObject>({
	expandRow,
	colSpan,
	data,
	columns,
	handleExpand,
}: Props<T>) => {
	return (
		<TableCell colSpan={colSpan} align="center" sx={{ padding: 0 }}>
			<Tooltip title={expandRow ? 'Ver menos' : 'Ver más'}>
				<IconButton onClick={handleExpand} size="small" sx={{ mt: 1 }}>
					{expandRow ? <ExpandLess /> : <ExpandMore />}
				</IconButton>
			</Tooltip>
			<Collapse in={expandRow}>
				<Table sx={{ padding: 0, my: 1 }}>
					<TableBody>
						{data.map((item, i) => {
							return (
								<TableRow key={item.id} hover>
									{columns.map((name, index) => (
										<TableCell
											key={index}
											sx={{
												py: 1,
												flex: 1,
												wordBreak: 'break-word',
												color: '#767676',
												...(data.length - 1 === i && {
													borderBottom: 0,
												}),
											}}
											width={2}
										>
											{item[name]?.toString()}
										</TableCell>
									))}
								</TableRow>
							)
						})}
					</TableBody>
				</Table>
			</Collapse>
		</TableCell>
	)
}
