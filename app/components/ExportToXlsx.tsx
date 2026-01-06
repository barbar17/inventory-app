import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import { Table } from '@tanstack/react-table'

export async function ExportToXlsx<T>(table: Table<T>, filename: string) {
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet(filename)

  const excludedColumnIds = ['aksi'];
  const columns = table.getVisibleLeafColumns().filter(col => !excludedColumnIds.includes(col.id));
  const rows = table.getPrePaginationRowModel().rows

  sheet.columns = columns.map(col => ({
    header: col.columnDef.header as string,
    key: col.id,
  }))

  const headerRow = sheet.getRow(1)
  headerRow.font = { bold: true }

  sheet.getRow(1).eachCell(cell => {
    cell.border = {
      bottom: { style: 'thin' },
    }
  })

  rows.forEach(row => {
    sheet.addRow(
      columns.map(col => {
        const cell = row
          .getVisibleCells()
          .find(c => c.column.id === col.id)

        const meta = col.columnDef.meta

        return meta?.print
          ? meta.print?.(cell?.getValue())
          : cell?.getValue()
      })
    )
  })

  sheet.eachRow((row) => {
    row.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
      }
    })
  })

  sheet.columns.forEach(column => {
    let maxLength = 10

    column.eachCell?.({ includeEmpty: true }, cell => {
      maxLength = Math.max(
        maxLength,
        String(cell.value ?? '').length
      )
    })

    column.width = maxLength + 2
  })

  const buffer = await workbook.xlsx.writeBuffer()
  saveAs(new Blob([buffer]), `${filename}.xlsx`)
}