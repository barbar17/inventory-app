import React, { useState, useEffect, useMemo, Dispatch } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { Barang, BarangForm } from '../types/Barang';
import { useAuth } from './AuthProvider';
import { toast } from 'react-toastify';

const ColForm = ({ children, md = 6, label }: {
  children: React.ReactNode,
  md?: number,
  label: string,
}) => {
  return (
    <Col md={md}>
      <Form.Group className="mb-3" >
        <Form.Label className='fw-bold'>{label}</Form.Label>
        {children}
      </Form.Group>
    </Col>
  )
}

const InventoryForm = ({ editingItem, getBarang, setEditingItem }: {
  editingItem: Barang | null,
  getBarang: () => Promise<void>,
  setEditingItem: Dispatch<React.SetStateAction<Barang | null>>,
}) => {
  const { user, setLoading } = useAuth();
  const today = new Date().toISOString().split("T")[0];
  const barangDefaultValue = useMemo<BarangForm>(() => {
    return {
      nama: "",
      jenis: "Goods",
      qty: 1,
      tahun_pengadaan: today,
      kondisi: "Baru",
      lokasi: "",
      status_op: true,
      ket: "",
      ip: "",
      mac: "",
      created_by: user?.username || "",
    }
  }, [user])
  const [item, setItem] = useState<BarangForm>(barangDefaultValue);
  const [editingId, setEditingId] = useState<string | null>(null);
  console.log(item.status_op)

  useEffect(() => {
    if (editingItem) {
      const { id, created_at, ...formData } = editingItem
      setItem(formData);
      setEditingId(id)
    }
  }, [editingItem]);

  useEffect(() => {
    if (!editingItem) {
      setItem({ ...item, ip: '', mac: '' })
    } if (editingItem && item.jenis === "Goods") {
      setItem({ ...item, ip: '', mac: '' })
    }
  }, [item.jenis])

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    if (name === "qty") {
      setItem({ ...item, [name]: Number(value) });
    } else if (name === "status_op") {
      setItem({ ...item, [name]: value === "1" ? true : false });
    } else {
      setItem({ ...item, [name]: value });
    }
  };

  const handleSubmit = async (type: string) => {
    if (type === "add") {
      onAdd();
    } else if (type === "update") {
      onUpdate();
    }
  };

  const onAdd = async () => {
    setLoading(true)

    try {
      const res = await fetch('/api/barang', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });

      const payload = await res.json();
      if (!res.ok) {
        toast.error(String(payload.error));
        return;
      }

      setItem(barangDefaultValue);
      getBarang();
      toast.success("Berhasil menambah barang!");
    } catch (error) {
      toast.error(String(error));
    } finally {
      setLoading(false)
    }
  }

  const onUpdate = async () => {
    setLoading(true)
    if (!editingId) toast.error("ID barang tidak ditemukan");

    try {
      const res = await fetch(`/api/barang/${editingId}`, {
        method: "PATCH",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });

      const payload = await res.json();
      if (!res.ok) {
        toast.error(String(payload.error));
        return;
      }

      toast.success("Berhasil update barang!");
      setItem(barangDefaultValue);
      setEditingItem(null);
      setEditingId(null);
      getBarang();
    } catch (error) {
      toast.error(String(error));
    } finally {
      setLoading(false)
    }
  }

  const onCancelEdit = () => {
    setItem(barangDefaultValue);
    setEditingItem(null);
  }

  return (
    <Form>
      <Row>
        <ColForm md={0} label='Nama Perangkat'>
          <Form.Control
            required
            type="text"
            name="nama"
            value={item.nama}
            onChange={handleChange}
          />
        </ColForm>
      </Row>
      <Row>
        <ColForm label='Jenis Perangkat'>
          <Form.Select name="jenis" value={item.jenis} onChange={handleChange} required>
            <option value="Goods">Goods</option>
            <option value="IT Device">IT Network Device</option>
          </Form.Select>
        </ColForm>
        <ColForm label='Jumlah'>
          <Form.Control
            required
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
            required
            type="date"
            name="tahun_pengadaan"
            value={item.tahun_pengadaan}
            onChange={handleChange}
          />
        </ColForm>
        <ColForm label='Kondisi'>
          <Form.Select name="kondisi" value={item.kondisi} onChange={handleChange} required>
            <option value="Baru">Baru</option>
            <option value="Bagus">Bagus</option>
            <option value="Kurang Baik">Kurang Baik</option>
            <option value="Rusak">Rusak</option>
          </Form.Select>
        </ColForm>
      </Row>
      <Row>
        <ColForm label='Status Operasional'>
          <Form.Select name="status_op" value={item.status_op === true ? '1' : '0'} onChange={handleChange} required>
            <option value='1'>Ya</option>
            <option value='0'>Tidak</option>
          </Form.Select>
        </ColForm>
        <ColForm label='Lokasi'>
          <Form.Control
            type="text"
            name="lokasi"
            value={item.lokasi}
            onChange={handleChange}
            required
          />
        </ColForm>
      </Row>
      {item.jenis === 'IT Device' && (
        <Row>
          <ColForm label='IP Address'>
            <Form.Control
              required
              type="text"
              name="ip"
              value={item.ip}
              onChange={handleChange}
            />
          </ColForm>
          <ColForm label='Mac Address'>
            <Form.Control
              required
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
      <div className='d-flex gap-2'>
        <Button type="button" onClick={() => handleSubmit(editingItem ? "update" : "add")} variant="primary">
          {editingItem ? 'Update' : 'Tambah'}
        </Button>
        {editingItem &&
          <Button type="button" onClick={onCancelEdit} variant="danger">
            Batal
          </Button>}
      </div>
    </Form>
  );
};

export default InventoryForm;