import pdf from '@/assets/images/PDF_file_icon.svg'
import doc from '@/assets/images/docx_icon.svg'
import excel from '@/assets/images/xlsx_icon.svg'
import ods from '@/assets/images/ODS_file_icon.svg'
import odp from '@/assets/images/ODP_file_icon.svg'
import odt from '@/assets/images/ODT_file_icon.svg'
import downloadIcon from '@/assets/images/download_file_icon.svg'

import { FileType } from '@/types/file'

export const getIconFile = (type: FileType, files: string) => {
	if (type === 'application/pdf') {
		return pdf
	} else if (
		type ===
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
		type === 'application/msword'
	) {
		return doc
	} else if (
		type ===
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
		type === 'application/vnd.ms-excel' ||
		type === 'text/csv'
	) {
		return excel
	} else if (type === 'application/vnd.oasis.opendocument.spreadsheet') {
		return ods
	} else if (type === 'application/vnd.oasis.opendocument.presentation') {
		return odp
	} else if (type === 'application/vnd.oasis.opendocument.text') {
		return odt
	} else if (
		type === 'image/gif' ||
		type === 'image/jpeg' ||
		type === 'image/jpg' ||
		type === 'image/png' ||
		type === 'image/svg+xml' ||
		type === 'image/avif' ||
		type === 'image/webp'
	) {
		return files
	} else return downloadIcon
}
