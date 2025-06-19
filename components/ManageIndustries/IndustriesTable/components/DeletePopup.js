import React, {useState} from 'react';
import {Form, Input, Button, Radio, Modal, Select, Row, Col} from 'antd';
import {DeleteOutlined} from '@ant-design/icons';
import Router from 'next/router';
import styles from '../components/styles.module.scss';
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
  console.log('categorydata in delete industry', categorydata);
  const [submitLoading, setSubmitLoading] = useState(false);

  const delete_category = async () => {
    setSubmitLoading(true);
    try {
      await axios
        .delete(
          `${envUrl.baseUrl}${cmsendPoint.deleteIndustry}`,
          {
            data: {id: categorydata.id ? categorydata.id : null},
          },
          {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
          }
        )
        .then(function (result) {
          if (result.status == 200) {
            setRs(rs + 1);
            setSubmitLoading(false);
            DeleteBannerflag();
            handleCancel();
          } else {
            console.log('Industry not deleted');
          }
        })
        .catch(function (error) {
          console.log('@@@@@@@@@@@@@@@result-1 delete_industry', error);
        });
    } catch (error) {
      console.log('error delete_industry:', error.message);
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
              <p className={styles.deleteText1}>Delete the Industry</p>
              <p className={styles.text2}>Are you sure?</p>
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
