import React, { Component } from "react";
import { Row, Col } from 'antd';
import { Button, Tooltip } from "antd";
import styles from './styles.module.scss';

const ActionButton = () => {
  return (
    <Row className={styles.dashboardProductTableAction} >
      <Button className={styles.dashboardProductTableActionButtonEdit}>Edit</Button>
      <Button className={styles.dashboardProductTableActionButtonRemove}>Remove</Button>
    </Row>
  );
};

export default ActionButton;
