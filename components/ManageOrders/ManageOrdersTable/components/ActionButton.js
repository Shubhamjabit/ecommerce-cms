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
  EyeOutlined,
} from '@ant-design/icons';
import {useDispatch} from 'react-redux';
import {setCategory} from '../../../../store/actions/categoryActions';

const ActionButton = ({ordersList, handleMoreClick}) => {
  const dispatch = useDispatch();
  //console.log('@@@@@@@@@@@@@category', category);
  return (
    <div className={styles.dashboardProductTableAction}>
      <Button
        className={styles.dashboardProductTableActionButtonPublish}
        onClick={() => handleMoreClick(ordersList.id)}
      >
        <EyeOutlined style={{fontSize: '14px'}} />
        View
      </Button>
    </div>
  );
};

export default ActionButton;
