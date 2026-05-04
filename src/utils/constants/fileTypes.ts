import { FileType } from '@/types/file'

export const imageTypes: FileType[] = [
	'image/png',
	'image/jpg',
	'image/jpeg',
	'image/gif',
	'image/svg+xml',
	'image/avif',
	'image/webp',
]

export const fileTypes: FileType[] = imageTypes.concat([
	'text/csv',
	'application/pdf',
	'application/msword',
	'application/vnd.ms-excel',
	'application/vnd.oasis.opendocument.text',
	'application/vnd.oasis.opendocument.spreadsheet',
	'application/vnd.oasis.opendocument.presentation',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
])

export const acceptedImageTypes = imageTypes.join(',')

export const acceptedFileTypes = fileTypes.join(',')
