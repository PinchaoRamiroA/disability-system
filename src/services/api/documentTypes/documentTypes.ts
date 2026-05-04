import { orchestratorWithAuthClient } from '@/services/api/utilities/instances'
import { DocumentType, ApiFilters } from '@/types/Filter/DocumentTypes'

export async function getDocumentTypes(idOrg: number, filters: ApiFilters) {
  const response = await orchestratorWithAuthClient.get<DocumentType[]>(
    `/api/statistics/organization/${idOrg}/entries_clients/typeDocuments`,
    { params: filters }
  )

  return response.data
}
