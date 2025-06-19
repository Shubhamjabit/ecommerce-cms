import React, {Component} from 'react';
import {Row, Col} from 'antd';
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
import {setBanner} from '../../../../store/actions/bannerActions';

const ActionButton = ({
  showModal1,
  showModal2,
  showModal3,
  showModal4,
  banner,
}) => {
  const dispatch = useDispatch();
  return (
    <div className={styles.dashboardProductTableAction}>
      <Button
        className={styles.dashboardProductTableActionButtonDelete}
        onClick={() => {
          dispatch(setBanner(banner));
          console.log('dispatch', banner);
          showModal4();
        }}
      >
        <EditOutlined style={{fontSize: '14px'}} />
        Edit
      </Button>
    </div>
  );
};

export default ActionButton;
