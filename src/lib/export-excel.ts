/**
 * Utilidad de exportación a Excel / CSV con compatibilidad directa para Microsoft Excel
 * Incluye BOM UTF-8 (\uFEFF) y delimitador ';' para soporte nativo en configuraciones regionales en español.
 */

export interface ExportExcelColumn<T> {
    header: string
    accessor: keyof T | ((item: T) => string | number | boolean | null | undefined)
}

function escapeCsvCell(value: unknown): string {
    if (value === null || value === undefined) {
        return ''
    }
    const str = String(value)
    // Si contiene punto y coma, salto de línea o comillas dobles, envolver en comillas dobles
    if (str.includes(';') || str.includes('\n') || str.includes('\r') || str.includes('"')) {
        return `"${str.replace(/"/g, '""')}"`
    }
    return str
}

/**
 * Exporta un listado de objetos a un archivo CSV estructurado para Excel
 */
export function exportToExcelCsv<T>(
    items: T[],
    columns: ExportExcelColumn<T>[],
    filename: string = 'exportacion_contable.csv'
): boolean {
    try {
        if (!items || items.length === 0) {
            console.warn('No hay registros para exportar a Excel.')
            return false
        }

        // 1. Encabezados
        const headerRow = columns.map((col) => escapeCsvCell(col.header)).join(';')

        // 2. Filas de datos
        const dataRows = items.map((item) => {
            return columns
                .map((col) => {
                    let val: unknown
                    if (typeof col.accessor === 'function') {
                        val = col.accessor(item)
                    } else {
                        val = item[col.accessor]
                    }
                    return escapeCsvCell(val)
                })
                .join(';')
        })

        // 3. Unir con saltos de línea CRLF (\r\n para máxima compatibilidad con Windows/Excel)
        const csvContent = '\uFEFF' + [headerRow, ...dataRows].join('\r\n')

        // 4. Crear Blob
        const blob = new Blob([csvContent], {
            type: 'text/csv;charset=utf-8;',
        })

        // 5. Descargar archivo en el navegador
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.setAttribute('href', url)
        link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)

        return true
    } catch (err) {
        console.error('Error al exportar a Excel:', err)
        return false
    }
}
