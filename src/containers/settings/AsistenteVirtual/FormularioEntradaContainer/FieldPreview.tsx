import React from 'react'
import { Grid, IconButton, Tooltip } from '@mui/material'
import { FormEntrada } from '@/types/Settings/asistente-virtual/FormularioEntrada'
import { AddCircle, DragHandle, RemoveCircle } from '@mui/icons-material'
import { RenderFieldPreview } from './RenderFieldPreview'
import { useFormEntradaContext } from './useFormEntradaContext'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface Props {
	field: FormEntrada
	draggable?: boolean
}

export const FieldPreview = ({ field }: Props) => {
	const { handleUpdateField, isGrabbing, mode } = useFormEntradaContext()

	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: field.name })

	return (
		<Grid
			item
			container
			xs={12}
			alignItems="flex-end"
			my={1}
			{...(mode === 'reorder' && {
				ref: setNodeRef,
				...attributes,
				...listeners,
				sx: {
					':hover': {
						boxShadow: '1px 0px 5px grey',
					},
					padding: 1,
					transform: CSS.Transform.toString(transform),
					transition,
					cursor: isDragging ? 'grabbing' : 'grab',
				},
			})}
		>
			<Grid item xs>
				<RenderFieldPreview
					field={field}
					grabbing={isGrabbing}
					mode={mode}
				/>
			</Grid>

			<Grid item xs="auto" ml={0.5}>
				{mode === 'reorder' && <DragHandle />}
				{!field.editable && mode === 'add-remove' && (
					<Tooltip
						title={
							field.isActive
								? 'Quitar del formulario de entrada'
								: 'Agregar al formulario de entrada'
						}
					>
						<IconButton
							onClick={() =>
								handleUpdateField(
									field,
									field.isActive ? 'remove' : 'add'
								)
							}
						>
							{field.isActive ? (
								<RemoveCircle color="primary" />
							) : (
								<AddCircle color="primary" />
							)}
						</IconButton>
					</Tooltip>
				)}
			</Grid>
		</Grid>
	)
}
