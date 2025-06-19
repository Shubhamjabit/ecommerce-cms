import React, {Component} from 'react';
import {Card, Col, Row} from 'antd';

import stlyes from './Header.module.scss';

const Header = () => {

  return (
    <Row className={stlyes.mainRow}>
      <Col>
        <p className={stlyes.topLittle}>Home Page</p>
      </Col>
    </Row>
  );
};

export default Header;
