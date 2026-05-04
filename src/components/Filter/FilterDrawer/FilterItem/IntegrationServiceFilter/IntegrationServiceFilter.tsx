import React from 'react'
import { FilterClicked } from '@/types/Filter/Filter'
import { FilterItem } from '../FilterItem'
import { IconButton, TextField } from '@mui/material'
import { useIntegrationServiceNameFilter } from '@/hooks/filters/useIntegrationServiceNameFilter'
import { Clear } from '@mui/icons-material'

export const IntegrationServiceFilter = ({ clicked }: FilterClicked) => {
	const { handleChange, serviceName } = useIntegrationServiceNameFilter()

	return (
		<FilterItem label="Nombre servicio de la integración" clicked={clicked}>
			<TextField
				label="Nombre del servicio"
				name="integrationServiceName"
				value={serviceName}
				onChange={(e) => handleChange(e.target.value)}
				InputProps={{
					endAdornment: (
						<IconButton
							size="small"
							onClick={() => handleChange('')}
						>
							<Clear />
						</IconButton>
					),
				}}
				fullWidth
			/>
		</FilterItem>
	)
}
