import Head from 'next/head';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import {Container, Row, Col, Form, Button, Card, Table} from 'react-bootstrap';

const Home = () => {

    const users = [
    { id: 1, firstName: 'John', lastName: 'Doe', username: '@john_doe' },
    { id: 2, firstName: 'Jane', lastName: 'Doe', username: '@jane_doe' },

  ];

  return (
    <Container style={{ backgroundColor: 'pink' }} className="text-white rounded">
      <Head>
        <title>SpeedDatingMatcher</title>
      </Head>

      <Row className="mt-5">
        <Col>
          <h1 className="text-center">Next.js with React-Bootstrap</h1>

          <Table striped borderless hover  responsive variant="light">
            <thead>
              <tr>
                <th>#</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Username</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>{user.username}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
