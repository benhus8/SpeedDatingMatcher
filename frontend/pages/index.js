import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Table, Modal, Button } from 'react-bootstrap';
import { getData, deleteRecord } from "./API/api";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faEnvelope, faGear, faTrash } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from './/components/confirmationModal';
import DeleteConfirmationModal from ".//components/confirmationModal";

const Home = () => {
  const [data, setData] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getData();
        console.log('Dane z serwera:', result);
        setData(result);
      } catch (error) {
        console.error('Błąd w komponencie:', error);
      }
    };

    fetchData();
  }, []);

  const handleDeleteClick = (personRequestingContactId, preferredPersonId) => {
    setRecordToDelete({ personRequestingContactId, preferredPersonId });
    setShowConfirmation(true);
  };

  const handleConfirmDelete = async (personIdToDelete) => {
    try {
      const { personRequestingContactId, preferredPersonId } = recordToDelete;

      // Sprawdź, czy numer osoby wprowadzony do usunięcia pasuje do rekordu
      if (personIdToDelete === preferredPersonId) {
        // Wywołaj funkcję API do usunięcia rekordu na serwerze
        await deleteRecord(personRequestingContactId, preferredPersonId);

        // Zaktualizuj dane w stanie komponentu po usunięciu
        setData(await getData());
      } else {
        console.error('Numer osoby do usunięcia nie pasuje do rekordu.');
      }

      // Zamknij okno potwierdzenia
      setShowConfirmation(false);
    } catch (error) {
      console.error('Błąd podczas usuwania rekordu:', error);
    }
  };

  const handleCloseConfirmation = () => {
    // Zamknij okno potwierdzenia bez usuwania
    setShowConfirmation(false);
  };


  return (
    <div>
      <div className="d-flex align-items-center mt-3 mb-3 ml-3">
        <img src="logo.svg" style={{ width: '100px', height: 'auto', margin: 16 }} />
        <div>
          <h1 style={{ color: 'pink' }}>SpeedDatingMatcher</h1>
        </div>
      </div>
      <Container style={{ backgroundColor: 'pink' }} className="text-white rounded">
        <Head>
          <title>SpeedDatingMatcher</title>
        </Head>
        <Row className="mt-5">
          <Col>
            {data !== null ? (
              <Table striped bordered hover responsive variant="light" className="table table-pink">
                <thead>
                  <tr>
                    <th>Numer</th>
                    <th>Imię</th>
                    <th>Email</th>
                    <th>Dopasowania</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(data) && data.length > 0 ? (
                    data.map((item, index) => (
                      <tr key={index} className="pink-background">
                        <td>{item.number}</td>
                        <td>{item.first_name}</td>
                        <td>{item.email}</td>
                        <td>{item.preferred_persons ? item.preferred_persons.join(', ') : 'Brak danych'}</td>
                        <td>
                          <FontAwesomeIcon icon={faCheck} style={{ marginLeft: '5px', color: 'green' }} />
                          <FontAwesomeIcon icon={faEnvelope} style={{ marginLeft: '10px', color: 'darkgrey' }} />
                        </td>
                        <td>
                          <FontAwesomeIcon
                            icon={faGear}
                            style={{ marginLeft: '10px', color: 'grey' }}
                          />
                          <FontAwesomeIcon
                            icon={faTrash}
                            style={{ marginLeft: '10px', color: 'red', cursor: 'pointer' }}
                            onClick={() => handleDeleteClick(data.number, data.preferredPersonId)}
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr style={{ backgroundColor: 'pink' }}>
                      <td colSpan="4">Brak danych do wyświetlenia</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            ) : (
              <p>Ładowanie...</p>
            )}
          </Col>
        </Row>
      </Container>

      <ConfirmationModal
        show={showConfirmation}
        onHide={handleCloseConfirmation}
        onConfirm={handleConfirmDelete}
      />
      <DeleteConfirmationModal
  show={showConfirmation}
  onHide={handleCloseConfirmation}
  onConfirmDelete={handleConfirmDelete}
/>

    </div>
  );
};

export default Home;
