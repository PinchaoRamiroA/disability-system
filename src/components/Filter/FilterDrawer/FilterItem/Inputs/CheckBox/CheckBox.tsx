import { FormControlLabel, Checkbox as MuiCheckbox } from '@mui/material'
import React, { useEffect, useState } from 'react'

interface Props {
	value: number | string
	label: string
	checked: boolean
	name: string
}

export const CheckBox = ({ value, label, checked, name }: Props) => {
	const [isChecked, setIsChecked] = useState(true)

	const onChange = () => {
		setIsChecked(!isChecked)
	}

	useEffect(
		function setInitialValue() {
			setIsChecked(checked)
		},
		[checked]
	)

	return (
		<FormControlLabel
			name={name}
			control={
				<MuiCheckbox
					id={label}
					value={value}
					onChange={onChange}
					checked={isChecked}
				/>
			}
			label={label}
		/>
	)
}
