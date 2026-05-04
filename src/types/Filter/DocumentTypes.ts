export type DocumentType = {
  nameTypeDocument: string
}

export type NormalizedDocumentType = {
  id: string
  label: string
}

export type DocumentTypeParam = {
  idOrg: number
  filters: ApiFilters
}

export type ApiFilters = {
  idVa?: number
  end: string
  start: string
  idDepartments?: number[]
  idCities?: number[]
  idRegionals?: number[]
}
