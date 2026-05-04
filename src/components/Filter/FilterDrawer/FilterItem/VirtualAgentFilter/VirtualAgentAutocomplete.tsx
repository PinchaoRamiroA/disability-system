import React from 'react'
import { Autocomplete, TextField } from '@mui/material'
import { VirtualAgent } from '@/types/VirtualAgent'
import { useAppDispatch } from '@/hooks/useReduxHooks'
import { updateFields } from '@/store/slices/Filter'

interface Props {
	agents: VirtualAgent[]
	value: VirtualAgent | null
	handleChange: (newValue: VirtualAgent | null) => void
	inputValue: string
	handleSetInputValue: (value: string) => void
	settings?: boolean
	setDefaultAgent?: (dispatch: boolean) => void
}

export const VirtualAgentAutocomplete = ({
	agents,
	handleChange,
	handleSetInputValue,
	inputValue,
	value,
	settings = false,
	setDefaultAgent,
}: Props) => {
	const dispatch = useAppDispatch()

	const updateReducer = (newValue: VirtualAgent | null) => {
		handleChange(newValue)

		if (newValue) {
			dispatch(updateFields({ idVa: newValue.idVa }))
		} else if (setDefaultAgent) {
			setDefaultAgent(true)
		}
	}

	return (
		<Autocomplete
			disablePortal
			id="combo-box-demo"
			options={agents}
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
					name="virtualAgents"
					label="Asesor virtual"
				/>
			)}
			size={settings ? 'small' : 'medium'}
		/>
	)
}
