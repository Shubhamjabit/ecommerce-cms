import React, {useState, useEffect} from 'react';
import {
  Upload,
  Form,
  message,
  Input,
  Button,
  Radio,
  Switch,
  Modal,
  Row,
  Col,
  Select,
  InputNumber,
} from 'antd';
import {v4 as uuidv4} from 'uuid';
import Router from 'next/router';
import {
  PlusOutlined,
  UploadOutlined,
  LoadingOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import styles from './styles.module.scss';
import {BlobServiceClient, ContainerClient} from '@azure/storage-blob';
import {cmsendPoint, envUrl, CategoryimageUrl} from '../../../../utils/factory';
import {useSelector, useDispatch} from 'react-redux';
const {TextArea} = Input;

const AddCmsUserModal = ({
  visible,
  handleOk,
  handleCancel,
  categories,
  Addcategoryflag,
  rs,
  setRs,
}) => {
  const [form] = Form.useForm();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [valueed, setValueED] = useState(true);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageURL] = useState(null);
  const [imageerror, setImageError] = useState(false);
  const [removeimage, setRemoveImage] = useState(true);
  const [submittable, setSubmittable] = useState(false);
  const [customState, setCustomState] = useState(0);
  const values = Form.useWatch([], form);

  const cmsUsersFromReducer = useSelector(
    (state) => state.userReducer.cmsUsers
  );

  // console.log('cccccccccccccccccc cmsUsersFromReducer', cmsUsersFromReducer);

  const Footer = () => {
    return (
      <Button className="dashboard-addNewProduct" htmlType="submit">
        Submit
      </Button>
    );
  };
  const onReset = () => {
    form.resetFields();
  };

  const onFinish = async (values) => {
    try {
      const variables = {
        id: values.id,
        status: valueed,
        userId: values.userId,
        password: values.password,
      };

      const data = await axios
        .post(`${envUrl.baseUrl}${cmsendPoint.addCmsUser}`, variables, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
        })
        .then(function (result) {
          if (result) {
            if (result.data.saveCategory === 'success') {
              setSubmitLoading(false);
              handleCancel();
              Addcategoryflag(true);
              onReset();
              setRs(rs + 1);
            } else {
              //not deleted
            }
          } else {
            //error
          }
        })
        .catch(function (error) {});
    } catch (error) {
      handleCancel();
    }
  };

  function onChangeED(e) {
    // console.log('radio checked', e.target.value);
    setValueED(e.target.value);
  }

  const validatePassword = (rule, value, callback) => {
    if (value && value.length < 8) {
      callback('Password length should be minimum 8 characters');
    } else {
      callback();
    }
  };

  const validateUserId = (rule, value, callback) => {
    // console.log('eeeeeeeeeeeee', e);
    if (cmsUsersFromReducer.find((o) => o.admin_emailid === value)) {
      /* same result as above, but a different function return type */
      callback('User Id alreadys exists!');
    } else {
      callback();
    }
  };

  const SubmitButton = ({form}) => {
    return (
      <Button
        type="primary"
        htmlType="submit"
        disabled={submittable}
        style={{marginTop: '10px'}}
        loading={submitLoading}
      >
        Submit
      </Button>
    );
  };

  useEffect(() => {
    // form.validateFields().then(
    //   () => {
    //     setSubmittable(true);
    //   },
    //   () => {
    //     setSubmittable(false);
    //   }
    // );
    form.validateFields().then((err, values) => {
      if (err) {
        setSubmittable(false);
      } else {
        setSubmittable(false);
      }
    });
    // console.log('fffffffffff', form.getFieldsError());
  }, []);

  useEffect(() => {
    onReset();
  }, [visible]);

  return (
    <>
      <Modal
        title="Add Category"
        open={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        width={1000}
        style={{top: 20}}
      >
        <Form
          form={form}
          onFinish={(values) => onFinish(values)}
          labelCol={{span: 6}}
          wrapperCol={{span: 24}}
          autoComplete="off"
          name="validateOnly"
        >
          <Form.Item
            label="Enable User"
            name="a"
            labelCol={{span: 6}}
            wrapperCol={{span: 18}}
          >
            <Radio.Group
              onChange={onChangeED}
              value={valueed}
              optionType="button"
              buttonStyle="solid"
              defaultValue={true}
            >
              <Radio.Button value={true}>Yes</Radio.Button>
              <Radio.Button value={false}>No</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="User Id"
            name="userId"
            // validateTrigger:"onBlur"
            rules={[
              // {
              //   type: 'email',
              //   message: 'The input is not valid E-mail!',
              // },
              {
                required: true,
                message: 'Please enter User Id',
              },
              {
                validator: validateUserId,
              },
            ]}
            validateTrigger="onBlur"
          >
            {/* <Input placeholder="Enter User Id" onBlur={validateUserId} /> */}
            <Input placeholder="Enter User Id" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
              {
                validator: validatePassword,
              },
            ]}
            hasFeedback
            validateTrigger="onBlur"
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Confirm Password"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Please confirm your password!',
              },
              ({getFieldValue}) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      'The two passwords that you entered do not match!'
                    )
                  );
                },
              }),
              {
                validateTrigger: 'onBlur',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item style={{textAlign: 'right'}}>
            {/* <Button
              type="primary"
              htmlType="submit"
              style={{marginTop: '10px'}}
              loading={submitLoading}
            >
              Save
            </Button> */}
            <SubmitButton form={form} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddCmsUserModal;
