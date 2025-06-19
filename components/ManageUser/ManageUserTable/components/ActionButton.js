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
  DollarOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import {useDispatch} from 'react-redux';
import {setUser} from '../../../../store/actions/userActions';

const ActionButton = ({
  showModal1,
  showModal2,
  user,
  showCreateVoucher,
  showVLModal,
  showDLModal,
  showCreateDiscount,
}) => {
  const dispatch = useDispatch();
  //console.log('@@@@@@@@@@@@@category', category);
  return (
    <div className={styles.dashboardProductTableAction}>
      {user.status == 0 ? (
        <Button
          className={styles.dashboardProductTableActionButtonPublish}
          onClick={() => {
            dispatch(setUser(user));
            console.log('dispatch', user);
            showModal1();
          }}
        >
          <SendOutlined style={{fontSize: '16px'}} />
          Active
        </Button>
      ) : (
        <Button
          className={styles.dashboardProductTableActionButtonHide}
          onClick={() => {
            dispatch(setUser(user));
            console.log('dispatch', user);
            showModal2();
          }}
        >
          <EyeInvisibleFilled style={{fontSize: '14px'}} />
          Inactive
        </Button>
      )}
      <div>
        <Button
          className={styles.dashboardProductTableActionButtonHide}
          onClick={() => {
            dispatch(setUser(user));
            console.log('dispatch', user);
            showCreateVoucher();
          }}
        >
          <DollarOutlined style={{fontSize: '14px'}} />
          Create Voucher
        </Button>
        <Tooltip title="Show Vouchers List">
          <Button
            className={styles.dashboardProductTableActionButtonHide}
            onClick={() => {
              dispatch(setUser(user));
              console.log('dispatch', user);
              showVLModal();
            }}
          >
            <UnorderedListOutlined style={{fontSize: '14px'}} />
          </Button>
        </Tooltip>
      </div>

      <div>
        <Button
          className={styles.dashboardProductTableActionButtonHide}
          onClick={() => {
            dispatch(setUser(user));
            showCreateDiscount();
          }}
        >
          Create Product Discount
        </Button>

        <Tooltip title="Show Product Discount List">
          <Button
            className={styles.dashboardProductTableActionButtonHide}
            onClick={() => {
              dispatch(setUser(user));
              // console.log('dispatch', user);
              showDLModal();
            }}
          >
            <UnorderedListOutlined style={{fontSize: '14px'}} />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};

export default ActionButton;
