import {Container} from 'react-bootstrap';
import React, {Component} from 'react';

export const Layout = (props) => {
  return (
    <Container fluid>
      <container-fluid>{props.children}</container-fluid>
    </Container>
  );
};
