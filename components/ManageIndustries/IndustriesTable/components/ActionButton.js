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
import {setManageSubcatTitlteData} from '../../../../store/actions/manageFilterActions';

const ActionButton = ({showEditModal, category, showDeleteModal}) => {
  const dispatch = useDispatch();
  //console.log('@@@@@@@@@@@@@category', category);
  return (
    <div className={styles.dashboardProductTableAction}>
      <Button
        className={styles.dashboardProductTableActionButtonDelete}
        onClick={() => {
          dispatch(setCategory(category));
          dispatch(setManageSubcatTitlteData(category));
          console.log('dispatch', category);
          showEditModal();
        }}
      >
        <EditOutlined style={{fontSize: '14px'}} />
        Edit
      </Button>
      <Button
        className={styles.dashboardProductTableActionButtonDelete}
        onClick={() => {
          dispatch(setCategory(category));

          showDeleteModal();
        }}
      >
        <DeleteOutlined style={{fontSize: '14px'}} />
        Delete
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
    </div>
  );
};

export default ActionButton;
