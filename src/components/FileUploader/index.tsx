import { useState, useCallback } from 'react'
import {
	Box,
	Typography,
	Button,
	LinearProgress,
	IconButton,
	Alert,
} from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DeleteIcon from '@mui/icons-material/Delete'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import { usePermission } from '@/hooks/usePermission'
import useNotifier from '@/hooks/useNotifier'

interface FileUploaderProps {
	idIncapacidad: number
	onUploadComplete?: (file: { id: number; nombre: string; url: string }) => void
	tipoDocumento?: string
	maxSizeMB?: number
	acceptedTypes?: string[]
	onFilesChange?: (files: File[]) => void
}

const DEFAULT_TYPES = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx']
const DEFAULT_MAX_SIZE = 10

export const FileUploader = ({
	idIncapacidad,
	onUploadComplete,
	tipoDocumento = 'general',
	maxSizeMB = DEFAULT_MAX_SIZE,
	acceptedTypes = DEFAULT_TYPES,
	onFilesChange,
}: FileUploaderProps) => {
	const { hasPermission } = usePermission()
	const { enqueueSnackbar } = useNotifier()
	const showError = (msg: string) => enqueueSnackbar(msg, { variant: 'error' })
	const showSuccess = (msg: string) => enqueueSnackbar(msg, { variant: 'success' })

	const [uploading, setUploading] = useState(false)
	const [dragOver, setDragOver] = useState(false)
	const [uploadProgress, setUploadProgress] = useState(0)
	const [uploadedFiles, setUploadedFiles] = useState<
		{ id: number; nombre: string; url: string }[]
	>([])

	const canUpload =
		hasPermission('crear_incapacidad') ||
		hasPermission('validar_documentos') ||
		hasPermission('editar_incapacidad')

	const validateFile = (file: File): string | null => {
		const ext = '.' + file.name.split('.').pop()?.toLowerCase()
		if (!acceptedTypes.includes(ext)) {
			return `Tipo de archivo no permitido. Aceptados: ${acceptedTypes.join(', ')}`
		}
		if (file.size > maxSizeMB * 1024 * 1024) {
			return `El archivo excede el tamaño máximo de ${maxSizeMB}MB`
		}
		return null
	}

	const uploadFile = async (file: File) => {
		const error = validateFile(file)
		if (error) {
			showError(error)
			return null
		}

		setUploading(true)
		setUploadProgress(0)

		try {
			const { createDocumento } = await import('@/services/api/incapacidades')

			const formData = new FormData()
			formData.append('file', file)
			formData.append('id_incapacidad', idIncapacidad.toString())
			formData.append('tipo', tipoDocumento)
			formData.append('nombre_archivo', file.name)

			setUploadProgress(50)

			const response = await createDocumento({
				id_incapacidad: idIncapacidad,
				tipo: tipoDocumento,
				nombre_archivo: file.name,
				url: URL.createObjectURL(file),
			})

			setUploadProgress(100)

			const newFile = {
				id: response.data.data.id_documento,
				nombre: file.name,
				url: response.data.data.url,
			}

			setUploadedFiles((prev) => [...prev, newFile])
			onUploadComplete?.(newFile)
			showSuccess(`Archivo ${file.name} subido exitosamente`)

			return newFile
		} catch (error) {
			showError(`Error al subir ${file.name}`)
			return null
		} finally {
			setUploading(false)
			setUploadProgress(0)
		}
	}

	const handleDrop = useCallback(
		(e: React.DragEvent<HTMLDivElement>) => {
			e.preventDefault()
			setDragOver(false)

			if (!canUpload) return

			const files = Array.from(e.dataTransfer.files)
			files.forEach((file) => uploadFile(file))
		},
		[canUpload, idIncapacidad, tipoDocumento]
	)

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		setDragOver(true)
	}

	const handleDragLeave = () => {
		setDragOver(false)
	}

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files || !canUpload) return

		Array.from(e.target.files).forEach((file) => uploadFile(file))
		e.target.value = ''
	}

	const handleRemove = (id: number) => {
		setUploadedFiles((prev) => prev.filter((f) => f.id !== id))
	}

	if (!canUpload) {
		return null
	}

	return (
		<Box>
			<Box
				onDrop={handleDrop}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				sx={{
					border: '2px dashed',
					borderColor: dragOver ? 'primary.main' : 'divider',
					borderRadius: 2,
					p: 4,
					textAlign: 'center',
					backgroundColor: dragOver ? 'action.hover' : 'transparent',
					transition: 'all 0.2s',
					cursor: 'pointer',
					opacity: uploading ? 0.5 : 1,
				}}
			>
				<input
					type="file"
					multiple
					accept={acceptedTypes.join(',')}
					onChange={handleFileSelect}
					style={{ display: 'none' }}
					id={`file-upload-${idIncapacidad}`}
				/>
				<label htmlFor={`file-upload-${idIncapacidad}`}>
					<CloudUploadIcon sx={{ fontSize: 48, color: 'action.active', mb: 1 }} />
					<Typography variant="body1" gutterBottom>
						Arrastra archivos aquí o haz clic para seleccionar
					</Typography>
					<Typography variant="caption" color="text.secondary">
						Tipos permitidos: {acceptedTypes.join(', ')} | Tamaño máximo:{' '}
						{maxSizeMB}MB
					</Typography>
				</label>
			</Box>

			{uploading && (
				<Box sx={{ mt: 2 }}>
					<LinearProgress variant="determinate" value={uploadProgress} />
					<Typography variant="caption" color="text.secondary">
						Subiendo... {uploadProgress}%
					</Typography>
				</Box>
			)}

			{uploadedFiles.length > 0 && (
				<Box sx={{ mt: 2 }}>
					<Typography variant="body2" fontWeight={500} gutterBottom>
						Archivos subidos ({uploadedFiles.length})
					</Typography>
					{uploadedFiles.map((file) => (
						<Box
							key={file.id}
							sx={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
								p: 1,
								border: '1px solid',
								borderColor: 'divider',
								borderRadius: 1,
								mb: 1,
							}}
						>
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
								<InsertDriveFileIcon color="action" />
								<Typography variant="body2">{file.nombre}</Typography>
							</Box>
							<Box>
								<IconButton
									size="small"
									onClick={() => window.open(file.url, '_blank')}
								>
									<CheckCircleIcon color="success" fontSize="small" />
								</IconButton>
								<IconButton
									size="small"
									onClick={() => handleRemove(file.id)}
								>
									<DeleteIcon color="error" fontSize="small" />
								</IconButton>
							</Box>
						</Box>
					))}
				</Box>
			)}
		</Box>
	)
}