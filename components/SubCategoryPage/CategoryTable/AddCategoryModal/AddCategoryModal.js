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
import {cmsendPoint, envUrl, CategoryimageUrl} from '../../../../utils/factory';
const {TextArea} = Input;
const AddCategoryModal = ({
  visible,
  handleOk,
  handleCancel,
  categories,
  Addcategoryflag,
}) => {
  const [form] = Form.useForm();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [valueed, setValueED] = React.useState(true);
  const [valuecategory, setValueCategoty] = React.useState(null);
  const [valuecategoryid, setValueCategotyid] = React.useState(null);

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
    setSubmitLoading(true);
    try {
      const variables = {
        id: values.id,
        status: valueed,
        level: 2,
        name:
          valuecategory === null
            ? values.name
            : valuecategory + '/' + values.name,
        priority: values.position,
        parent_id: valuecategoryid === null ? '0' : valuecategoryid,
      };

      const data = await axios
        .post(`${envUrl.baseUrl}${cmsendPoint.addCategory}`, variables, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
        })
        .then(function (result) {
          console.log('@@@@@@@@@@@@@@@result', result);
          if (result) {
            if (result.data.saveCategory === 'success') {
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
          console.log('@@@@@@@@@@@@@@@result-1', error);
        });
    } catch (error) {
      console.log('error signIn:', error.message);
      handleCancel();
      setSubmitLoading(false);
    }
  };

  function onChangeED(e) {
    console.log('radio checked', e.target.value);
    setValueED(e.target.value);
  }

  const handleChangeCategoty = (value) => {
    console.log(`selected ${value}`);
    const categoryname =
      categories && categories.data.filter((i) => i.id === value);
    setValueCategoty(categoryname[0].name);
    setValueCategotyid(value);
  };

  return (
    <>
      <Modal
        title="Add Sub Category"
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
            label="Enable Category"
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
            name="subcategory"
            label="Select Category"
            rules={[{required: true, message: 'Please select category'}]}
          >
            <Select
              placeholder="Select a category"
              onChange={handleChangeCategoty}
              allowClear
              name="status"
            >
              {categories &&
                categories.data &&
                categories.data
                  .filter((i) => i.level == '1')
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
            label="Name"
            name="name"
            rules={[{required: true, message: 'Please enter subcategory name'}]}
          >
            <Input placeholder="Enter subcategory name" />
          </Form.Item>
          <Form.Item
            label="Position"
            name="position"
            rules={[
              {required: true, message: 'Please enter category position'},
            ]}
          >
            <InputNumber
              style={{width: '100%'}}
              min={1}
              max={100}
              placeholder="Enter category position"
            />
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

export default AddCategoryModal;
