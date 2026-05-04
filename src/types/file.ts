export type FileType =
	| 'image/png'
	| 'image/jpg'
	| 'image/jpeg'
	| 'image/gif'
	| 'image/svg+xml'
	| 'image/avif'
	| 'image/webp'
	| 'text/csv'
	| 'application/pdf'
	| 'application/msword'
	| 'application/vnd.ms-excel'
	| 'application/vnd.oasis.opendocument.text'
	| 'application/vnd.oasis.opendocument.spreadsheet'
	| 'application/vnd.oasis.opendocument.presentation'
	| 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
	| 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

export interface FileInfo {
	base64: string | ArrayBuffer | null
	blobUrl: string
	icon: string
	name: string
	type: FileType
}

export interface InputInfo {
	conversationId: number
	lastInteraction: string
	previewFile: FileInfo | null
}
