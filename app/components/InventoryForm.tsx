import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { Barang } from '../types/Barang';

const barangDefaultValue: Barang = {
  id: "",
  nama: "",
  jenis: "Goods",
  qty: 1,
  tahun_pengadaan: "",
  kondisi: "Baru",
  lokasi: "",
  status_op: true,
  ket: "",
  ip: "",
  mac: "",
  created_by: "", 
  created_at: "",
}

const InventoryForm = ({ editingItem }: {editingItem: Barang | null}) => {
  const [item, setItem] = useState<Barang>(barangDefaultValue);

  useEffect(() => {
    if (editingItem) {
      setItem(editingItem);
    }
  }, [editingItem]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setItem({ ...item, [name]: value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!item.id) {
      item.id = Date.now().toString(); // Simple ID generation
    }
    setItem(barangDefaultValue);
  };

  const ColForm = ({ children, md = 6, label }: {
    children: React.ReactNode,
    md?: number,
    label: string,
  }) => {
    return (
      <Col md={md}>
        <Form.Group className="mb-3">
          <Form.Label className='fw-bold'>{label}</Form.Label>
          {children}
        </Form.Group>
      </Col>
    )
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <ColForm md={0} label='Nama Perangkat'>
          <Form.Control
            type="text"
            name="nama"
            value={item.nama}
            onChange={handleChange}
          />
        </ColForm>
      </Row>
      <Row>
        <ColForm label='Jenis Perangkat'>
          <Form.Select name="type" value={item.jenis} onChange={handleChange}>
            <option value="Goods">Goods</option>
            <option value="IT Device">IT Network Device</option>
          </Form.Select>
        </ColForm>
        <ColForm label='Jumlah'>
          <Form.Control
            type="number"
            name="qty"
            value={item.qty}
            onChange={handleChange}
            min={1}
          />
        </ColForm>
      </Row>
      <Row>
                <ColForm label='Tahun Pengadaan'>
          <Form.Control
            type="date"
            name="tahun_pengadaan"
            value={item.tahun_pengadaan}
            onChange={handleChange}
          />
        </ColForm>
        <ColForm label='Kondisi'>
          <Form.Select name="kondisi" value={item.kondisi} onChange={handleChange}>
            <option value="Baru">Baru</option>
            <option value="Bagus">Bagus</option>
            <option value="Kurang Baik">Kurang Baik</option>
            <option value="Rusak">Rusak</option>
          </Form.Select>
        </ColForm>
      </Row>
      <Row>
        <ColForm label='Status Operasional'>
          <Form.Select name="status_op" value={item.kondisi} onChange={handleChange}>
            <option value="1">Ya</option>
            <option value="0">Tidak</option>
          </Form.Select>
        </ColForm>
        <ColForm label='Lokasi'>
          <Form.Control
            type="text"
            name="lokasi"
            value={item.lokasi}
            onChange={handleChange}
          />
        </ColForm>
      </Row>
      <Row>
        <ColForm label='IP Address'>
          <Form.Control
            type="text"
            name="ip"
            value={item.ip}
            onChange={handleChange}
          />
        </ColForm>
        <ColForm label='Mac Address'>
          <Form.Control
            type="text"
            name="mac"
            value={item.mac}
            onChange={handleChange}
          />
        </ColForm>
      </Row>
      {item.jenis === 'IT Device' && (
        <Row>
          <ColForm label='IP Address'>
            <Form.Control
              type="text"
              name="ip"
              value={item.ip}
              onChange={handleChange}
            />
          </ColForm>
          <ColForm label='IP Address'>
            <Form.Control
              type="text"
              name="mac"
              value={item.mac}
              onChange={handleChange}
            />
          </ColForm>
        </Row>
      )}
      <Form.Group className="mb-3">
        <Form.Label className='fw-bold'>Keterangan</Form.Label>
        <Form.Control
          as="textarea"
          name="ket"
          value={item.ket}
          onChange={handleChange}
        />
      </Form.Group>
      <Button type="submit" variant="primary">
        {editingItem ? 'Update' : 'Add'} Item
      </Button>
    </Form>
  );
};

export default InventoryForm;