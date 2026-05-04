import React from 'react'
import { FormatedChat } from '@/types/HumanAgent/WebChat'
import { Box, Button } from '@mui/material'

interface Props {
	option: FormatedChat
}

export const OptionList = ({ option }: Props) => {
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			{option.message}

			{option.itemOptions.map((item, i) => {
				return (
					<Button
						key={i}
						variant="contained"
						color="inherit"
						sx={{
							margin: 2,
							color: '#000',
							cursor: 'default',
							borderRadius: 5,
						}}
					>
						{item.substring(item.indexOf(':') + 1)}
					</Button>
				)
			})}
		</Box>
	)
}
