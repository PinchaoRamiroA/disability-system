import React, { useState, useEffect } from 'react'
import { Table } from '@/components/Table'
import { RowAction, TableAction, TableHeader } from '@/types/Table'
import { NormalizedCompany } from '@/types/Company'
import { AlertDialog } from '@/components/Dialog'
import { Button } from '@mui/material'
import { CompanyForm } from './CompanyForm/CompanyForm'
import { useToggleBooleanState } from '@/hooks/useToggleBooleanState'
import { ButtonGroupDialog, FormDialog } from '@/components/Dialog/styles'

import {
  getCompanies as getCompaniesAction,
  deleteCompany as deleteCompanyAction,
  putCompany as putCompanyAction,
  companiesSelector,
} from '@/store/slices/companies'
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'
import { Box } from '@mui/system'

const headers: TableHeader[] = [
  { propertyName: 'name', label: 'Nombre' },
  { propertyName: 'schemaName', label: 'Nombre esquema' },
]

const companyTemplate: NormalizedCompany = {
  id: -1,
  idOrg: -1,
  name: '',
  schemaName: '',
}

export const CompaniesContainer = () => {
  const dispatch = useAppDispatch()
  const { resource: companies, getStatus } = useAppSelector(companiesSelector)

  useEffect(() => {
    dispatch(getCompaniesAction())
  }, [dispatch])

  //current Company to perform an action (update, delete)
  const [currentCompany, setCurrentCompany] =
    useState<NormalizedCompany>(companyTemplate)

  //createCompany
  const [openCreate, setOpenCreate, setCloseCreate] =
    useToggleBooleanState(false)

  //updateCompany
  const [openUpdate, setOpenUpdate, setCloseUpdate] =
    useToggleBooleanState(false)

  const handleOpenUpdate = (param: NormalizedCompany) => {
    setOpenUpdate()
    setCurrentCompany(param)
  }
  const handleCloseUpdate = () => {
    setCloseUpdate()
    setCurrentCompany(companyTemplate)
  }

  const updateCompany = (toUpdateCompany: Partial<NormalizedCompany>) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ..._company } = toUpdateCompany
    dispatch(putCompanyAction(_company))
    setCloseUpdate()
  }

  //deleteCompany
  const [openDelete, setOpenDelete, setCloseDelete] =
    useToggleBooleanState(false)

  const handleOpenDelete = (param: NormalizedCompany) => {
    setOpenDelete()
    setCurrentCompany(param)
  }

  const handleCloseDelete = () => {
    setCloseDelete()
    setCurrentCompany(companyTemplate)
  }

  const deleteCompany = () => {
    dispatch(deleteCompanyAction(currentCompany.idOrg))
    setCloseDelete()
  }

  const tableAction: TableAction = {
    id: 'setOpenCreate',
    label: 'Crear',
    action: setOpenCreate,
  }

  const rowActions: RowAction<NormalizedCompany>[] = [
    {
      id: 'handleOpenUpdate',
      label: 'Actualizar',
      action: handleOpenUpdate,
    },
    {
      id: 'handleOpenDelete',
      label: 'Eliminar',
      action: handleOpenDelete,
    },
  ]

  return (
    <Box sx={{ maxWidth: 1200 }}>
      <Button
        color="secondary"
        variant="contained"
        sx={{ ml: 'auto', mb: 2, display: 'block' }}
        onClick={tableAction.action}
      >
        {tableAction.label}
      </Button>
      <Table<NormalizedCompany>
        status={getStatus}
        headers={headers}
        rowActions={rowActions}
        data={companies}
      />
      <AlertDialog
        title="Crear compañía"
        open={openCreate}
        onClose={setCloseCreate}
      >
        <Box sx={{ p: 3 }}>
          Contacta con <strong>soporte@be-prosolutions.com</strong>
        </Box>
        <ButtonGroupDialog>
          <Button variant="contained" onClick={setCloseCreate}>
            Aceptar
          </Button>
        </ButtonGroupDialog>
      </AlertDialog>
      <AlertDialog
        title="Actualizar compañía"
        open={openUpdate}
        onClose={setCloseUpdate}
      >
        <CompanyForm
          company={currentCompany}
          confirmAction={updateCompany}
          cancelAction={handleCloseUpdate}
        />
      </AlertDialog>
      <AlertDialog
        open={openDelete}
        onClose={setCloseDelete}
        title="Eliminar compañía"
        description={`Se eliminará la compañía ${currentCompany.name}. Esta acción es irreversible.`}
      >
        <FormDialog>
          <ButtonGroupDialog>
            <Button variant="contained" onClick={handleCloseDelete}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={deleteCompany}
            >
              Eliminar
            </Button>
          </ButtonGroupDialog>
        </FormDialog>
      </AlertDialog>
    </Box>
  )
}
