// components/DeleteConfirmationModal.js

import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const DeleteConfirmationModal = ({ show, onHide, onConfirmDelete }) => {
  const [personIdToDelete, setPersonIdToDelete] = useState('');

  const handlePersonIdChange = (event) => {
    setPersonIdToDelete(event.target.value);
  };

  const handleConfirmDelete = () => {
    onConfirmDelete(personIdToDelete);
    setPersonIdToDelete(''); // Wyczyść input po potwierdzeniu usunięcia
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Potwierdzenie usunięcia</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="personIdToDelete">
            <Form.Label>Numer osoby do usunięcia</Form.Label>
            <Form.Control
              type="text"
              placeholder="Wprowadź numer osoby"
              value={personIdToDelete}
              onChange={handlePersonIdChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Anuluj
        </Button>
        <Button variant="danger" onClick={handleConfirmDelete}>
          Usuń
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteConfirmationModal;
