import React from 'react'
import { useLocationsFilter } from '@/hooks/filters/useLocationsFilter'
import { Autocomplete, Box, TextField } from '@mui/material'
import { FilterItem } from '../FilterItem'
import { FilterClicked } from '@/types/Filter/Filter'

interface Props extends FilterClicked {
	requireCities: boolean
	requireDepartments: boolean
}

export const LocationsFilter = ({
	clicked,
	requireCities,
	requireDepartments,
}: Props) => {
	const {
		status,
		regions,
		regionsSelected,
		handleRegionsSelected,
		departments,
		departmentsSelected,
		handleDepartmentsSelected,
		cities,
		citiesSelected,
		handleCitiesSelected,
	} = useLocationsFilter(requireCities, requireDepartments)

	return (
		<FilterItem
			label={requireDepartments ? 'Locaciones' : 'Regionales'}
			status={status}
			clicked={clicked}
		>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					// border: '1px solid red',
					width: '100%',
					gap: 2,
				}}
			>
				<Autocomplete
					multiple
					filterSelectedOptions
					disableCloseOnSelect
					disablePortal
					id="combo-box-demo"
					options={regions}
					value={regionsSelected}
					getOptionLabel={(option) => option.label ?? ''}
					isOptionEqualToValue={(option, value) =>
						option.id === value.id
					}
					onChange={(_, newValue) => handleRegionsSelected(newValue)}
					renderInput={(params) => (
						<TextField
							{...params}
							name="regions"
							label="Regiones"
						/>
					)}
					limitTags={3}
					ListboxProps={{
						style: { backgroundColor: '#f9f9f9' },
					}}
				/>

				{requireDepartments && (
					<Autocomplete
						multiple
						filterSelectedOptions
						disableCloseOnSelect
						disablePortal
						id="combo-box-demo2"
						options={departments}
						value={departmentsSelected}
						getOptionLabel={(option) => option.label ?? ''}
						isOptionEqualToValue={(option, value) =>
							option.id === value.id
						}
						onChange={(_, newValue) =>
							handleDepartmentsSelected(newValue)
						}
						renderInput={(params) => (
							<TextField
								{...params}
								name="departments"
								label="Departamentos"
							/>
						)}
						limitTags={3}
						ListboxProps={{
							style: { backgroundColor: '#f9f9f9' },
						}}
					/>
				)}

				{requireCities && (
					<Autocomplete
						multiple
						filterSelectedOptions
						disableCloseOnSelect
						disablePortal
						id="combo-box-demo2"
						options={cities}
						value={citiesSelected}
						getOptionLabel={(option) => option.label ?? ''}
						isOptionEqualToValue={(option, value) =>
							option.id === value.id
						}
						onChange={(_, newValue) =>
							handleCitiesSelected(newValue)
						}
						renderInput={(params) => (
							<TextField
								{...params}
								name="cities"
								label="Ciudades"
							/>
						)}
						limitTags={3}
						ListboxProps={{
							style: { backgroundColor: '#f9f9f9' },
						}}
					/>
				)}
			</Box>
		</FilterItem>
	)
}
