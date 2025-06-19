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
  preassembleData,
}) => {
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
        <Result
          status="success"
          title={preassembleData && preassembleData.message}
        />
        <Row gutter={16}>
          <Col span={8}>
            <Card bordered={false} className={styles.Card}>
              <Statistic
                title="Total Items"
                value={preassembleData && preassembleData.totalItems}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card bordered={false} className={styles.Card}>
              <Statistic
                title="Total Insert"
                value={preassembleData && preassembleData.totalInsert}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card bordered={false} className={styles.Card}>
              <Statistic
                title="Total Updated"
                value={preassembleData && preassembleData.totalUpdated}
              />
            </Card>
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default DataModal;
