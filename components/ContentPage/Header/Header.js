import React, {Component} from 'react';
import {Card, Col, Row} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import {Button, Select} from 'antd';
import stlyes from './Header.module.scss';
import Router from 'next/router';
import {useHistory} from 'react-router-dom';
import {Link} from 'react-router-dom';
import {
  setLocation,
  setLocationLink,
} from '../../../store/actions/locationUpdateAction';
import {useDispatch} from 'react-redux';
const Header = () => {
  const paths = Router.asPath;
  const history = useHistory();
  const dispatch = useDispatch();
  // const routeChange = () =>{
  //   const path = `/manage/content-page`;
  //   history.push(path);
  // }

  // const handleRoute = () => {
  //   history.push('/manage/content-page');
  // };

  return (
    <Row className={stlyes.mainRow}>
      <Col>
        <p className={stlyes.topLittle}>Manage Content Page</p>
      </Col>
      <Col className={stlyes.addProductButton}>
        <Link to="/manage/add-content-page">
          <Button
            className="dashboard-addNewProduct"
            icon={<PlusOutlined />}
            onClick={() => {
              dispatch(setLocation('Manage Add Content Page'));
              dispatch(setLocationLink('/manage/'));
            }}
          >
            {/* <a href="/manage/add-content-page"> */}
            Add Content Page
            {/* </a> */}
          </Button>
        </Link>
      </Col>
    </Row>
  );
};

export default Header;
