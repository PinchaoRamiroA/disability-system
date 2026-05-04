export type DocumentTypeTypes =
	| 'CÉDULA CIUDADANIA'
	| 'PERMISO ESPECIAL'
	| 'TARJETA IDENTIDAD'
	| 'CÉDULA EXTRANJERIA'
	| 'PASAPORTE'
	| 'NÚMERO ÚNICO IDENTIFICACIÓN'
	| 'CARNET DIPLOMÁTICO'
	| 'SALVO CONDUCTO'
	| 'N.I.T'

export interface DocumentType {
	id: DocumentTypeTypes
	name: DocumentTypeTypes
}
