import { Button } from 'react-bootstrap';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const DownloadButtons = ({ items }: {items: any}) => {
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Inventory List', 14, 10);
    
    const tableColumn = ['Name', 'Type', 'Quantity', 'Location', 'Description', 'IP Address', 'MAC Address'];
    const tableRows = items.map((item: any) => [
      item.name,
      item.type === 'goods' ? 'Goods' : 'IT Device',
      item.quantity,
      item.location,
      item.description,
      item.ipAddress || '-',
      item.macAddress || '-'
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save('inventory.pdf');
  };

  const downloadExcel = () => {
    const worksheetData = items.map((item: any) => ({
      Name: item.name,
      Type: item.type === 'goods' ? 'Goods' : 'IT Device',
      Quantity: item.quantity,
      Location: item.location,
      Description: item.description,
      'IP Address': item.ipAddress || '-',
      'MAC Address': item.macAddress || '-'
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventory');
    XLSX.writeFile(workbook, 'inventory.xlsx');
  };

  return (
    <div className="mb-3">
      <Button variant="success" onClick={downloadPDF} className="me-2">Download PDF</Button>
      <Button variant="info" onClick={downloadExcel}>Download Excel</Button>
    </div>
  );
};

export default DownloadButtons;
