import React, {useState, useEffect} from 'react';
import axios from 'axios';
import styles from './styles.module.scss';
import {useSelector, useDispatch} from 'react-redux';
// import {cmsendPoint, envUrl, CategoryimageUrl} from '../../../../utils/factory';
import moment from 'moment-timezone';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);
import {
  Upload,
  Form,
  message,
  Input,
  Button,
  Radio,
  Modal,
  Row,
  Col,
  Image,
  Select,
  DatePicker,
  InputNumber,
  Space,
} from 'antd';
import {cmsendPoint, envUrl, CategoryimageUrl} from '../../../../utils/factory';

const {RangePicker} = DatePicker;

const CreateDiscountModel = ({visible, handleOk, handleCancel}) => {
  const user = useSelector((state) => state.userReducer.user);
  const [form] = Form.useForm();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [currentFromDateTime, setCurrentFromDateTime] = useState('');
  console.log('currentFromDateTime', currentFromDateTime);
  const [currentToDateTime, setCurrentToDateTime] = useState('');
  console.log('currentToDateTime', typeof currentToDateTime);
  const values = Form.useWatch([], form);

  useEffect(() => {
    setCurrentFromDateTime(
      dayjs().tz('Australia/Sydney').format('MM-DD-YYYY HH:mm:ss')
      // moment().tz('Australia/Sydney').format('DD-MM-YYYY HH:mm:ss')
    );
    console.log('currentime', dayjs(currentFromDateTime));
    setCurrentToDateTime(
      dayjs().tz('Australia/Sydney').add(1, 'M').format('MM-DD-YYYY HH:mm:ss')
      // moment().tz('Australia/Sydney').add(1, 'M').format('DD-MM-YYYY HH:mm:ss')
    );
  }, []);

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        email: user?.email,
        discountName: '',
        discountPercentage: 1,
        scheduledDateTime: [
          dayjs(currentFromDateTime),
          dayjs(currentToDateTime),
        ],
      });
    }
  }, [visible]);

  function handleSubmit(fieldsValue) {
    setSubmitLoading(true);
    const rangeTimeValue = fieldsValue['scheduledDateTime'];
    const values = {
      ...fieldsValue,
      scheduledDateTime: [
        rangeTimeValue[0].format('YYYY-MM-DD HH:mm:ss'),
        rangeTimeValue[1].format('YYYY-MM-DD HH:mm:ss'),
      ],
    };
    values.crudMethod = 'create';
    console.log('!Received values of form: ', values);
    // setSubmitLoading(false);
    // return;
    axios
      .post(`${envUrl.baseUrl}${cmsendPoint.crudProductDiscount}`, values, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        console.log('successs in creating discount', response);
      })
      .catch((error) => {
        console.log('api error while creating discount', error);
      })
      .finally(() => {
        setSubmitLoading(false);
        handleCancel();
        form.resetFields();
      });
  }

  function resetForm() {
    form.resetFields();
    form.setFieldsValue({
      email: user?.email,
      discountName: '',
      discountPercentage: 1,
      scheduledDateTime: [dayjs(currentFromDateTime), dayjs(currentToDateTime)],
    });
  }
  return (
    <Modal
      title="Create Product Discount"
      visible={visible}
      width={1000}
      style={{top: 20}}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
    >
      <Form
        form={form}
        layout="horizontal"
        name="validateOnly"
        autoComplete="off"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="email"
          label="Email id"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input disabled />
        </Form.Item>

        <Form.Item
          name="discountName"
          label="Product Discount Name"
          rules={[
            {
              required: true,
              message: 'Name is required',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="discountPercentage"
          label="Voucher Discount Percentage"
          rules={[
            {
              required: true,
              message: 'Discount percentage is required',
            },
          ]}
        >
          <InputNumber addonAfter="%" min={1} />
        </Form.Item>

        <Form.Item
          name="scheduledDateTime"
          label="Discount Scheduled Date"
          rules={[
            {
              type: 'array',
              required: true,
              message: 'Please select date and time!',
            },
          ]}
        >
          <RangePicker showTime format="DD-MM-YYYY HH:mm:ss" />
        </Form.Item>

        <Space>
          <Button
            type="primary"
            htmlType="submit"
            disabled={
              !form.isFieldsTouched(true) ||
              submitLoading ||
              form.getFieldsError().filter(({errors}) => errors.length).length >
                0
            }
          >
            Submit
          </Button>
          <Button onClick={resetForm}>Reset</Button>
        </Space>
      </Form>
    </Modal>
  );
};

export default CreateDiscountModel;
