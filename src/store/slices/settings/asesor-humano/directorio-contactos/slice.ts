import { ReducerType } from '@/types/Reducer'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
	createContact,
	deleteContact,
	getActiveContacts,
	getContacts,
	updateContact,
} from './actions'
import { AppState } from '@/store/index'
import { Contact, RawContact } from '@/types/Settings/asesor-humano/directorio'

const initialState: ReducerType<Contact[]> = {
	getStatus: 'idle',
	resource: [],
}

const Slice = createSlice({
	name: 'plantillas-respuesta',
	initialState,
	reducers: {
		resetContacts: () => initialState,
	},
	extraReducers: (builder) => {
		builder
			.addCase(getContacts.pending, (state) => {
				state.getStatus = 'pending'
				state.resource = initialState.resource
			})
			.addCase(
				getContacts.fulfilled,
				(state, action: PayloadAction<RawContact[]>) => {
					state.getStatus = 'resolved'
					state.resource = action.payload.map((item) => {
						const { city, department, ...rest } = item
						return {
							...rest,
							id: item.idContact,
							idCity: city.id,
							idDepartment: department.id,
							city: city.name,
							department: department.name,
						}
					})
				}
			)
			.addCase(getContacts.rejected, (state) => {
				state.getStatus = 'rejected'
				state.resource = initialState.resource
			})
			.addCase(getActiveContacts.pending, (state) => {
				state.getStatus = 'pending'
				state.resource = initialState.resource
			})
			.addCase(
				getActiveContacts.fulfilled,
				(state, action: PayloadAction<RawContact[]>) => {
					state.getStatus = 'resolved'
					state.resource = action.payload.map((item) => {
						const { city, department, ...rest } = item
						return {
							...rest,
							id: item.idContact,
							idCity: city.id,
							idDepartment: department.id,
							city: city.name,
							department: department.name,
						}
					})
				}
			)
			.addCase(getActiveContacts.rejected, (state) => {
				state.getStatus = 'rejected'
				state.resource = initialState.resource
			})
			.addCase(
				createContact.fulfilled,
				(state, action: PayloadAction<RawContact>) => {
					const { idContact, city, department, ...rest } =
						action.payload

					// Crear el nuevo contacto con los valores formateados
					const newContact = {
						...rest,
						id: idContact,
						idContact,
						city: city.name,
						department: department.name,
						idCity: city.id,
						idDepartment: department.id,
					}

					// Encontrar la posición correcta en la lista ordenada
					const insertIndex = state.resource.findIndex(
						(item) => item.name.localeCompare(newContact.name) > 0
					)

					if (insertIndex === -1) {
						state.resource.push(newContact) // Agregar al final si no hay un índice válido
					} else {
						state.resource.splice(insertIndex, 0, newContact)
					}
				}
			)
			.addCase(
				updateContact.fulfilled,
				(state, action: PayloadAction<RawContact>) => {
					const { idContact, city, department, ...rest } =
						action.payload

					// Buscar el índice actual del contacto
					const index = state.resource.findIndex(
						(item) => item.idContact === idContact
					)
					if (index === -1) return

					// Crear la versión actualizada del contacto
					const updatedContact = {
						...state.resource[index], // Mantener los valores previos que no vienen en action.payload
						...rest,
						city: city.name,
						department: department.name,
						idCity: city.id,
						idDepartment: department.id,
					}

					// Eliminar el contacto de su posición actual
					state.resource.splice(index, 1)

					// Insertar el contacto en la posición correcta usando `findIndex` para evitar `.sort()`
					const insertIndex = state.resource.findIndex(
						(item) =>
							item.name.localeCompare(updatedContact.name) > 0
					)
					if (insertIndex === -1) {
						state.resource.push(updatedContact) // Agregar al final si no hay un índice válido
					} else {
						state.resource.splice(insertIndex, 0, updatedContact)
					}
				}
			)
			.addCase(
				deleteContact.fulfilled,
				(state, action: PayloadAction<number>) => {
					state.resource = state.resource.filter(
						(item) => item.idContact !== action.payload
					)
				}
			)
	},
})

export const { resetContacts } = Slice.actions

export const selectContacts = (state: AppState) => state.directorioContactos
export const contactsSelector = createSelector(selectContacts, (state) => state)

export const directorioReducer = Slice.reducer
