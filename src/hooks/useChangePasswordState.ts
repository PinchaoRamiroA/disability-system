import { useState } from 'react'

export const useChangePasswordState = () => {
	const [openPassword, setOpenPassword] = useState(false)

	const handleOpenPassword = () => {
		setOpenPassword(true)
	}

	const handleClosePassword = () => {
		setOpenPassword(false)
	}

	return {
		openPassword,
		handleOpenPassword,
		handleClosePassword,
	}
}
