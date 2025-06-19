import React, {useState} from 'react';
import {Form, Input, Button, Radio, Modal, Select, Row, Col} from 'antd';
import {DeleteOutlined} from '@ant-design/icons';
import Router from 'next/router';
import styles from './styles.module.scss';
import {useSelector} from 'react-redux';
import {cmsendPoint, envUrl} from '../../../../utils/factory';
import axios from 'axios';
const DeletePopup = ({
  visible,
  handleOk,
  handleCancel,
  DeleteBannerflag,
  rs,
  setRs,
}) => {
  const categorydata = useSelector((status) => status.categoryReducer.category);
  const [submitLoading, setSubmitLoading] = useState(false);

  const delete_category = async () => {
    setSubmitLoading(true);
    try {
      const variables = {
        id: categorydata.id ? categorydata.id : null,
      };

      const data = await axios
        .post(`${envUrl.baseUrl}${cmsendPoint.deleteCategory}`, variables, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
        })
        .then(function (result) {
          if (result.data.deleteCategoryStatus === 'success') {
            setRs(rs + 1);
            setSubmitLoading(false);
            DeleteBannerflag();
            handleCancel();
          } else {
            console.log('Category not deleted');
          }
        })
        .catch(function (error) {
          console.log('@@@@@@@@@@@@@@@result-1 delete_category', error);
        });
    } catch (error) {
      console.log('error delete_category:', error.message);
      setSubmitLoading(false);
    }
  };
  return (
    <>
      <Modal
        title={null}
        visible={visible}
        onOk={handleOk}
        centered={true}
        onCancel={handleCancel}
        footer={null}
        closable={false}
        width={386}
      >
        <Row>
          <Col span={1} offset={11}>
            <DeleteOutlined className={styles.deletePopupBoxIcon} />
          </Col>
        </Row>
        <Row>
          <Col span={16} offset={4}>
            <dev className={styles.textArea}>
              <p className={styles.deleteText1}>Delete the Category</p>
              <p className={styles.text2}>Are you sure?</p>
              <p className={styles.text2}>
                Please Note, deleting category will also delete all the filters,
                sub categories and products under this category.
              </p>
            </dev>
          </Col>
        </Row>
        <Row>
          <Col span={16} offset={3}>
            <Button
              className={styles.yesButton}
              onClick={delete_category}
              loading={submitLoading}
            >
              Yes
            </Button>
          </Col>
        </Row>
        <Row>
          <Col span={16} offset={3}>
            <Button className={styles.noButton} onClick={handleCancel}>
              No
            </Button>
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default DeletePopup;
