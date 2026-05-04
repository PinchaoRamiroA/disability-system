import { Checkbox, FormControlLabel, FormGroup } from '@mui/material'
import React from 'react'
import { FilterItem } from '../FilterItem'

import { useIntegrationStatusFilter } from '@/hooks/filters/useIntegrationStatusFilter'
import { FilterClicked } from '@/types/Filter/Filter'

export const IntegrationStatusFilter = ({ clicked }: FilterClicked) => {
	const { success, noSuccess, handleChangeSuccess, handleChangeNoSuccess } =
		useIntegrationStatusFilter()

	return (
		<FilterItem label="Estado de la integración" clicked={clicked}>
			<FormGroup sx={{ paddingInlineStart: 5 }}>
				<FormControlLabel
					control={
						<Checkbox
							value="success"
							checked={success}
							onChange={(e) =>
								handleChangeSuccess(e.target.checked)
							}
						/>
					}
					label="Exitoso"
				/>
				<FormControlLabel
					control={
						<Checkbox
							value="unsuccess"
							checked={noSuccess}
							onChange={(e) =>
								handleChangeNoSuccess(e.target.checked)
							}
						/>
					}
					label="No exitoso"
				/>
			</FormGroup>
		</FilterItem>
	)
}
