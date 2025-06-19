import React, {Component} from 'react';
import {Card, Col, Row} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import {Button, Select} from 'antd';
import stlyes from './Header.module.scss';

const Header = ({showModal}) => {
  return (
    <Row className={stlyes.mainRow}>
      <Col>
        <p className={stlyes.topLittle}>Manage Industries</p>
      </Col>
      <Col className={stlyes.addProductButton}>
        <Button
          className="dashboard-addNewProduct"
          onClick={() => {
            showModal();
          }}
          icon={<PlusOutlined />}
        >
          Add Industry
        </Button>
      </Col>
    </Row>
  );
};

export default Header;
