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
  const [loading, setLoading] = useState(false);
  const [valuecategoryid, setValueCategotyid] = useState(null);
  const [valuecategory, setValueCategoty] = useState({});
  const [categorystatus, setCategoryStatus] = useState(false);

  const handleChangeCategoty = (value) => {
    const categoryname = categories && categories.filter((i) => i.id === value);
    setValueCategoty({...categoryname.name});
    setValueCategotyid(value);
    setCategoryStatus(true);
  };

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
        // id: values.id,
        // status: valueed,
        // name: values.name,
        // priority: values.position,
        categories: values.categories,
      };
      console.log('vvvvvvvv', variables);
      // setSubmitLoading(false);
      // return;

      const data = await axios
        .post(
          `${envUrl.baseUrl}${cmsendPoint.saveAssemblySolutions}`,
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
            if (result.data.saveIndustry === 'success') {
              setSubmitLoading(false);
              handleCancel();
              Addcategoryflag(true);
              onReset();
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
    console.log('radio checked', e.target.value);
    setValueED(e.target.value);
  }

  const {confirm} = Modal;

  return (
    <>
      <Modal
        title="Add Assembly Solutions"
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
        >
          {/* <Form.Item
            label="Enable Industry"
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
          </Form.Item> */}

          {/* <Form.Item
            label="Name"
            name="name"
            rules={[{required: true, message: 'Please enter industry name'}]}
          >
            <Input placeholder="Enter industry name" />
          </Form.Item> */}
          {/* <Form.Item
            label="Position"
            name="position"
            rules={[
              {required: true, message: 'Please enter industry position'},
            ]}
          >
            <InputNumber
              type="number"
              style={{width: '100%'}}
              min={1}
              max={100}
              placeholder="Enter industry position"
            />
          </Form.Item> */}
          <Form.Item
            label="Category"
            name="categories"
            rules={[
              {
                required: true,
                message: 'Please select category',
                type: 'array',
              },
            ]}
          >
            <Select
              // disabled
              required
              mode="multiple"
              placeholder="category"
              onChange={handleChangeCategoty}
              allowClear
              name="category"
              showSearch
              optionFilterProp="children"
            >
              {categories &&
                categories.map((item, i) => {
                  return <Option value={item.id}>{item.name}</Option>;
                })}
            </Select>
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
