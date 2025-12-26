import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';

const InventoryForm = ({ onSave, editingItem }: { onSave: any, editingItem: any }) => {
  const [item, setItem] = useState({
    id: '',
    name: '',
    type: 'goods', // 'goods' or 'it_device'
    quantity: 1,
    location: '',
    description: '',
    ipAddress: '', // For IT devices
    macAddress: '', // For IT devices
  });

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
    onSave(item);
    setItem({
      id: '',
      name: '',
      type: 'goods',
      quantity: 1,
      location: '',
      description: '',
      ipAddress: '',
      macAddress: '',
    });
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
        <ColForm label='Nama Perangkat'>
          <Form.Control
            type="text"
            name="nama"
            value={item.name}
            onChange={handleChange}
          />
        </ColForm>
        <ColForm label='Jenis Perangkat'>
          <Form.Select name="type" value={item.type} onChange={handleChange}>
            <option value="goods">Goods</option>
            <option value="it_device">IT Network Device</option>
          </Form.Select>
        </ColForm>
      </Row>
      <Row>
        <ColForm label='Jumlah'>
          <Form.Control
            type="number"
            name="qty"
            value={item.quantity}
            onChange={handleChange}
            min={1}
          />
        </ColForm>
        <ColForm label='Lokasi'>
          <Form.Control
            type="text"
            name="lokasi"
            value={item.location}
            onChange={handleChange}
          />
        </ColForm>
      </Row>
      {item.type === 'it_device' && (
        <Row>
          <ColForm label='IP Address'>
            <Form.Control
              type="text"
              name="ipAddress"
              value={item.ipAddress}
              onChange={handleChange}
            />
          </ColForm>
          <ColForm label='IP Address'>
            <Form.Control
              type="text"
              name="macAddress"
              value={item.macAddress}
              onChange={handleChange}
            />
          </ColForm>
        </Row>
      )}
      <Form.Group className="mb-3">
        <Form.Label className='fw-bold'>Keterangan</Form.Label>
        <Form.Control
          as="textarea"
          name="description"
          value={item.description}
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