import React, {useState} from 'react';
import {Form, Input, Button, Radio, Modal, Select, Row, Col} from 'antd';
import {DeleteOutlined, CloseCircleOutlined} from '@ant-design/icons';
import Router from 'next/router';
import styles from '../components/styles.module.scss';
import {useSelector} from 'react-redux';
import {cmsendPoint, envUrl} from '../../../../utils/factory';
import axios from 'axios';
const {TextArea} = Input;
const RejectedPopup = ({
  visible,
  handleOk,
  handleCancel,
  handleRejected,
  status,
}) => {
  const [form] = Form.useForm();
  const user = useSelector((status) => status.userReducer.user);
  const [submitLoading, setSubmitLoading] = useState(false);
  const onReset = () => {
    form.resetFields();
  };
  const onFinish = async (values) => {
    setSubmitLoading(true);
    try {
      const variables = {
        id: user.user_id ? user.user_id : null,
        status: status,
        comment: values.comment,
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
              handleRejected();
              handleCancel();
              onReset();
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
            <CloseCircleOutlined className={styles.deletePopupBoxIcon} />
          </Col>
        </Row>
        <Row>
          <Col span={16} offset={4}>
            <dev className={styles.textArea}>
              <p className={styles.rejected}>Rejected the Credit Account</p>
              <p className={styles.text2}>Are you sure?</p>
            </dev>
          </Col>
        </Row>

        <Form
          form={form}
          onFinish={(values) => onFinish(values)}
          labelCol={{span: 6}}
          wrapperCol={{span: 24}}
          autoComplete="off"
        >
          <Form.Item
            name="comment"
            rules={[{required: true, message: 'Please enter comment name'}]}
          >
            <TextArea
              showCount
              maxLength={5000}
              rows={4}
              placeholder="Enter comment"
            />
          </Form.Item>

          <Row>
            <Col span={16} offset={3}>
              <Form.Item style={{textAlign: 'right', marginBottom: 0}}>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{marginTop: '10px'}}
                  loading={submitLoading}
                  className={styles.yesButton}
                >
                  Yes
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>

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

export default RejectedPopup;
