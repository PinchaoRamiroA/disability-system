import { GenericObject } from '@/types/GenericObject'
import { debounceInputEvent } from '@/utils/helpers/debounce'
import { InputAdornment, Paper, TextField } from '@mui/material'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search'

interface Props<T> {
	listElements: T[]
	filterBy: string[]
	onSubmit: (filteredList: T[]) => void
	label: string
}

//Debounce
export const SearchInput = <T extends GenericObject>({
	listElements,
	filterBy,
	onSubmit,
	label,
}: Props<T>) => {
	const [value, setValue] = useState('')
	const [flag, setFlag] = useState(false)

	const executeSearchCallback = useCallback(
		(input: string) => {
			input = input.trim()
			let filteredElements = []
			filteredElements = listElements.filter((item) => {
				input = input.toLowerCase()

				for (const filterProperty of filterBy) {
					if (typeof item[filterProperty] === 'string') {
						const property = item[filterProperty]?.toString()
						if (property?.toLowerCase().includes(input)) {
							return true
						}
					}
				}
				return false
			})

			setFlag(false)
			onSubmit(filteredElements)
		},
		[listElements, filterBy, onSubmit]
	)

	// Activar bandera para reaplicar el filtro cada vez que listElements cambie
	useEffect(() => {
		setFlag(true)
	}, [listElements, value])

	// Reaplica el filtro cada vez que la bandera esté activa
	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => {
		if (flag) {
			executeSearchCallback(value)
		}
	}, [executeSearchCallback])

	const debouncedEventHandler = useMemo(
		() => debounceInputEvent(setValue, executeSearchCallback, 500),
		[executeSearchCallback]
	)

	return (
		<Paper elevation={0}>
			<TextField
				size="small"
				// variant="filled"
				fullWidth
				onChange={debouncedEventHandler}
				type="text"
				value={value}
				// label={label}
				placeholder={label}
				InputProps={{
					startAdornment: (
						<InputAdornment position="start">
							<SearchIcon />
						</InputAdornment>
					),
				}}
			/>
		</Paper>
	)
}
