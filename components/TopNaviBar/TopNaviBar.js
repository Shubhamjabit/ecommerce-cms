import React, {useState} from 'react';
import stlyes from './TopNaviBar.module.scss';
import {Breadcrumb, Card, Col, Row} from 'antd';
import {LogoutOutlined, MenuOutlined} from '@ant-design/icons';
import {useDispatch, useSelector} from 'react-redux';
import {Link, Route} from 'react-router-dom';
import {signOut} from '../../service/auth/authService';

const TopNaviBar = ({TriggerSider, user}) => {
  const dispatch = useDispatch();

  const breadcrumbItems = useSelector(
    (status) => status.locationUpdateReducer.rootMenuItem
  );
  const link = useSelector((state) => state.locationUpdateReducer.link);

  const indexOfDivider = breadcrumbItems ? breadcrumbItems.indexOf('  ') : null;
  const firstPart = breadcrumbItems
    ? breadcrumbItems.substr(0, indexOfDivider)
    : null;
  const secondPart = breadcrumbItems
    ? breadcrumbItems.substr(indexOfDivider + 1)
    : null;
  return (
    <>
      <Row className={stlyes.mainRow}>
        <Col span={12}>
          <MenuOutlined
            className={stlyes.colStart}
            onClick={() => {
              TriggerSider();
            }}
          />
        </Col>
        <Col span={12}>
          <Row style={{paddingLeft: '96%'}}>
            <LogoutOutlined
              className={stlyes.logoutButton}
              onClick={() => {
                signOut();
                location.href = '/';
              }}
            />
          </Row>
          <Row style={{paddingLeft: '83%'}}>{user}</Row>
        </Col>
      </Row>
      <Row className={stlyes.mainRow}>
        <Col className={stlyes.colStart}>
          <Row>
            <Breadcrumb separator=">">
              {breadcrumbItems !== null ? (
                <Breadcrumb.Item>{firstPart}</Breadcrumb.Item>
              ) : null}
              {breadcrumbItems !== null || secondPart !== null ? (
                <Breadcrumb.Item className={stlyes.selectedBC}>
                  {secondPart}
                </Breadcrumb.Item>
              ) : null}
            </Breadcrumb>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default TopNaviBar;
