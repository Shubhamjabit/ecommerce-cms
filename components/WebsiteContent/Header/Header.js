import React, { Component } from 'react';
import { Card, Col, Row } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Select } from 'antd';
import stlyes from './Header.module.scss';
import { useSelector, useDispatch } from 'react-redux';

const Header = ({ showModal }) => {

  return (
    <Row className={stlyes.mainRow}>
      <Col>
        <p className={stlyes.topLittle}>{`Banners`}</p>
      </Col>
      <Col className={stlyes.addProductButton}>
      </Col>
    </Row>
  );
};

export default Header;
