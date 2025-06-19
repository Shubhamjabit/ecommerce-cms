import React, {Component} from 'react';
import {Card, Col, Row} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import {Button, Select} from 'antd';
import stlyes from './Header.module.scss';
import Router from 'next/router';
import {useHistory} from 'react-router-dom';
import Link from 'next/link';
const Header = () => {
  return (
    <Row className={stlyes.mainRow}>
      <Col>
        <p className={stlyes.topLittle}>Edit Content</p>
      </Col>
    </Row>
  );
};

export default Header;
