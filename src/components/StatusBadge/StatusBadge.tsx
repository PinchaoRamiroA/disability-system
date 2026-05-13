import React from 'react'
import { Chip } from '@mui/material'

interface Props {
	status?: string
}

const STATUS_COLORS: Record<string, string> = {
	recibida: 'default',
	validada: 'info',
	transcrita: 'primary',
	en_proceso: 'warning',
	cobrada: 'success',
	pagada: 'success',
	rechazada: 'error',
	cancelada: 'error',
}

export const StatusBadge = ({ status }: Props) => {
	const color = STATUS_COLORS[status?.toLowerCase() || ''] || 'default'
	return <Chip label={status || '-'} color={color as any} size="small" />
}
