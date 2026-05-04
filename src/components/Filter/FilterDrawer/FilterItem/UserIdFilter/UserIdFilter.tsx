import { Autocomplete, Box, IconButton, TextField } from '@mui/material'
import React from 'react'
import { FilterItem } from '../FilterItem'

import ClearIcon from '@mui/icons-material/Clear'
import { useUserIdFilter } from '@/hooks/filters/useUserIdFilter'
import { FilterClicked } from '@/types/Filter/Filter'

export const UserIdFilter = ({ clicked }: FilterClicked) => {
	const {
		status,
		userId,
		handleChangeUserId,
		documentTypes,
		value,
		inputValue,
		handleSetValue,
		handleSetInputValue,
	} = useUserIdFilter()

	return (
		<FilterItem
			label="Número y tipo de documento"
			status={status}
			// disableButton={disableButton}
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
					disablePortal
					id="combo-box-demo"
					options={documentTypes}
					value={value ?? null}
					onChange={(_, newValue) => handleSetValue(newValue)}
					inputValue={inputValue}
					onInputChange={(_, newInputValue) =>
						handleSetInputValue(newInputValue)
					}
					isOptionEqualToValue={(option, value) =>
						option.id === value.id
					}
					renderInput={(params) => (
						<TextField
							{...params}
							name="userIdType"
							label="Tipo de documento"
						/>
					)}
				/>
				<TextField
					label="Número de documento"
					type="number"
					name="userId"
					value={userId ?? ''}
					onChange={(e) => handleChangeUserId(e.target.value)}
					InputProps={{
						inputProps: {
							// max: 100,
							min: 0,
						},
						endAdornment: (
							<IconButton
								size="small"
								onClick={() => handleChangeUserId('')}
							>
								<ClearIcon />
							</IconButton>
						),
					}}
				/>
			</Box>
		</FilterItem>
	)
}
