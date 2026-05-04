import {
	FormatedChat,
	InteractionFact,
	Mensaje,
	RequestData,
	ResponseAnswer,
} from '@/types/HumanAgent/WebChat'
import {
	InteractionBase,
	InteractionHistory,
} from '@/types/reports/humanAgent/History'
import { MensajesConfig } from '@/types/Settings/Mensajes'
import { nanoid } from '@reduxjs/toolkit'
import moment from 'moment'
import { CUSTOM_MESSAGES } from '../constants/localStorageConstants'

export const formatInteractionFact = (
	messages: InteractionFact[] | InteractionHistory[] | InteractionBase[]
): FormatedChat[] => {
	let requestData: RequestData | null
	let responseAnswer: ResponseAnswer | null
	let interactionTime: string
	const len = messages.length

	const formatedChat: FormatedChat[] = []

	// for es la forma más óptima para iterar
	for (let i = 0; i < len; i++) {
		const interaction = messages[i]

		interactionTime = moment(interaction.interactionTime).format(
			'DD/MM/YY, h:mm'
		)
		requestData = JSON.parse(interaction.requestData)
		responseAnswer = JSON.parse(interaction.responseAnswer)

		// Validar requestData
		if (requestData) {
			if (requestData.context.fileArrayAttachment) {
				if (requestData.context.fileArrayAttachment.length) {
					requestData.context.fileArrayAttachment.forEach(
						(attachment) => {
							if (attachment.itemFile) {
								const { contentType, name, url } =
									attachment.itemFile
								formatedChat.push({
									id: nanoid(),
									client: true,
									file: {
										contentType,
										name,
										url,
									},
									message: attachment.itemValue ?? name,
									messageTime: interactionTime,
									interactionId: interaction.id,
									itemOptions: [],
									itemType: 1,
								})
							} else {
								const { contentType, name, url } = attachment
								if (contentType && name && url) {
									formatedChat.push({
										id: nanoid(),
										client: true,
										file: {
											contentType,
											name,
											url,
										},
										message: name,
										messageTime: interactionTime,
										interactionId: interaction.id,
										itemOptions: [],
										itemType: 1,
									})
								}
							}
						}
					)
				} else if (requestData.text.trim() !== '') {
					formatedChat.push({
						id: nanoid(),
						message: requestData.text,
						messageTime: interactionTime,
						client: true,
						file: null,
						interactionId: interaction.id,
						itemOptions: [],
						itemType: 1,
					})
				}
			} else {
				formatedChat.push({
					id: nanoid(),
					message: requestData.text,
					messageTime: interactionTime,
					client: true,
					file: null,
					interactionId: interaction.id,
					itemOptions: [],
					itemType: 1,
				})
			}
		}

		// Validar responseAnswer
		if (responseAnswer) {
			responseAnswer.responseItems.forEach((item) => {
				const { itemOptions, itemType, itemValue, itemFile } = item

				formatedChat.push({
					id: nanoid(),
					message: itemValue
						? itemValue
						: itemType === 9
						? 'Opciones'
						: '',
					messageTime: interactionTime,
					client: false,
					file: itemFile ?? null,
					interactionId: interaction.id,
					itemOptions: itemOptions ?? [],
					itemType,
				})
			})
		}
	}

	return formatedChat
}

export const formatConversation = (
	interactionFacts: InteractionFact[],
	messages: Mensaje[]
): FormatedChat[] => {
	const conversation = formatInteractionFact(interactionFacts)

	const len = messages.length

	for (let i = 0; i < len; i++) {
		const interaction = messages[i]
		let commandMessage = ''

		if (interaction.tipoMensaje === 'COMMAND') {
			commandMessage = getCommandMessage(interaction.mensaje)
		}

		if (
			interaction.tipoMensaje !== 'COMMAND' ||
			commandMessage.length > 0
		) {
			const message =
				commandMessage.length > 0 ? commandMessage : interaction.mensaje
			conversation.push({
				id: nanoid(),
				client: interaction.tipoUsuario === 'CLIENTE',
				file: interaction.adjunto,
				message,
				messageTime: moment(interaction.fechaMensaje).format(
					'DD/MM/YY, h:mm:ss'
				),
				itemOptions: [],
				itemType: 1,
			})
		}
	}

	return conversation
}

export const parsedRequestData = (
	interaction: InteractionHistory | InteractionBase
) => {
	return JSON.parse(interaction.requestData) as RequestData
}

export const getLastInteraction = (
	interaction: InteractionBase
): FormatedChat | undefined => {
	const messages = formatInteractionFact([interaction])
	return messages[messages.length - 1]
}

/**
 * Retorna la fecha dada en formato DD/MM/YY, h:mm
 * @param date 'DD/MM/YY, h:mm:ss'
 */
export const formatDate = (date: string) => {
	const format = 'DD/MM/YY, H:mm'
	const parsedDate = moment(date, format)

	// Se puede formatear con moment
	if (parsedDate.isValid()) {
		return parsedDate.format(format)
	}

	// Quitar últimos dos caracteres (segundos)
	return date.substring(0, date.length - 3)
}

export const revokeObjectURLs = (messages: FormatedChat[]) => {
	messages.forEach((mss) => {
		if (mss.file?.blobUrl) {
			URL.revokeObjectURL(mss.file.blobUrl)
		}
	})
}

/**
 * Obtener listado de mensajes personalizados del localStorage
 */
export const getLSCustomMessages = (): MensajesConfig[] => {
	const lsValue = localStorage.getItem(CUSTOM_MESSAGES)

	if (lsValue) {
		try {
			const parsedMessages = JSON.parse(lsValue) as MensajesConfig[]

			// Valida si es un array
			if (!Array.isArray(parsedMessages)) return []

			return parsedMessages
		} catch {
			return []
		}
	}
	return []
}

/**
 * Obtener mensaje específico de la lista de mensajes configurados
 */
export const getCommandMessage = (command: string) => {
	try {
		const findValue = getLSCustomMessages().find(
			(item) => item.acronym === command
		)
		return findValue?.clientMessage ? findValue.clientMessage : ''
	} catch {
		return command
	}
}
