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
import {cmsendPoint, envUrl} from '../../../../utils/factory';

const {TextArea} = Input;
const AddSubcategoryTitleModal = ({
  visible,
  handleOk,
  handleCancel,
  categories,
  filter,
  Addcategoryflag,
  refreshState,
  setRefreshState,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [valuecategory, setValueCategoty] = React.useState(null);
  const [valuecategoryid, setValueCategotyid] = React.useState(null);

  const Footer = () => {
    return (
      <Button className="dashboard-addNewProduct" htmlType="submit">
        Submit
      </Button>
    );
  };

  useEffect(() => {
    // setFilterByCategory(null);
    // setSubcategoryTitle(null);
    // setSubcategoryTitleName(null);
  }, [visible]);

  const onReset = () => {
    form.resetFields();
  };

  const onFinish = async (values) => {
    setSubmitLoading(true);
    try {
      const variables = {
        id: values.id,
        category_id: valuecategoryid,
        title: values.title,
      };
      const data = await axios
        .post(
          `${envUrl.baseUrl}${cmsendPoint.addSubcategoryTitle}`,
          variables,
          {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
          }
        )
        .then(function (result) {
          // console.log('@@@@@@@@@@@@@@@result', result);
          if (result) {
            if (result.data.saveSubategorytitle === 'success') {
              console.log('rrrrrrrrrrrr22222222222', refreshState);
              setRefreshState(refreshState + 1);
              setSubmitLoading(false);
              handleCancel();
              onReset();
              Addcategoryflag(true);
            } else {
              //not deleted
            }
          } else {
            //error
          }
        })
        .catch(function (error) {
          //  console.log('@@@@@@@@@@@@@@@result-1', error);
        });
    } catch (error) {
      console.log('error signIn:', error.message);
      handleCancel();
      setSubmitLoading(false);
    }
  };

  const handleChangeCategoty = (value) => {
    console.log(`selected ${value}`);
    setValueCategotyid(value);
  };

  return (
    <>
      <Modal
        title="Add Sub Category Title"
        visible={visible}
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
        >
          <Form.Item
            name="category"
            label="Select Category"
            rules={[{required: true, message: 'Please select category'}]}
          >
            <Select
              placeholder="Select a category"
              onChange={handleChangeCategoty}
              allowClear
              showSearch
              name="status"
              optionFilterProp="children"
            >
              {categories &&
                categories.data &&
                categories.data
                  .filter((i) => i.level === 1)
                  .map((item) => {
                    return (
                      <Option value={item.id}>
                        {item.name.split('/').pop()}
                      </Option>
                    );
                  })}
            </Select>
          </Form.Item>

          <Form.Item
            label="Subcategory Title"
            name="title"
            rules={[
              {required: true, message: 'Please enter Sub category title'},
            ]}
          >
            <Input placeholder="Enter subcategory title" />
          </Form.Item>

          <Form.Item style={{textAlign: 'right'}}>
            <Button
              type="primary"
              htmlType="submit"
              style={{marginTop: '10px'}}
              loading={submitLoading}
            >
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddSubcategoryTitleModal;
