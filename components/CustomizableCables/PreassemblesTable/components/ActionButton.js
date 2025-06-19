import React, {Component} from 'react';
import {Row, Col} from 'antd';
import {Button, Tooltip} from 'antd';
import {EditOutlined, PlusOutlined, DeleteOutlined} from '@ant-design/icons';
import styles from './styles.module.scss';
import {useDispatch} from 'react-redux';
import {useHistory, useLocation} from 'react-router-dom';
import {
  editProductModal,
  setProduct,
} from '../../../../store/actions/productActions';
import {setPreassembleCables} from '../../../../store/actions/preassemblesActions';

const ActionButton = ({
  product,
  showAddModal,
  showDeleteModal,
  showEditProduct,
}) => {
  const history = useHistory();
  // console.log('IN PRIOJ', product, showAddModal);
  const dispatch = useDispatch();

  return (
    <div className={styles.dashboardProductTableAction}>
      <Button
        icon={<EditOutlined />}
        className={styles.dashboardProductTableActionButtonEdit}
        onClick={() => {
          dispatch(setPreassembleCables(product));
          showEditProduct();
          //dispatch(editProductModal(false));
          //history.push('/manage/edit-product');
        }}
      >
        Edit
      </Button>
      {/* <Button
        className={styles.dashboardProductTableActionButtonDelete}
        onClick={() => {
          dispatch(setProduct(product));
          showDeleteModal();
        }}
      >
        <DeleteOutlined style={{fontSize: '14px'}} />
        Delete
      </Button> */}
    </div>
  );
};

export default ActionButton;
