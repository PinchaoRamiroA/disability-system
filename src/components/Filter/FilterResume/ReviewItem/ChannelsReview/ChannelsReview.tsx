import React from 'react'
import { useChannelFilter } from '@/hooks/filters/useChannelFilter'
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'
import { filterChannelsSelector, updateFields } from '@/store/slices/Filter'
import { Grid, Typography } from '@mui/material'
import { ReviewItem } from '../ReviewItem'
import { useChannelLabel } from '@/hooks/useChannelLabel'

export const ChannelsReview = () => {
	const dispatch = useAppDispatch()
	const { handleSetValue } = useChannelFilter()

	// Checked channels (ids)
	const { channels: filteredChannels } = useAppSelector(
		filterChannelsSelector
	)
	const { getChannelLabel, channels } = useChannelLabel()

	// Actualiza el state del filtro canales
	const handleDelete = (id: number) => {
		const currentChannels = channels.filter((ch) =>
			filteredChannels?.includes(ch.id)
		)
		const updatedChannels = currentChannels.filter((ch) => ch.id !== id)
		handleSetValue(updatedChannels)

		dispatch(
			updateFields({
				channels: updatedChannels.map((ch) => ch.id),
			})
		)
	}

	return (
		<Grid container alignItems="center">
			<Grid item>
				<Typography variant="body2" component="span" marginRight={1}>
					Canales:
				</Typography>
			</Grid>

			{
				// Hay canales para mostrar
				filteredChannels?.length ? (
					<>
						{filteredChannels.map((ch) => {
							return (
								<Grid item key={ch}>
									<ReviewItem
										filterName="channels"
										data={getChannelLabel(ch)}
										removeFilter={() => handleDelete(ch)}
									/>
								</Grid>
							)
						})}
					</>
				) : (
					// No hay ningún canal seleccionado
					<ReviewItem filterName="channels" data="Seleccionar" />
				)
			}
		</Grid>
	)
}
