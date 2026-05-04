import { Status } from '@/types/status'
import { NoDataText, TableHeader } from '@/types/Table'
import { TableBody, Typography } from '@mui/material'
import React from 'react'
import { BodyEmptyState } from '../BodyEmptyState'
import { BodySkeleton } from '../BodySkeleton'

interface Props {
	headers: TableHeader[]
	children: React.ReactNode
	status: Status
	isEmpty: boolean
	noDataText?: NoDataText
}
export const Body = ({
	headers,
	children,
	status,
	isEmpty,
	noDataText,
}: Props) => {
	if (status === 'pending' || status === 'rejected') {
		return (
			<TableBody>
				<BodySkeleton headers={headers} />
			</TableBody>
		)
	}

	const colSpan = headers.length

	if (status === 'resolved' && isEmpty) {
		return (
			<TableBody>
				<BodyEmptyState colSpan={colSpan}>
					<Typography variant="h6" sx={{ mb: 1 }}>
						{noDataText ? noDataText.title : 'No hay resultados'}
					</Typography>
					<Typography variant="body1">
						{noDataText
							? noDataText.description
							: 'La lista de elementos está vacía.'}
					</Typography>
				</BodyEmptyState>
			</TableBody>
		)
	}
	// else if (status === 'rejected') {
	// 	return (
	// 		<TableBody>
	// 			<BodyEmptyState colSpan={colSpan}>
	// 				<Typography variant="h6" sx={{ mb: 1 }}>
	// 					{noDataText ? noDataText.title : 'Error'}
	// 				</Typography>
	// 				<Typography variant="body1">
	// 					{noDataText
	// 						? noDataText.description
	// 						: 'Se presentó un error al cargar los datos.'}
	// 				</Typography>
	// 			</BodyEmptyState>
	// 		</TableBody>
	// 	)
	// }
	return <TableBody>{children}</TableBody>
}
