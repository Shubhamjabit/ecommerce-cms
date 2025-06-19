import React, {Component, useEffect, useState} from 'react';
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
import {setUser} from '../../../../store/actions/userActions';

const ActionButton = ({showModal1, showModal2, user, showDeleteModal}) => {
  const dispatch = useDispatch();
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    if (user && user.admin_emailid == 'admin@mail.com') {
      setIsAdmin(true);
    }
  }, []);
  //console.log('@@@@@@@@@@@@@category', category);
  return (
    <>
      {isAdmin ? null : (
        <div className={styles.dashboardProductTableAction}>
          {user.status == 0 ? (
            <>
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
              <Button
                className={styles.dashboardProductTableActionButtonDelete}
                onClick={() => {
                  dispatch(setUser(user));
                  showDeleteModal();
                }}
              >
                <DeleteOutlined style={{fontSize: '14px'}} />
                Delete
              </Button>
            </>
          ) : (
            <>
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
              <Button
                className={styles.dashboardProductTableActionButtonDelete}
                onClick={() => {
                  dispatch(setUser(user));
                  showDeleteModal();
                }}
              >
                <DeleteOutlined style={{fontSize: '14px'}} />
                Delete
              </Button>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ActionButton;
