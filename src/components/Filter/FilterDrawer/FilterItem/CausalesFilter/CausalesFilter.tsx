import React, { useEffect, useState } from 'react'
import { FilterItem } from '../FilterItem'
import { FilterClicked } from '@/types/Filter/Filter'
import { useCausalesFilter } from '@/hooks/filters/useCausalesFilter'
import { Autocomplete, TextField } from '@mui/material'
import { TipoCausal } from '@/types/Causales'

interface Props extends FilterClicked {
	type: TipoCausal
}

export const CausalesFilter = ({ clicked, type }: Props) => {
	const { options, causalesSelected, handleUpdateValues } =
		useCausalesFilter(type)
	const [causalName, setCausalName] = useState('')

	useEffect(() => {
		if (type === 'finalizacion') {
			setCausalName('finalización')
		} else if (type === 'negocio') {
			setCausalName('negocio')
		} else if (type === 'paso-automatico') {
			setCausalName('paso')
		}
	}, [type])

	return (
		<FilterItem label={`Causales de ${causalName}`} clicked={clicked}>
			<Autocomplete
				multiple
				options={options}
				getOptionLabel={(option) => option.nombre ?? ''}
				value={causalesSelected}
				limitTags={3}
				disableCloseOnSelect
				disablePortal
				fullWidth
				onChange={(_, values) => handleUpdateValues(values)}
				renderOption={(props, option) => (
					<li {...props} key={option.id}>
						{option.nombre}
					</li>
				)}
				renderInput={(params) => (
					<TextField
						{...params}
						name={`causales-${type}`}
						label={`Causales de ${causalName}`}
					/>
				)}
				ListboxProps={{
					style: { backgroundColor: '#f9f9f9' },
				}}
			/>
		</FilterItem>
	)
}
