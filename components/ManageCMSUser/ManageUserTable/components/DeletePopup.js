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
  const user = useSelector((status) => status.userReducer.user);
  const [submitLoading, setSubmitLoading] = useState(false);

  const deleteCMSUser = async () => {
    setSubmitLoading(true);
    try {
      const variables = {
        id: user.id ? user.id : null,
      };

      const data = await axios
        .post(`${envUrl.baseUrl}${cmsendPoint.deleteCMSUser}`, variables, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
        })
        .then(function (result) {
          if (result.status === 200) {
            setRs(rs + 1);
            setSubmitLoading(false);
            DeleteBannerflag();
            handleCancel();
          } else {
            console.log('CMS User not deleted');
          }
        })
        .catch(function (error) {
          console.log('@@@@@@@@@@@@@@@result-1 deleteCMSUser', error);
        });
    } catch (error) {
      console.log('error deleteCMSUser:', error.message);
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
              <p className={styles.deleteText1}>Delete the CMS User</p>
              <p className={styles.text2}>Are you sure?</p>
            </dev>
          </Col>
        </Row>
        <Row>
          <Col span={16} offset={3}>
            <Button
              className={styles.yesButton}
              onClick={deleteCMSUser}
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
