import React, {useState, useEffect} from 'react';
import {BlobServiceClient, ContainerClient} from '@azure/storage-blob';
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
const {RangePicker} = DatePicker;
import {v4 as uuidv4} from 'uuid';
import Router from 'next/router';
import {
  QuestionCircleOutlined,
  CloseSquareOutlined,
  UploadOutlined,
  FilePdfOutlined,
  ExclamationCircleOutlined,
  DeleteOutlined,
  VideoCameraOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import styles from './styles.module.scss';
import {useSelector, useDispatch} from 'react-redux';
import {cmsendPoint, envUrl, CategoryimageUrl} from '../../../../utils/factory';
const {TextArea} = Input;
import moment from 'moment-timezone';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);

const SubmitButton = ({form, submitLoading}) => {
  const [submittable, setSubmittable] = React.useState(false);

  // Watch all values
  const values = Form.useWatch([], form);
  React.useEffect(() => {
    form
      .validateFields({
        validateOnly: true,
      })
      .then(
        () => {
          setSubmittable(true);
        },
        () => {
          setSubmittable(false);
        }
      );
  }, [values]);
  return (
    <Button
      type="primary"
      htmlType="submit"
      disabled={!submittable}
      loading={submitLoading}
    >
      Submit
    </Button>
  );
};
const CreateVoucherModal = ({visible, handleOk, handleCancel}) => {
  const [form] = Form.useForm();
  const isMultipleValue = Form.useWatch('isMultiple', form);
  const amountTypeValue = Form.useWatch('amountType', form);
  const maxNumberUsageValue = Form.useWatch('maxNumberUsageValue', form);
  const flatAmountValue = Form.useWatch('flatAmount', form);
  const discountPercentageValue = Form.useWatch('discountPercentage', form);
  const maxAmountIfPercentageValue = Form.useWatch(
    'maxAmountIfPercentage',
    form
  );
  const user = useSelector((state) => state.userReducer.user);
  console.log('!!!!!!!!!!!! 111111111 user', user);

  const [submitLoading, setSubmitLoading] = useState(false);

  const [currentFromDateTime, setCurrentFromDateTime] = useState('');
  console.log('currentFromDateTime', currentFromDateTime);
  const [currentToDateTime, setCurrentToDateTime] = useState('');
  console.log('currentToDateTime', typeof currentToDateTime);

  useEffect(() => {
    setCurrentFromDateTime(
      dayjs().tz('Australia/Sydney').format('MM-DD-YYYY HH:mm:ss')
      // moment().tz('Australia/Sydney').format('DD-MM-YYYY HH:mm:ss')
    );

    setCurrentToDateTime(
      dayjs().tz('Australia/Sydney').add(1, 'M').format('MM-DD-YYYY HH:mm:ss')
      // moment().tz('Australia/Sydney').add(1, 'M').format('DD-MM-YYYY HH:mm:ss')
    );
  }, []);

  // fill form with default values whenever modal is visible
  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        email: user?.email,
        isMultiple: 0,
        amountType: 0,
        scheduledDateTime: [
          dayjs(currentFromDateTime),
          dayjs(currentToDateTime),
        ],
      });
    }
  }, [visible]);

  const resetForm = () => {
    form.resetFields();
    form.setFieldsValue({
      email: user?.email,
      isMultiple: 0,
      amountType: 0,
      scheduledDateTime: [dayjs(currentFromDateTime), dayjs(currentToDateTime)],
      // scheduledDateTime: [
      //   moment(currentFromDateTime),
      //   moment(currentToDateTime),
      // ],
      // scheduledDateTime: [dayjs(), dayjs()],
    });
  };

  const onFinish = (fieldsValue) => {
    // try {
    setSubmitLoading(true);
    const rangeTimeValue = fieldsValue['scheduledDateTime'];
    const values = {
      ...fieldsValue,
      // 'date-picker': fieldsValue['date-picker'].format('YYYY-MM-DD'),
      // 'date-time-picker': fieldsValue['date-time-picker'].format(
      // 'YYYY-MM-DD HH:mm:ss'
      // ),
      // 'month-picker': fieldsValue['month-picker'].format('YYYY-MM'),
      // 'range-picker': [
      // rangeValue[0].format('YYYY-MM-DD'),
      // rangeValue[1].format('YYYY-MM-DD'),
      // ],
      scheduledDateTime: [
        rangeTimeValue[0].format('YYYY-MM-DD HH:mm:ss'),
        rangeTimeValue[1].format('YYYY-MM-DD HH:mm:ss'),
      ],
      // 'time-picker': fieldsValue['time-picker'].format('HH:mm:ss'),
    };
    values.crudMethod = 'create';
    console.log('!Received values of form: ', values);
    // setSubmitLoading(false);
    // return;
    axios
      .post(`${envUrl.baseUrl}${cmsendPoint.crudVoucher}`, values, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      })
      .then(function (response) {
        console.log('!!! response', response);
        // if (response.data.data.message === 'Data upload!') {
        //   setUploadResponse(response.data.data);
        //   setFileName(null);
        //   setUploadData(false);
        //   showModal(response.data.data);
        // } else {
        //   setUploadData(false);
        //   setFileName(null);
        //   showModal(response.data.data);
        //   //console.log("error FROM RESPONSE AddFilterModal::::: ");
        // }
      })
      .catch((error) => {
        console.log('API error in crudVoucher :::::', error);
        // setLoader(false);
      })
      .finally(() => {
        setSubmitLoading(false);
        handleCancel();
        form.resetFields();
      });
    // } catch (error) {
    //   console.log('try error crudVoucher', error);
    // } finally {
    //   setSubmitLoading(false);
    // }
  };

  const handleAmountTypeChange = () => {
    console.log('!!!!!!!!! flatAmountValue', flatAmountValue);
    // doing this because switching radios does not validate form
    form.setFieldsValue({
      flatAmount: flatAmountValue,
      discountPercentage: discountPercentageValue,
      maxAmountIfPercentage: maxAmountIfPercentageValue,
    });
  };

  const handleisMultipleOnChange = () => {
    form.setFieldsValue({
      maxNumberUsage: maxNumberUsageValue,
    });
  };

  const handleCancelWithResetForm = () => {
    console.log('cccccc');
    resetForm();
    handleCancel();
  };

  return (
    <>
      <Modal
        title="Create Voucher"
        visible={visible}
        onOk={handleOk}
        // onCancel={() => {
        //   handleCancel(), destroyFormValues();
        // }}
        onCancel={handleCancelWithResetForm}
        footer={null}
        width={1000}
        style={{top: 20}}
      >
        <Form
          form={form}
          name="validateOnly"
          layout="horizontal"
          autoComplete="off"
          onFinish={onFinish}
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
            name="voucherName"
            label="Voucher Name"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="minCartAmount"
            label="Minimum Cart Amount to Apply Voucher"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <InputNumber min={1} addonBefore="$" type="number" />
          </Form.Item>
          <Form.Item
            name="isMultiple"
            label="Number of times Voucher can be used"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Radio.Group onChange={handleisMultipleOnChange}>
              <Radio.Button value={0}>Single</Radio.Button>
              <Radio.Button value={1}>Multiple</Radio.Button>
              {/* <Radio.Button value="c">item 3</Radio.Button> */}
            </Radio.Group>
          </Form.Item>
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.isMultiple !== currentValues.isMultiple
            }
          >
            {({getFieldValue}) =>
              getFieldValue('isMultiple') === 1 ? (
                <Form.Item
                  name="maxNumberUsage"
                  label="Maximum Number Of Times Voucher Can Be Used"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <InputNumber min={2} type="number" />
                </Form.Item>
              ) : null
            }
          </Form.Item>
          {/* {isMultipleValue == 1 ? (
            <Form.Item
              name="maxNumberUsage"
              label="Maximum number of times Voucher can be used"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <InputNumber min={2} />
            </Form.Item>
          ) : null} */}

          <Form.Item
            name="amountType"
            label="Voucher Amount Type"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Radio.Group onChange={handleAmountTypeChange}>
              <Radio.Button value={0}>Flat Amount</Radio.Button>
              <Radio.Button value={1}>Discount Percentage</Radio.Button>
              {/* <Radio.Button value="c">item 3</Radio.Button> */}
            </Radio.Group>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.amountType !== currentValues.amountType
            }
          >
            {({getFieldValue}) =>
              getFieldValue('amountType') === 0 ? (
                <Form.Item
                  name="flatAmount"
                  label="Voucher Flat Amount"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <InputNumber min={1} addonBefore="$" type="number" />
                </Form.Item>
              ) : (
                <>
                  <Form.Item
                    name="discountPercentage"
                    label="Voucher Discount Percentage"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <InputNumber addonAfter="%" min={1} />
                  </Form.Item>
                  <Form.Item
                    name="maxAmountIfPercentage"
                    label="Maximum Amount That Can Be Discounted"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <InputNumber addonBefore="$" min={1} type="number" />
                  </Form.Item>
                </>
              )
            }
          </Form.Item>

          {/* {amountTypeValue == 0 ? (
            <Form.Item
              name="flatAmount"
              label="Voucher Flat Amount"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <InputNumber addonBefore="$" min={1} />
            </Form.Item>
          ) : (
            <Form.Item
              name="discountPercentage"
              label="Voucher Discount Percentage"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <InputNumber addonAfter="%" min={1} />
            </Form.Item>
          )} */}
          <Form.Item>
            <Form.Item
              name="scheduledDateTime"
              label="Voucher Expiry Date"
              rules={[
                {
                  type: 'array',
                  required: true,
                  message: 'Please select expiry date and time!',
                },
              ]}
            >
              <RangePicker
                showTime={{format: 'HH:mm:ss'}}
                format="DD-MM-YYYY HH:mm:ss"
                // onOk={onOk}
              />
            </Form.Item>
            <Space>
              <SubmitButton form={form} submitLoading={submitLoading} />
              {/* <Button htmlType="reset" onClick={resetForm}>Reset</Button> */}
              <Button onClick={resetForm}>Reset</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CreateVoucherModal;
