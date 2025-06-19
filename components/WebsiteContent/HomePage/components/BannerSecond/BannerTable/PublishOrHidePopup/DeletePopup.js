import React, {useState} from 'react';
import {Form, Input, Button, Radio, Modal, Select, Row, Col} from 'antd';
import {DeleteOutlined} from '@ant-design/icons';
import Router from 'next/router';
import styles from '../components/styles.module.scss';
import {useSelector} from 'react-redux';
import {cmsendPoint, envUrl} from '../../../../../../../utils/factory'
import axios from 'axios';

const DeletePopup = ({visible, handleOk, handleCancel}) => {
  const banner = useSelector((status) => status.bannersecondReducer.banner);
  const [submitLoading, setSubmitLoading] = useState(false);
  const delete_banner = async () => {
    setSubmitLoading(true);

    try {

      const variables = {
             banner_id: banner.id ? banner.id : null,
           };
       const data = await axios.post(
         `${envUrl.baseUrl}${cmsendPoint.removeSecondBanner}`,
         variables,
         {
           headers: {
             'Access-Control-Allow-Origin': '*',
             'Content-Type': 'application/json',
           },
         }
       );
 
       handleCancel();
       setSubmitLoading(false);
       Router.push('/manage/home-page?tab=2');
     } catch (error) {
       console.log('error signIn:', error.message);
       handleCancel();
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
            <DeleteOutlined className={styles.deletePopupBoxIcon} />
          </Col>
        </Row>
        <Row>
          <Col span={16} offset={4}>
            <dev className={styles.textArea}>
              <p className={styles.deleteText1}>Delete the banner</p>
              <p className={styles.text2}>Are you sure?</p>
            </dev>
          </Col>
        </Row>
        <Row>
          <Col span={16} offset={3}>
            <Button className={styles.yesButton} onClick={delete_banner} loading={submitLoading}>
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
