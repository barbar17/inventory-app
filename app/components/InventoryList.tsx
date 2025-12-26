import { Table, Button } from 'react-bootstrap';

const InventoryList = ({ items, onEdit, onDelete, readOnly = false }:{ items:any, onEdit:any, onDelete:any, readOnly:boolean }) => {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Nama Perangkat</th>
          <th>Jenis Perangkat</th>
          <th>Jumlah</th>
          <th>Tahun Pengadaan</th>
          <th>Kondisi</th>
          <th>Lokasi</th>
          <th>Status Operasional</th>
          <th>IP Address</th>
          <th>MAC Address</th>
          <th>Keterangan</th>
          {!readOnly && <th>Aksi</th>}
        </tr>
      </thead>
      <tbody>
        {items.map((item: any) => (
          <tr key={item.id}>
            <td>{item.name}</td>
            <td>{item.type === 'goods' ? 'Goods' : 'IT Device'}</td>
            <td>{item.quantity}</td>
            <td>{item.location}</td>
            <td>{item.description}</td>
            <td>{item.ipAddress || '-'}</td>
            <td>{item.macAddress || '-'}</td>
            {!readOnly && (
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => onEdit(item)}
                  className="me-2"
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onDelete(item.id)}
                >
                  Delete
                </Button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default InventoryList;