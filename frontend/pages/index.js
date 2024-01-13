import Head from 'next/head';
import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import {Container, Row, Col, Form, Button, Card, Table} from 'react-bootstrap';
import {getContactRequests} from "./API/api";

const Home = () => {
    const [data, setData] = useState(null);

useEffect(() => {
    const fetchData = async () => {
        try {
            const result = await getContactRequests();
            console.log('Dane z serwera:', result);
            setData(result);
        } catch (error) {
            console.error('Błąd w komponencie:', error);
        }
    };
})
  return (
      <div>
        <div className="d-flex align-items-center mt-3 mb-3 ml-3">
           <img src="logo.svg" style={{ width: '100px', height: 'auto', margin: 16 }} />
           <div>
               <h1  style={{ color: 'pink'}}>SpeedDatingMatcher</h1>
           </div>
        </div>
    <Container style={{ backgroundColor: 'pink'}} className="text-white rounded">
        <Head>
        <title>SpeedDatingMatcher</title>
      </Head>
      <Row className="mt-5">
        <Col>
          {data !== null ? (
            <Table striped borderless hover responsive variant="light">
              <thead>
                <tr>
                  <th>#</th>
                  <th>data</th>
                  {/* Dodaj inne nagłówki według potrzeb */}
                </tr>
              </thead>
              <tbody>
                {Array.isArray(data) && data.length > 0 ? (
                  data.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.message}</td>
                      {/* Dodaj inne komórki według potrzeb */}
                    </tr>
                  ))
                ) : (
                  <tr>
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
          </div>
  );
}

export default Home;
