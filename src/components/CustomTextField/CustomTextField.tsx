import React from 'react'
import { TextField } from '@mui/material'

interface Props {
	name?: string
	label?: string
}

export const CustomTextField = ({ label, name }: Props) => {
	return <TextField name={name} label={label} />
}
