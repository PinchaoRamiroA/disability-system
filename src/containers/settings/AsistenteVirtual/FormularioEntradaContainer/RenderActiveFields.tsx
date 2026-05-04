import React, { useEffect, useState } from 'react'
import { Grid, Typography } from '@mui/material'
import { RenderStep } from './RenderStep'
import { FieldPreview } from './FieldPreview'
import {
	FormConfigMode,
	FormEntrada,
} from '@/types/Settings/asistente-virtual/FormularioEntrada'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { UniqueIdentifier } from '@dnd-kit/core'
import { ChildrenType } from '@/types/Children'
import { useFormEntradaContext } from './useFormEntradaContext'

interface Props {
	fields: FormEntrada[][]
}

interface Content {
	mode: FormConfigMode
	sortableItems: { id: UniqueIdentifier }[]
	children: ChildrenType
}

const RenderContent = ({ children, mode, sortableItems }: Content) => {
	return mode === 'add-remove' ? (
		<>{children}</>
	) : (
		<SortableContext
			items={sortableItems}
			strategy={verticalListSortingStrategy}
		>
			<Grid item ml={1}>
				<Typography variant="body1" mt={1} color="gray">
					Arrastra y suelta los campos para reorganizar el formulario
				</Typography>
			</Grid>
			{children}
		</SortableContext>
	)
}

export const RenderActiveFields = ({ fields }: Props) => {
	const [sortableItems, setSortableItems] = useState<
		{ id: UniqueIdentifier }[]
	>([])
	const { mode } = useFormEntradaContext()

	useEffect(() => {
		setSortableItems(fields.flat().map((field) => ({ id: field.name })))
	}, [fields])

	return (
		<Grid item container xs={12} spacing={2}>
			<RenderContent mode={mode} sortableItems={sortableItems}>
				{fields.map((content, i) => (
					<Grid item xs={12} key={i}>
						<RenderStep step={i + 1} />

						{content.map((field) => {
							return (
								<FieldPreview key={field.name} field={field} />
							)
						})}
					</Grid>
				))}
			</RenderContent>
		</Grid>
	)
}
