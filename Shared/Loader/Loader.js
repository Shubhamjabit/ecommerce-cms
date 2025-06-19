import React, {Component} from 'react';
import {Container, Row, Spinner} from 'react-bootstrap';
import styles from './Loader.module.scss';

const Loader = () => {
  return (
    <Container>
      <Row className="justify-content-md-center">
        <div className={styles.loader}>
          <Spinner animation="grow" />
        </div>
      </Row>
    </Container>
  );
};

export default Loader;
