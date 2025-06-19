import React, {Component} from 'react';
import {Row, Col} from 'antd';
import {Button, Tooltip} from 'antd';
import {
  EditOutlined,
  PlusOutlined,
  DeleteOutlined,
  CopyOutlined,
  CopyFilled,
} from '@ant-design/icons';
import styles from './styles.module.scss';
import {useDispatch} from 'react-redux';
import {useHistory, useLocation} from 'react-router-dom';
import {
  editProductModal,
  setProduct,
} from './../../../../store/actions/productActions';

const ActionButton = ({
  product,
  showAddModal,
  showDeleteModal,
  showEditProduct,
  showDuplicateModal,
}) => {
  const history = useHistory();
  console.log('IN PRIOJ', product, showAddModal);
  const dispatch = useDispatch();

  return (
    <div className={styles.dashboardProductTableAction}>
      {/* <Button
        icon={<EditOutlined />}
        className={styles.dashboardProductTableActionButtonEdit}
        onClick={() => {
          dispatch(setProduct(product));
          showEditProduct();
          //dispatch(editProductModal(false));
          //history.push('/manage/edit-product');
        }}
      >
        Edit
      </Button> */}
      <EditOutlined
        className={styles.dashboardProductTableActionButtonEdit}
        onClick={() => {
          dispatch(setProduct(product));
          showEditProduct();
          //dispatch(editProductModal(false));
          //history.push('/manage/edit-product');
        }}
      />
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
      {product.isDuplicate ? (
        <Tooltip
          title="Cannot duplicate a duplicate product!"
          color="red"
          // open={product.isDuplicate}
        >
          <CopyFilled
            className={styles.dashboardProductTableActionButtonEditDisable}
            // onClick={() => {
            //   dispatch(setProduct(product));
            //   showDuplicateModal();
            // }}
            disabled={product.isDuplicate}
          />
          {/* <Button
            className={styles.dashboardProductTableActionButtonEdit}
            onClick={() => {
              dispatch(setProduct(product));
              showDuplicateModal();
            }}
            disabled={product.isDuplicate}
          >
            <CopyOutlined style={{fontSize: '14px'}} />
            Duplicate
          </Button> */}
        </Tooltip>
      ) : (
        <CopyOutlined
          className={styles.dashboardProductTableActionButtonEdit}
          onClick={() => {
            dispatch(setProduct(product));
            showDuplicateModal();
          }}
          disabled={product.isDuplicate}
        />
        // <Button
        //   className={styles.dashboardProductTableActionButtonEdit}
        //   onClick={() => {
        //     dispatch(setProduct(product));
        //     showDuplicateModal();
        //   }}
        //   disabled={product.isDuplicate}
        // >
        //   <CopyOutlined style={{fontSize: '14px'}} />
        //   Duplicate
        // </Button>
      )}

      <DeleteOutlined
        className={styles.dashboardProductTableActionButtonDelete}
        style={{fontSize: '20px'}}
        onClick={() => {
          dispatch(setProduct(product));
          showDeleteModal();
        }}
      />
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
