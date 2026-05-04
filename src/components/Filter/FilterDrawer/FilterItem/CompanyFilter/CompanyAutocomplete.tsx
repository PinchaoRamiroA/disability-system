import React from 'react'
import { Autocomplete, TextField } from '@mui/material'
import { NormalizedCompany } from '@/types/Company'
import { useAppDispatch } from '@/hooks/useReduxHooks'
import { updateFields } from '@/store/slices/Filter'

interface Props {
	companies: NormalizedCompany[]
	value: NormalizedCompany | null
	inputValue: string
	settings?: boolean
	handleChange: (value: NormalizedCompany | null) => void
	handleSetInputValue: (value: string) => void
	setDefaultCompany?: (dispatch: boolean) => void
}

export const CompanyAutocomplete = ({
	companies,
	inputValue,
	value,
	handleChange,
	handleSetInputValue,
	setDefaultCompany,
	settings = false,
}: Props) => {
	const dispatch = useAppDispatch()

	const updateReducer = (newValue: NormalizedCompany | null) => {
		handleChange(newValue)

		if (newValue) {
			dispatch(updateFields({ idOrg: newValue.idOrg }))
		} else if (setDefaultCompany) {
			setDefaultCompany(true)
		}
	}

	return (
		<Autocomplete
			disablePortal
			id="combo-box-demo"
			options={companies}
			value={value ?? null}
			onChange={(_, newValue) =>
				settings ? updateReducer(newValue) : handleChange(newValue)
			}
			inputValue={inputValue}
			onInputChange={(_, newInputValue) =>
				handleSetInputValue(newInputValue)
			}
			fullWidth
			isOptionEqualToValue={(option, value) => option.id === value.id}
			renderInput={(params) => (
				<TextField
					{...params}
					name="companies"
					label={settings ? 'Compañía' : 'Compañías'}
				/>
			)}
			size={settings ? 'small' : 'medium'}
		/>
	)
}
