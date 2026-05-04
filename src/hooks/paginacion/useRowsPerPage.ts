import { useState } from 'react'

export const useRowsPerPage = (defaultRows = 20) => {
	const [rowsPerPage, setRowsPerPage] = useState(defaultRows)

	const handleRowsPerPageChange = (rows: number) => {
		setRowsPerPage(rows)
	}

	return {
		rowsPerPage,
		handleRowsPerPageChange,
	}
}
