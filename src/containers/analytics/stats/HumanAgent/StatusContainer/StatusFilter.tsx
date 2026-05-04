import React, { useEffect, useState } from 'react'
import { Autocomplete, Paper, TextField } from '@mui/material'
import { GenericObject } from '@/types/GenericObject'

interface Option {
	label: string
	value: number
	key: string
}

interface Props {
	data: GenericObject[]
	onFilter: (filtered: GenericObject[]) => void
	refresh: boolean
}

const options: Option[] = [
	{ label: 'Activo', value: 1, key: 'Activo' },
	{ label: 'Inactivo', value: 2, key: 'Inactivo' },
	{ label: 'En Pausa', value: 3, key: 'Pausa' },
]

export const StatusFilter = ({ data, refresh, onFilter }: Props) => {
	const [selected, setSelected] = useState<Option[]>([])

	const handleFilter = (values: Option[]) => {
		setSelected(values)

		let filteredData: GenericObject[] = []

		// Filtrar data solo cuando se selecciona alguna opción
		if (values.length > 0) {
			const flatStatus = values.map((val) => val.key)
			const col = 'estado'

			filteredData = data.filter((it) => {
				if (typeof it[col] === 'string') {
					// console.log('includes', it[col], flatStatus.includes(it[col]))
					return flatStatus.some((status) =>
						String(it[col]).includes(status)
					)
				}
				return false
			})
		} else {
			filteredData = data
		}
		onFilter(filteredData)
	}

	useEffect(() => {
		if (!refresh) {
			handleFilter(selected)
		}
	}, [refresh, selected])

	useEffect(() => {
		setSelected([]) // Reset selected options when data changes
	}, [data])

	return (
		<Paper elevation={0}>
			<Autocomplete
				multiple
				options={options}
				getOptionLabel={(option) => option.label ?? ''}
				value={selected}
				limitTags={3}
				// disableCloseOnSelect
				// disablePortal
				fullWidth
				onChange={(_, values) => handleFilter(values)}
				renderOption={(props, option) => (
					<li {...props} key={option.value}>
						{option.label}
					</li>
				)}
				renderInput={(params) => (
					<TextField
						{...params}
						name="estados"
						label="Estado del asesor"
					/>
				)}
				size="small"
			/>
		</Paper>
	)
}
