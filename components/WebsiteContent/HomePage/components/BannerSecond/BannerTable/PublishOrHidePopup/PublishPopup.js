import React, { useState } from "react";
import { Form, Input, Button, Radio, Modal, Select, Row, Col } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import Router from 'next/router'
import styles from '../components/styles.module.scss';
import {cmsendPoint, envUrl} from '../../../../../../../utils/factory'
import axios from 'axios';

import { useSelector} from 'react-redux';


const PublishPopup = ({ visible, handleOk, handleCancel }) => {

  const banner = useSelector((status) => status.bannersecondReducer.banner);
  const [submitLoading, setSubmitLoading] = useState(false);
  const active_banner =  async () =>{
    setSubmitLoading(true);
    try {

      const variables = {
             banner_id: banner.id ? banner.id : null,
             type:'1'

           };
       const data = await axios.post(
         `${envUrl.baseUrl}${cmsendPoint.publishSecondBanner}`,
         variables,
         {
           headers: {
             'Access-Control-Allow-Origin': '*',
             'Content-Type': 'application/json',
           },
         }
       );
 
       setSubmitLoading(false);
       Router.push('/manage/home-page?tab=2');
     } catch (error) {
       console.log('error signIn:', error.message);
       setSubmitLoading(false);
       Router.push('/manage/home-page?tab=2');
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
            <ExclamationCircleOutlined
              className={styles.popupBoxIcon}
            />
          </Col>
        </Row>
        <Row>
          <Col span={16} offset={4}>
            <dev className={styles.textArea}>
              <p className={styles.text1}>Active the Banner</p>
              <p className={styles.text2}>Are you sure?</p>
            </dev>
          </Col>
        </Row>
        <Row>
          <Col span={16} offset={3}>
            <Button
              className={styles.yesButton} onClick={active_banner} loading={submitLoading}>
              Yes
            </Button>
          </Col>
        </Row>
        <Row>
          <Col span={16} offset={3}>
            <Button
              className={styles.noButton} onClick={handleCancel}>
              No
            </Button>
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default PublishPopup;
