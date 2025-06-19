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
import {setCategory} from '../../../../store/actions/categoryActions';

const ActionButton = ({
  showModal1,
  showModal2,
  showModal3,
  showModal4,
  category,
}) => {
  const dispatch = useDispatch();
  return (
    <Row className={styles.dashboardProductTableAction}>
      <Button
        className={styles.dashboardProductTableActionButtonDelete}
        onClick={() => {
          dispatch(setCategory(category));
          console.log('dispatch', category);
          showModal4();
        }}
      >
        <EditOutlined style={{fontSize: '14px'}} />
        Edit
      </Button>
      {/* <Button
        className={styles.dashboardProductTableActionButtonDelete}
        onClick={() => {
          dispatch(setBanner(banner));
            console.log("dispatch",banner);
            showModal3();
            
        }}>
        <DeleteOutlined style={{ fontSize: "14px" }} />
            Delete
        </Button>
      {banner.status == 'Unpublish' ? (<Button
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
    </Row>
  );
};

export default ActionButton;
