import React, {useState, useEffect} from 'react';
import {
  Upload,
  Form,
  Result,
  message,
  Input,
  Card,
  Button,
  Radio,
  Switch,
  Modal,
  Statistic,
  Row,
  Col,
  Select,
  InputNumber,
} from 'antd';
import {v4 as uuidv4} from 'uuid';
import Router from 'next/router';
import {
  PlusOutlined,
  UploadOutlined,
  LoadingOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import styles from './styles.module.scss';
const {TextArea} = Input;
const DataModal = ({
  visible,
  handleOk,
  handleCancel,
  categories,
  Addcategoryflag,
  stockdata,
}) => {
  console.log('sssssssssss stockdata =', stockdata);
  return (
    <>
      <Modal
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        width={1000}
        style={{top: 20}}
      >
        {stockdata && stockdata.message == 'Data uploaded!' ? (
          <Result status="success" title="Data uploaded successfully!" />
        ) : (
          <Result status="error" title={stockdata && stockdata.message} />
        )}
        {/* <Result status="success" title={stockdata && stockdata.message} /> */}
        <Row gutter={16}>
          <Col span={8}>
            <Card bordered={false} className={styles.Card}>
              <Statistic
                title="Total Items"
                value={stockdata && stockdata.totalItems}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card bordered={false} className={styles.Card}>
              <Statistic
                title="Total Insert"
                value={stockdata && stockdata.totalInsert}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card bordered={false} className={styles.Card}>
              <Statistic
                title="Total Updated"
                value={stockdata && stockdata.totalUpdated}
              />
            </Card>
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default DataModal;
