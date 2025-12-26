import { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';

const InventoryForm = ({ onSave, editingItem }) => {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem({ ...item, [name]: value });
  };

  const handleSubmit = (e) => {
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

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={item.name}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Type</Form.Label>
            <Form.Select name="type" value={item.type} onChange={handleChange}>
              <option value="goods">Goods</option>
              <option value="it_device">IT Network Device</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              name="quantity"
              value={item.quantity}
              onChange={handleChange}
              min="1"
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Location</Form.Label>
            <Form.Control
              type="text"
              name="location"
              value={item.location}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Row>
      <Form.Group className="mb-3">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          name="description"
          value={item.description}
          onChange={handleChange}
        />
      </Form.Group>
      {item.type === 'it_device' && (
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>IP Address</Form.Label>
              <Form.Control
                type="text"
                name="ipAddress"
                value={item.ipAddress}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>MAC Address</Form.Label>
              <Form.Control
                type="text"
                name="macAddress"
                value={item.macAddress}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>
      )}
      <Button type="submit" variant="primary">
        {editingItem ? 'Update' : 'Add'} Item
      </Button>
    </Form>
  );
};

export default InventoryForm;