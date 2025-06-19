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
import {setContent} from '../../../../store/actions/contentActions';
import Router from 'next/router';
import {useHistory, useLocation} from 'react-router-dom';
const ActionButton = ({
  showModal1,
  showModal2,
  showModal3,
  showModal4,
  content,
}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  return (
    <div className={styles.dashboardProductTableAction}>
      <Button
        className={styles.dashboardProductTableActionButtonDelete}
        onClick={() => {
          dispatch(setContent(content));
          console.log('dispatch::::::::::::::::', content);
          history.push('/manage/edit-content-page');
        }}
      >
        <EditOutlined style={{fontSize: '14px'}} />
        Edit
      </Button>
      <Button
        className={styles.dashboardProductTableActionButtonDelete}
        onClick={() => {
          dispatch(setContent(content));
          console.log('dispatch', content);
          showModal3();
        }}
      >
        <DeleteOutlined style={{fontSize: '14px'}} />
        Delete
      </Button>
      {/*  {banner.status == 'Unpublish' ? (<Button
        className={styles.dashboardProductTableActionButtonPublish}
        onClick={() => {
            dispatch(setBanner(banner));
            console.log("dispatch",banner);
            showModal1();
        }}>
        <SendOutlined style={{ fontSize: "16px" }} />
            Publish
      </Button>) :
      <Button
        className={styles.dashboardProductTableActionButtonHide}
        onClick={() => {
          dispatch(setBanner(banner));
            console.log("dispatch",banner);
            showModal2();
            
        }}>
        <EyeInvisibleFilled style={{ fontSize: "14px" }} />
            Hide
        </Button>} */}
    </div>
  );
};

export default ActionButton;
