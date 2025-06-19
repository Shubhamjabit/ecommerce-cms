import React, { useState } from "react";
import { Form, Input, Button, Radio, Modal, Select, Row, Col } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import Router from 'next/router'
import styles from '../components/styles.module.scss';
import { useSelector} from 'react-redux';
import {cmsendPoint, envUrl} from '../../../../../../../utils/factory'
import axios from 'axios';


const HidePopup = ({ visible, handleOk, handleCancel }) => {

  const banner = useSelector((status) => status.bannersecondReducer.banner);
  const [submitLoading, setSubmitLoading] = useState(false);
  const hide_banner =  async () =>{
    setSubmitLoading(true);
   
    try {

      const variables = {
             banner_id: banner.id ? banner.id : null,
             type:'2'
           };
       const data = await axios.post(
         `${envUrl.baseUrl}${cmsendPoint.publishThirdBanner}`,
         variables,
         {
           headers: {
             'Access-Control-Allow-Origin': '*',
             'Content-Type': 'application/json',
           },
         }
       );
 
       setSubmitLoading(false);
       Router.push('/manage/home-page?tab=3');
     } catch (error) {
       console.log('error signIn:', error.message);
       setSubmitLoading(false);
       Router.push('/manage/home-page?tab=3');
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
              className={styles.hidePopupBoxIcon}
            />
          </Col>
        </Row>
        <Row>
          <Col span={16} offset={4}>
            <dev className={styles.textArea}>
              <p className={styles.hideText1}>Inactive the banner</p>
              <p className={styles.text2}>Are you sure?</p>
            </dev>
          </Col>
        </Row>
        <Row>
          <Col span={16} offset={3}>
            <Button
              className={styles.yesButton} onClick={hide_banner} loading={submitLoading}>
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

export default HidePopup;
