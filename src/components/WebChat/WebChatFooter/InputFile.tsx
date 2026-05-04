import React, { useEffect, useRef, useState } from 'react'
import { getIconFile } from '@/utils/helpers/fileTypes'
import { useSnackbar } from 'notistack'
import { FileType } from '@/types/file'
import {
	acceptedFileTypes,
	acceptedImageTypes,
	fileTypes,
	imageTypes,
} from '@/utils/constants/fileTypes'
import { resetFileInfo, updateFileInfo } from '@/store/slices/humanAgent'
import { useAppDispatch } from '@/hooks/useReduxHooks'
import { useChatContext } from '@/hooks/asesor-humano/useChatContext'

interface Props {
	setShowFilePreview: React.Dispatch<React.SetStateAction<boolean>>
	channelId: number | undefined
}

interface MBLimit {
	files: number
	images: number
}

export const InputFile = ({ setShowFilePreview, channelId }: Props) => {
	const inputRef = useRef<HTMLInputElement>(null)
	const dispatch = useAppDispatch()
	const [mbLimit, setMbLimit] = useState<MBLimit>({
		files: 20,
		images: 20,
	})
	const [onlyAcceptImages, setOnlyAcceptImages] = useState(false)

	const { enqueueSnackbar } = useSnackbar()
	const { conversationId } = useChatContext()

	const showFileHandler = () => {
		setShowFilePreview(true)
	}

	const cleanInputFile = () => {
		if (inputRef.current) {
			inputRef.current.value = ''
		}
	}

	const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files ? e.target.files[0] : null
		const reader = new FileReader()

		// Eliminar adjunto del reducer si ya había uno
		dispatch(resetFileInfo({ conversationId }))
		setShowFilePreview(false)

		if (file !== null) {
			// Definir máximo según tipo de archivo
			let maxSize: number

			// Caso de Facebook e Instagram
			if (onlyAcceptImages) {
				maxSize = mbLimit.images
			} else {
				// Verificar tipo de archivo (imagen u otro archivo)
				if (imageTypes.includes(file.type as FileType)) {
					maxSize = mbLimit.images
				} else if (fileTypes.includes(file.type as FileType)) {
					maxSize = mbLimit.files
				}
				// Valor 0 indicando para indicar que el tipo de archivo no es permitido
				else {
					maxSize = 0
				}
			}
			maxSize *= 1000000

			// Archivo permitido
			if (maxSize > 0) {
				// Validar tamaño
				if (file.size < maxSize) {
					console.log('file', file)
					reader.readAsDataURL(file)
					reader.onload = function () {
						// Verificar si la conversión a base64 fue exitosa
						if (
							typeof reader.result === 'string' &&
							reader.result.startsWith('data:')
						) {
							const url = URL.createObjectURL(file)

							// Agregar adjunto al reducer
							dispatch(
								updateFileInfo({
									conversationId,
									fileInfo: {
										base64: reader.result,
										blobUrl: url,
										icon: getIconFile(
											file.type as FileType,
											url
										),
										name: file.name,
										type: file.type as FileType,
									},
								})
							)

							showFileHandler()
						} else {
							enqueueSnackbar('Error al procesar el archivo', {
								variant: 'error',
							})
						}
					}
				} else {
					enqueueSnackbar(
						`Archivo muy grande (máximo ${maxSize / 1000000} MB)`,
						{
							variant: 'error',
							autoHideDuration: 5000,
						}
					)
				}
			} else {
				enqueueSnackbar('Tipo de archivo no permitido', {
					variant: 'warning',
				})
			}
		} else {
			enqueueSnackbar('Error de archivo', { variant: 'error' })
		}

		reader.onerror = function () {
			enqueueSnackbar('Error de archivo', { variant: 'error' })
		}

		cleanInputFile()
	}

	useEffect(() => {
		if (channelId) {
			switch (channelId) {
				// Web
				case 1:
					setMbLimit({
						files: 20,
						images: 20,
					})
					break
				// Facebook e Instagram
				case 2:
				case 5:
					setMbLimit({
						files: 0,
						images: 8,
					})
					setOnlyAcceptImages(true)
					break
				// WhatsApp
				case 3:
					setMbLimit({
						files: 20,
						images: 5,
					})
					break
			}
		}
	}, [channelId])

	return (
		<input
			ref={inputRef}
			hidden
			accept={onlyAcceptImages ? acceptedImageTypes : acceptedFileTypes}
			onChange={handleUpload}
			type="file"
		/>
	)
}
