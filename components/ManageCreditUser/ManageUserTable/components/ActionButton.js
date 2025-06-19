import React, {Component} from 'react';
import {Row, Col, Select} from 'antd';
import {Button, Tooltip} from 'antd';
import styles from './styles.module.scss';
import {
  EyeFilled,
  EyeInvisibleFilled,
  SendOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';
import {useDispatch} from 'react-redux';
import {setUser} from '../../../../store/actions/userActions';

const ActionButton = ({
  showModal1,
  showModal2,
  showModal3,
  showModal4,
  credituser,
}) => {
  const dispatch = useDispatch();
  const handleChangeStatus = (value) => {
    console.log(`selected ${value}`);
    if (value == '0') {
      showModal3(0);
      dispatch(setUser(credituser));
    } else if (value == '1') {
      showModal1(1);
      dispatch(setUser(credituser));
    } else if (value == '2') {
      showModal2(2);
      dispatch(setUser(credituser));
    } else if (value == '3') {
      showModal4(3);
      dispatch(setUser(credituser));
    }
  };

  return (
    <div className={styles.dashboardProductTableAction}>
      <Select
        placeholder="Change Status"
        onChange={handleChangeStatus}
        allowClear
        name="status"
      >
        {credituser.status != '0' && <Option value="0">Pending</Option>}
        {credituser.status != '1' && <Option value="1">Processing</Option>}
        {credituser.status != '2' && <Option value="2">Approved</Option>}
        {credituser.status != '3' && <Option value="3">Rejected</Option>}
      </Select>
    </div>
  );
};

export default ActionButton;
