'use client'

import { Table } from '@tanstack/react-table'

type PrintOptions = {
  title: string,
}

export function PrintTable<T>(table: Table<T>, options: PrintOptions) {
  const { title } = options;

  const headers = table.getVisibleLeafColumns().map(col => `<th>${String(col.columnDef.header)}</th>`);

  const rows = table.getPrePaginationRowModel().rows.map(row => `
    <tr>
      ${row.getVisibleCells().map(cell => `
        <td>${cell.column.columnDef.meta?.print?.(cell.getValue()) ?? String(cell.getValue())}</td>
      `)}
    </tr>`);

  const tableHtml = `
    <table>
      <thead>
        <tr>${headers}</tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `

  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const html = `
  <html>
    <head>
      <title>${title}</title>
      <style>
        @page {
          size: A4 portrait;
          margin: 0cm;
        }
        body {
          font-family: Arial, sans-serif;
          font-size: 9pt;
          margin: 0;
          padding: 1cm;
          -webkit-print-color-adjust: exact;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
          word-wrap: break-word;
        }
        th, td {
          border: 1px solid #000;
          padding: 5px;
          font-size: 8pt;
          text-align: left;
        }
        thead {
          display: table-header-group;
          background: #f0f0f0;
        }
        tr {
          page-break-inside: avoid;
        }
        body {
          zoom: 0.80;
        }
      </style>
    </head>
    <body>
      <div style="margin-bottom: 10px;">
        <h2 style="margin-bottom: 4px;">Laporan Inventaris</h2>
      </div>
      ${tableHtml.replaceAll(",", "")}
    </body>
  </html>
  `

  printWindow.document.open()
  printWindow.document.write(html)
  printWindow.document.close()

  printWindow.focus()
}