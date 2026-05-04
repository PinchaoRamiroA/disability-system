import React, { useEffect, useState } from 'react'

import Image from 'next/image'

import { getIconFile } from '@/utils/helpers/fileTypes'

import { Link, Typography } from '@mui/material'

import { Adjunto } from '@/types/HumanAgent/WebChat'
import { FileType } from '@/types/file'
import { useWebChatState } from '@/hooks/asesor-humano/useWebChatState'
import { useAppDispatch } from '@/hooks/useReduxHooks'
import { getFileAction } from '@/store/slices/uploadFile'

interface Props {
	file: Adjunto
	conversationId?: number
	messageId?: string
}

export const FileManager = ({ conversationId, file, messageId }: Props) => {
	const dispatch = useAppDispatch()

	const { blobUrl: blobUrlFile, contentType, name, url } = file
	const [blobUrl, setblobUrl] = useState<string | undefined>(blobUrlFile)
	const [error, setError] = useState('')

	const { updateMessageBlobUrlState } = useWebChatState()

	useEffect(() => {
		// Generar url para poder obtener el icono
		if (!blobUrl) {
			handleGetFile()
		}
	}, [])

	// Agregar blobURL en el state del chat
	useEffect(() => {
		if (blobUrl && conversationId && messageId) {
			updateMessageBlobUrlState(blobUrl, conversationId, messageId)
		}
	}, [blobUrl])

	const handleGetFile = async () => {
		dispatch(
			getFileAction({
				url,
				successCallback: (res) => {
					setblobUrl(
						URL.createObjectURL(
							new Blob([res], { type: contentType })
						)
					)
					setError('')
				},
				failedCallback: (message) => {
					setblobUrl(undefined)
					setError(message)
				},
			})
		)
	}

	if (blobUrl) {
		return (
			<Link href={blobUrl} download={name}>
				<Image
					src={getIconFile(contentType as FileType, blobUrl)}
					width={150}
					height={150}
					alt={name}
				/>
			</Link>
		)
	}
	return (
		<Typography fontSize={14}>
			{error !== '' ? error : 'Cargando archivo...'}
		</Typography>
	)
}
