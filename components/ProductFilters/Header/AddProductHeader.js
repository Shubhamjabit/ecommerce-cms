import React, {Component} from 'react';
import {Card, Col, Row} from 'antd';
import {PlusOutlined, LeftOutlined} from '@ant-design/icons';
import {Button, Select} from 'antd';
import stlyes from './Header.module.scss';
import Router from 'next/router';
import {useHistory} from 'react-router-dom';
import Link from 'next/link';
const Header = ({handleAddProduct}) => {
  return (
    <Row className={stlyes.mainRow}>
      <Col>
        <p className={stlyes.topLittle}>Add Product Filters</p>
      </Col>
      <Col className={stlyes.addProductButton}>
        <Button
          className="dashboard-addNewProduct"
          style={{display: 'flex', alignItems: 'center'}}
          onClick={() => {
            handleAddProduct();
          }}
          icon={<LeftOutlined />}
        >
          Back
        </Button>
      </Col>
    </Row>
  );
};

export default Header;
