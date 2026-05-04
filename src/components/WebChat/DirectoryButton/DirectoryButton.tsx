import React, { useEffect, useState } from 'react'
import { Box, IconButton, TextField, Tooltip, Typography } from '@mui/material'
import { useChatContext } from '@/hooks/asesor-humano/useChatContext'
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'
import {
	contactsSelector,
	getActiveContacts,
	resetContacts,
} from '@/store/slices/settings/asesor-humano'
import { ContactPhone } from '@mui/icons-material'
import { ConfirmationModal } from '@/components/Dialog'
import { Contact } from '@/types/Settings/asesor-humano/directorio'
import { ContactCard } from './ContactCard'
import { GridContainer } from '@/components/GridContainer'
import {
	removeDirectoryContact,
	resetActiveChat,
	selectDirectoryContact,
} from '@/store/slices/humanAgent'
import { ContactCardSkeleton } from './ContactCardSkeleton'
import { useInputInfo } from '@/hooks/asesor-humano/useInputInfo'

export const DirectoryButton = () => {
	const dispatch = useAppDispatch()
	const { resource, getStatus } = useAppSelector(contactsSelector)
	const [openContacts, setOpenContacts] = useState(false)
	const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
	const [searchTerm, setSearchTerm] = useState('')
	const { getInputInfo, updateInputInfo } = useInputInfo()

	const {
		conversationId,
		setConversationId,
		drawerWidth,
		agentSocketStatus,
		setPrevConversationId,
		inputValue,
	} = useChatContext()

	// Abrir popup con lista de contactos
	const handleToggleContacts = () => {
		// Refrescar listado
		if (!openContacts) {
			dispatch(getActiveContacts({ snackbar: true }))
		}
		setSelectedContact(null)
		setOpenContacts(!openContacts)
	}

	// Seleccionar contacto y trasladar a un nuevo chat
	const handleConfirmSelection = () => {
		setOpenContacts(false)
		if (selectedContact) {
			// Desmarcar conversación activa
			if (conversationId > 0) {
				setPrevConversationId(conversationId)
				// setInputValue()
				const prevConv = getInputInfo(conversationId)
				if (prevConv) {
					updateInputInfo({
						conversationId,
						inputValue,
					})
				}
				dispatch(resetActiveChat())
			}
			setConversationId(0)

			const {
				city,
				department,
				email,
				idNumber,
				idType,
				idVa,
				name,
				phone,
				idCity,
			} = selectedContact
			dispatch(
				selectDirectoryContact({
					idCiudad: idCity,
					ciudad: city,
					departamento: department,
					email,
					identificacion: idNumber,
					idVa,
					listadoMensajes: [],
					nombre: name,
					telefono: phone,
					tipoIdentificacion: idType,
					active: true,
				})
			)
			// Agregar conversación de directorio a reducer que controla el envío de archivos con id 0
			// dispatch(newInputInfo({ conversationId: 0 }))
		}
	}

	const handleSelectContact = (contact: Contact) => {
		setSelectedContact(contact)
	}

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(event.target.value)
	}

	// Filtrar contactos en función de name, phone, email y city
	const filteredContacts = resource.filter(
		(contact) =>
			contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			contact.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			contact.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			contact.department?.toLowerCase().includes(searchTerm.toLowerCase())
	)

	// Remover conversación de directorio cuando se selecciona una conversación diferente
	useEffect(() => {
		if (conversationId !== 0 && selectedContact) {
			setSelectedContact(null)
			dispatch(removeDirectoryContact())
			// Eliminar input info de la conversación del directorio
			// dispatch(removeInputInfo({ conversationId: 0 }))
		}
	}, [conversationId])

	// Obtener listado de contactos cuando el asesor se conecte
	useEffect(() => {
		if (agentSocketStatus === 'CONECTADO') {
			dispatch(getActiveContacts({}))
		}
		// Resetear contactos cuando el asesor esté desconectado
		else if (agentSocketStatus === 'DESCONECTADO') {
			dispatch(resetContacts())
			setConversationId(-1)
		}
	}, [agentSocketStatus])

	return (
		<Box sx={{ width: drawerWidth }}>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				<Typography variant="h6">Directorio de contactos</Typography>
				<Tooltip
					title={
						agentSocketStatus === 'DESCONECTADO'
							? 'Conéctate para ver el directorio de contactos'
							: 'Abrir directorio de contactos'
					}
				>
					<span>
						<IconButton
							onClick={handleToggleContacts}
							disabled={agentSocketStatus === 'DESCONECTADO'}
						>
							<ContactPhone />
						</IconButton>
					</span>
				</Tooltip>
			</Box>

			<ConfirmationModal
				confirmAction={handleConfirmSelection}
				handleClose={handleToggleContacts}
				open={openContacts}
				title="Directorio de contactos"
				confirmButtonText="Confirmar"
				contentText="Selecciona un contacto para iniciar una nueva conversación"
				disableButton={!selectedContact}
				maxWidth="lg"
			>
				{/* Campo de búsqueda */}
				<Box my={1}>
					<TextField
						fullWidth
						label="Buscar contacto"
						variant="outlined"
						value={searchTerm}
						onChange={handleSearchChange}
						autoFocus
					/>
				</Box>

				{getStatus === 'resolved' && resource.length > 0 ? (
					<GridContainer>
						{filteredContacts.map((contact) => (
							<ContactCard
								key={contact.id}
								contact={contact}
								handleSelectContact={handleSelectContact}
								isSelected={selectedContact?.id === contact.id}
								handleConfirmSelection={handleConfirmSelection}
							/>
						))}
					</GridContainer>
				) : (
					<GridContainer>
						{[
							...Array(3)
								.fill(0)
								.map((_, i) => <ContactCardSkeleton key={i} />),
						]}
					</GridContainer>
				)}
			</ConfirmationModal>
		</Box>
	)
}
