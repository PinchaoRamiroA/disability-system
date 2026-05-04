import React, { useEffect, useRef, useState } from 'react'

import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

import {
	Box,
	Grid,
	IconButton,
	OutlinedInput,
	Tooltip,
	useTheme,
} from '@mui/material'

import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import CloseIcon from '@mui/icons-material/Close'

import SendIcon from '@mui/icons-material/Send'
import { InputFile } from './InputFile'
import { FilePreview } from './FilePreview'

import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'
import { uploadFileAction, uploadFileSelector } from '@/store/slices/uploadFile'
import {
	resetInpuInfo,
	resetFileInfo,
	uploadedFile,
	uploadingFile,
	setSendingMessage,
	humanAgentDirectorySelector,
} from '@/store/slices/humanAgent'
import { useChatContext } from '@/hooks/asesor-humano/useChatContext'
import { Wysiwyg } from '@mui/icons-material'
import { getPlantillasRespuesta } from '@/store/slices/settings/asesor-humano'
import { useCompanyAndIdVa } from '@/hooks/useCompanyAndIdVa'
import { VerPlantillasRespuesta } from '../VerPlantillasRespuesta'
import { useLoading } from '@/hooks/useLoading'
import { ContactBAH } from '@/types/Settings/asesor-humano/directorio'
import { useInputInfo } from '@/hooks/asesor-humano/useInputInfo'
import { FileInfo } from '@/types/file'

interface Props {
	backgroundColor: string
	height: number | undefined
	inputValue: string
	showFilePreview: boolean
	setShowFilePreview: React.Dispatch<React.SetStateAction<boolean>>
}

interface Emoji {
	id: string
	shortcodes: string
	native: string
	size: string
}

