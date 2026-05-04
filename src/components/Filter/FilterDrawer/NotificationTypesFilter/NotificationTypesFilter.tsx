import React from 'react'
import { FilterItem } from '../FilterItem'
import { useNotifTypesFilter } from '@/hooks/filters/useNotifTypesFilter'
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material'
import { FilterClicked } from '@/types/Filter/Filter'

export const NotificationTypesFilter = ({ clicked }: FilterClicked) => {
	const { channels, status, handleChange } = useNotifTypesFilter()

	return (
		<FilterItem
			label="Canales (notificaciones)"
			status={status}
			clicked={clicked}
		>
			<FormGroup sx={{ paddingInlineStart: 5 }}>
				{channels.map((channel) => {
					return (
						<FormControlLabel
							key={channel.typeNotificationId}
							name="channels"
							control={
								<Checkbox
									value={channel.typeNotificationId}
									onChange={handleChange}
									checked={channel.checked}
								/>
							}
							label={channel.name}
						/>
					)
				})}
			</FormGroup>
		</FilterItem>
	)
}
