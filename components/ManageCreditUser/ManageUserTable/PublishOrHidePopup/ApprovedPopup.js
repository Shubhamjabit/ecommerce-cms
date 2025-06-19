import React, {useEffect, useState} from 'react';
import {
  Form,
  Input,
  Button,
  Radio,
  Modal,
  Select,
  Row,
  Col,
  InputNumber,
  Tooltip,
} from 'antd';
import {DeleteOutlined, CheckCircleOutlined} from '@ant-design/icons';
import Router from 'next/router';
import styles from '../components/styles.module.scss';
import {useSelector} from 'react-redux';
import {cmsendPoint, envUrl} from '../../../../utils/factory';
import axios from 'axios';

const ApprovedPopup = ({
  visible,
  handleOk,
  handleCancel,
  handleApproved,
  status,
}) => {
  const user = useSelector((status) => status.userReducer.user);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [creditLimit, setCreditLimit] = useState(null);
  const [submitDisable, setSubmitDisable] = useState(true);

  useEffect(() => {
    if (creditLimit > 0) {
      setSubmitDisable(false);
    } else {
      setSubmitDisable(true);
    }
  }, [creditLimit]);

  const active_user = async () => {
    setSubmitLoading(true);
    try {
      const variables = {
        id: user.user_id ? user.user_id : null,
        status: status,
        comment: '',
        creditLimit: creditLimit,
        updatedBy: JSON.parse(localStorage.getItem('user')).sub,
      };
      console.log('vvvvvvvv variables', variables);
      // return;
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
              handleApproved();
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

  const handleChangeCreditLimit = (value) => {
    setCreditLimit(value);
  };
  const handleOnClickNoButton = () => {
    // to remove tooltip after clicking no
    // setSubmitDisable(false);
    handleCancel();
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
            <CheckCircleOutlined className={styles.popupBoxIcon} />
          </Col>
        </Row>
        <Row>
          <Col span={16} offset={4}>
            <div className={styles.textArea}>
              <p className={styles.text1}>Approved the Credit Account</p>
              <p className={styles.text2}>Are you sure?</p>
              <InputNumber
                addonBefore="Credit Limit"
                prefix="$"
                style={{
                  width: '100%',
                }}
                value={creditLimit}
                onChange={handleChangeCreditLimit}
              />
            </div>
          </Col>
        </Row>
        <Row>
          <Tooltip
            title={
              submitDisable ? 'Please enter Credit Limit to approve' : null
            }
            color="red"
            key="red"
            placement="right"
            // trigger={focus}
            mouseLeaveDelay={0}
          >
            <Col span={16} offset={3} style={{paddingTop: '5%'}}>
              <Button
                className={styles.yesButton}
                onClick={active_user}
                loading={submitLoading}
                disabled={submitDisable}
              >
                Yes
              </Button>
            </Col>
          </Tooltip>
        </Row>
        <Row>
          <Col span={16} offset={3}>
            <Button
              className={styles.noButton}
              // onClick={() => {
              //   handleCancel();
              //   () => {
              //     setSubmitDisable(false);
              //   };
              // }}
              onClick={handleOnClickNoButton}
            >
              No
            </Button>
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default ApprovedPopup;