export const WebChatFooter = ({
	height,
	inputValue,
	showFilePreview,
	setShowFilePreview,
}: Props) => {
	const dispatch = useAppDispatch()
	const inputRef = useRef<HTMLInputElement>(null)
	const {
		conversationId,
		sendMessage,
		currentChat,
		sendDirectoryMessage,
		setInputValue,
	} = useChatContext()
	const { idOrg } = useCompanyAndIdVa()
	const { startLoading, stopLoading } = useLoading()
	const {
		asesorHumano: { footer },
	} = useTheme()

	const directoryContact = useAppSelector(
		humanAgentDirectorySelector
	) as ContactBAH

	const [openEmojiPicker, setOpenEmojiPicker] = useState(false)
	const [openPlantillas, setOpenPlantillas] = useState(false)

	const { uploading, error } = useAppSelector(uploadFileSelector)
	const { getInputInfo } = useInputInfo()

	useEffect(() => {
		if (uploading) {
			console.log('Cargando')
		} else if (!error) {
			console.log('Subido')
			handleClosePreview()
		} else {
			console.log('error')
		}
	}, [uploading, error])

	// Enfocar el input cada vez que `sendingMessage` sea false
	useEffect(() => {
		if (!currentChat?.sendingMessage && inputRef.current) {
			inputRef.current.focus()
		}
	}, [currentChat?.sendingMessage])

	/**
	 * Activar loader de envío de mensajes
	 */
	const handleSendingMessage = () => {
		dispatch(setSendingMessage({ conversationId, sendingMessage: true }))
	}

	/**
	 * Envío de archivo
	 */
	const handleSendFile = (previewFile: FileInfo | null) => {
		// Enviar mensaje (archivo)
		if (previewFile?.base64) {
			// Activar loader de envío de mensaje
			dispatch(uploadingFile({ conversationId }))

			dispatch(
				uploadFileAction({
					base64: previewFile.base64,
					contentType: previewFile.type,
					callback: (data) => {
						sendMessage(previewFile.name, conversationId, {
							contentType: data.contentType,
							url: data.url,
							name: previewFile.name,
							blobUrl: previewFile.blobUrl,
						})
						// Desactivar loader de envío de mensaje
						dispatch(uploadedFile({ conversationId }))
					},
				})
			)
		}
	}

	/**
	 * Manejador de la tecla Enter
	 */
	const handleEnter = () => {
		const message = inputValue.trim()

		// Conversación de contacto de directorio (no hay suscripción a endpoint de chats topic/mensajes/asesor)
		if (directoryContact.active) {
			if (message.length) {
				sendDirectoryMessage(directoryContact, message)
			}
		}
		// Chats suscritos a endpoint topic/mensajes/asesor
		else {
			const inputInfo = getInputInfo(conversationId)
			// No hay mensaje ni adjunto para enviar
			if (message.length === 0 && !inputInfo?.previewFile) return

			// Activar loader de envío de mensaje
			handleSendingMessage()

			// Procesar envío de adjunto
			if (inputInfo) {
				handleSendFile(inputInfo.previewFile)
			}

			// Procesar envío de mensaje (texto)
			if (message.length) {
				sendMessage(message, conversationId, null)
			}
			// Limpiar mensaje (texto) en reducer
			dispatch(resetInpuInfo({ conversationId }))
		}

		// Limpiar caja de texto
		setInputValue('')

		// Cerrar emoji picker
		setOpenEmojiPicker(false)
	}

	/**
	 * Shift + enter para agregar un salto de línea en el textarea
	 */
	const addNewLine = () => {
		setInputValue(inputValue + '\r\n')
	}

	const handleKeyDowm = (e: React.KeyboardEvent<HTMLInputElement>) => {
		// Nueva línea
		if (e.shiftKey && e.key === 'Enter') {
			e.preventDefault()
			addNewLine()
		} else if (e.key === 'Enter') {
			e.preventDefault()
			handleEnter()
		}
	}

	const handleOpenEmojiPicker = () => {
		setOpenEmojiPicker(!openEmojiPicker)
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value)
	}

	const handleEmojiSelect = (emoji: Emoji) => {
		setInputValue(inputValue + emoji.native)
	}

	const handleClosePreview = () => {
		// Limpiar file en reducer
		dispatch(resetFileInfo({ conversationId }))
		setShowFilePreview(false)
	}

	// Ejecutar action para obtener listado de plantillas de respuesta
	const loadPlantillasRespuesta = () => {
		startLoading()
		dispatch(getPlantillasRespuesta({ idOrg })).then(() => {
			setOpenPlantillas(true)
			stopLoading()
		})
	}

	useEffect(() => {
		if (!openPlantillas && inputValue.length > 0 && inputRef.current) {
			inputRef.current.focus()
		}
	}, [inputValue])

	useEffect(() => {
		inputRef.current?.focus()
	}, [conversationId])

	return (
		<>
			{openEmojiPicker && (
				<Box sx={{ position: 'fixed', bottom: height }}>
					<Picker data={data} onEmojiSelect={handleEmojiSelect} />
				</Box>
			)}
			<Grid
				container
				bgcolor={footer.background}
				color={footer.iconsColor}
				alignItems="flex-end"
				sx={{ py: 1 }}
			>
				<Grid
					item
					xs="auto"
					display="flex"
					justifyContent="space-between"
					mx={2}
				>
					<IconButton onClick={handleOpenEmojiPicker} color="inherit">
						{openEmojiPicker ? (
							<CloseIcon />
						) : (
							<SentimentVerySatisfiedIcon />
						)}
					</IconButton>
					{!directoryContact.active && (
						<IconButton
							aria-label="upload picture"
							component="label"
							color="inherit"
							disabled={uploading}
						>
							<InputFile
								setShowFilePreview={setShowFilePreview}
								channelId={currentChat?.channel}
							/>
							<AttachFileIcon />
						</IconButton>
					)}
					<Tooltip title="Utilizar plantilla">
						<IconButton
							aria-label="obtener plantillas"
							color="inherit"
							onClick={loadPlantillasRespuesta}
						>
							<Wysiwyg />
						</IconButton>
					</Tooltip>
				</Grid>
				<Grid item xs>
					<OutlinedInput
						inputRef={inputRef}
						multiline
						fullWidth
						placeholder="Escribe tu mensaje"
						size="small"
						maxRows={5}
						onKeyDown={handleKeyDowm}
						value={inputValue}
						onChange={handleInputChange}
						disabled={
							currentChat?.sendingMessage ||
							directoryContact.listadoMensajes.length > 0
						}
						{...(directoryContact.active && {
							inputProps: { maxLength: 500 },
						})}
					/>
				</Grid>
				<Grid item xs="auto" mx={2}>
					<IconButton
						onClick={handleEnter}
						color="inherit"
						disabled={
							currentChat?.sendingMessage ||
							directoryContact.listadoMensajes.length > 0
						}
					>
						<SendIcon />
					</IconButton>
				</Grid>
			</Grid>

			{showFilePreview && (
				<FilePreview
					closePreview={handleClosePreview}
					footerHeight={height}
					uploading={uploading}
				/>
			)}

			{/* Modal con plantillas de respuesta */}
			<VerPlantillasRespuesta
				handleClose={() => setOpenPlantillas(false)}
				open={openPlantillas}
				setMessage={setInputValue}
			/>
		</>
	)
}
