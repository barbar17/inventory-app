import React, { Dispatch } from 'react'
import { Modal, Button } from 'react-bootstrap';

export default function ConfirmModal({ showConfirm, setShowConfirm, handleConfirm, item }: {
  showConfirm: boolean,
  setShowConfirm: Dispatch<React.SetStateAction<boolean>>,
  item: { id: string, nama: string } | null,
  handleConfirm: (id: string | undefined) => void,
}) {
  return (
    <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Hapus <strong>{item?.nama}</strong>?</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <strong>{item?.nama}</strong> akan dihapus permanen!
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowConfirm(false)}>
          Batal
        </Button>
        <Button variant="danger" onClick={() => handleConfirm(item?.id)}>
          Hapus
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
