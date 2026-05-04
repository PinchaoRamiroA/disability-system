import React from 'react'
import { Close } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import { SnackbarKey, useSnackbar } from 'notistack'

export const SnackbarCloseButton = ({
	snackbarKey,
}: {
	snackbarKey: SnackbarKey
}) => {
	const { closeSnackbar } = useSnackbar()
	return (
		<IconButton onClick={() => closeSnackbar(snackbarKey)}>
			<Close htmlColor="#fff" />
		</IconButton>
	)
}
