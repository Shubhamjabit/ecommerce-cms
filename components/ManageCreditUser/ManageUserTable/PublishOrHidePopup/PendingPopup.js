import React, {useState} from 'react';
import {Form, Input, Button, Radio, Modal, Select, Row, Col} from 'antd';
import {DeleteOutlined, ExclamationCircleOutlined} from '@ant-design/icons';
import Router from 'next/router';
import styles from '../components/styles.module.scss';
import {useSelector} from 'react-redux';
import {cmsendPoint, envUrl} from '../../../../utils/factory';
import axios from 'axios';
const PendingPopup = ({
  visible,
  handleOk,
  handleCancel,
  handlePending,
  status,
}) => {
  const user = useSelector((status) => status.userReducer.user);
  const [submitLoading, setSubmitLoading] = useState(false);

  const inactive_user = async () => {
    setSubmitLoading(true);
    try {
      const variables = {
        id: user.user_id ? user.user_id : null,
        status: status,
        comment: '',
        updatedBy: JSON.parse(localStorage.getItem('user')).sub,
      };

      const data = await axios
        .post(
          `${envUrl.baseUrl}${cmsendPoint.UpdateStatusCreditAccount}`,
          variables,
          {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
          }
        )
        .then(function (result) {
          if (result) {
            if (result.data.updateStatus === 'success') {
              setSubmitLoading(false);
              handlePending();
              handleCancel();
            } else {
              //not deleted
            }
          } else {
            //error
          }
        })
        .catch(function (error) {
          console.log('@@@@@@@@@@@@@@@result-1', error);
        });
    } catch (error) {
      console.log('error signIn:', error.message);
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
            <ExclamationCircleOutlined className={styles.hidePopupBoxIcon} />
          </Col>
        </Row>
        <Row>
          <Col span={16} offset={4}>
            <dev className={styles.textArea}>
              <p className={styles.pending}>Pending the Credit Account</p>
              <p className={styles.text2}>Are you sure?</p>
            </dev>
          </Col>
        </Row>
        <Row>
          <Col span={16} offset={3}>
            <Button
              className={styles.yesButton}
              onClick={inactive_user}
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

export default PendingPopup;
