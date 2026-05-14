import { Box, Typography, Chip, LinearProgress } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import WarningIcon from '@mui/icons-material/Warning'
import CancelIcon from '@mui/icons-material/Cancel'
import HelpIcon from '@mui/icons-material/Help'
import { Documento } from '@/types/api'

interface DocumentoRequerido {
	id_tipo_documento: number
	nombre: string
	descripcion: string
	requerido: boolean
}

interface DocumentChecklistProps {
	tipoIncapacidad: number
	documentosRequeridos: DocumentoRequerido[] | string[]
	documentosSubidos: Documento[]
}

export const DocumentChecklist = ({
	tipoIncapacidad,
	documentosRequeridos,
	documentosSubidos,
}: DocumentChecklistProps) => {
	const getDocName = (doc: DocumentoRequerido | string) =>
		typeof doc === 'string' ? doc : doc.nombre

	const getDocCodigo = (doc: DocumentoRequerido | string) =>
		typeof doc === 'string' ? doc : (doc as any).codigo || doc.nombre

	const getStatus = (doc: DocumentoRequerido | string) => {
		const codigo = getDocCodigo(doc)
		const found = documentosSubidos.find(
			(d) => d.tipo === codigo || d.tipo.toLowerCase() === codigo.toLowerCase()
		)
		if (!found) return 'missing'
		if (found.estado === 'validado') return 'valid'
		if (found.estado === 'rechazado') return 'rejected'
		return 'pending'
	}

	const stats = {
		total: documentosRequeridos.length,
		validos: documentosSubidos.filter((d) => d.estado === 'validado').length,
		pendientes: documentosSubidos.filter(
			(d) => !d.estado || d.estado === 'pendiente'
		).length,
		rechazados: documentosSubidos.filter((d) => d.estado === 'rechazado')
			.length,
	}

	const progreso =
		documentosRequeridos.length > 0
			? (stats.validos / documentosRequeridos.length) * 100
			: 0

	return (
		<Box>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					mb: 2,
				}}
			>
				<Typography variant="h6">Documentos Requeridos</Typography>
				<Chip
					label={`${stats.validos}/${stats.total} completos`}
					color={stats.validos === stats.total ? 'success' : 'warning'}
					size="small"
				/>
			</Box>

			<Box sx={{ mb: 2 }}>
				<LinearProgress
					variant="determinate"
					value={progreso}
					sx={{
						height: 8,
						borderRadius: 4,
						backgroundColor: 'grey[300]',
						'& .MuiLinearProgress-bar': {
							borderRadius: 4,
						},
					}}
				/>
			</Box>

			{stats.pendientes > 0 && (
				<Box sx={{ mb: 2 }}>
					<Chip
						icon={<WarningIcon />}
						label={`${stats.pendientes} documento(s) pendiente(s)`}
						color="warning"
						size="small"
					/>
				</Box>
			)}

			{stats.rechazados > 0 && (
				<Box sx={{ mb: 2 }}>
					<Chip
						icon={<CancelIcon />}
						label={`${stats.rechazados} documento(s) rechazado(s)`}
						color="error"
						size="small"
					/>
				</Box>
			)}

			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
				{documentosRequeridos.map((doc) => {
					const name = getDocName(doc)
					const codigo = getDocCodigo(doc)
					const status = getStatus(doc)
					const uploadedDoc = documentosSubidos.find(
						(d) => d.tipo === codigo || d.tipo.toLowerCase() === codigo.toLowerCase()
					)

					return (
						<Box
							key={typeof doc === 'string' ? doc : doc.id_tipo_documento}
							sx={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
								p: 1.5,
								border: '1px solid',
								borderColor:
									status === 'valid'
										? 'success.main'
										: status === 'rejected'
										? 'error.main'
										: status === 'pending'
										? 'warning.main'
										: 'divider',
								borderRadius: 1,
								backgroundColor:
									status === 'valid'
										? 'success.light'
										: status === 'rejected'
										? 'error.light'
										: status === 'pending'
										? 'warning.light'
										: 'transparent',
							}}
						>
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
								{status === 'valid' && (
									<CheckCircleIcon color="success" fontSize="small" />
								)}
								{status === 'rejected' && (
									<CancelIcon color="error" fontSize="small" />
								)}
								{status === 'pending' && (
									<WarningIcon color="warning" fontSize="small" />
								)}
								{status === 'missing' && (
									<HelpIcon color="disabled" fontSize="small" />
								)}
								<Typography variant="body2" fontWeight={500}>
									{name}
								</Typography>
							</Box>
							<Box>
								{status === 'valid' && (
									<Chip label="Válido" color="success" size="small" />
								)}
								{status === 'rejected' && (
									<Chip label="Rechazado" color="error" size="small" />
								)}
								{status === 'pending' && (
									<Chip label="Pendiente" color="warning" size="small" />
								)}
								{status === 'missing' && (
									<Chip label="Faltante" color="default" size="small" />
								)}
							</Box>
						</Box>
					)
				})}
			</Box>

			{documentosSubidos.length > 0 && (
				<Box sx={{ mt: 3 }}>
					<Typography variant="subtitle2" gutterBottom>
						Documentos Subidos
					</Typography>
					{documentosSubidos.map((doc) => (
						<Box
							key={doc.id_documento}
							sx={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
								p: 1,
								bgcolor: 'grey.100',
								borderRadius: 1,
								mb: 0.5,
							}}
						>
							<Typography variant="body2">{doc.nombre_archivo}</Typography>
							<Chip
								label={doc.estado || 'pendiente'}
								size="small"
								color={
									doc.estado === 'validado'
										? 'success'
										: doc.estado === 'rechazado'
										? 'error'
										: 'default'
								}
							/>
						</Box>
					))}
				</Box>
			)}
		</Box>
	)
}