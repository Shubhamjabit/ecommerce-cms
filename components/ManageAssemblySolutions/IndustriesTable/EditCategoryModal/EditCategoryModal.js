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
} from 'antd';
import {v4 as uuidv4} from 'uuid';
import Router from 'next/router';
import moment from 'moment';
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
const EditCategoryModal = ({
  visible,
  handleOk,
  handleCancel,
  Editcategoryflag,
  categories,
}) => {
  const [form] = Form.useForm();
  const categorydata = useSelector((status) => status.categoryReducer.category);
  let dataForLinkedCategories = useSelector(
    (state) => state.manageFilterReducer.dataForSubcatTitle
  );
  console.log('@@@@@@@@@@@ dataForLinkedCategories', dataForLinkedCategories);
  const [cateposition, setCatePosition] = useState(null);
  const [valuecategoryid, setValueCategotyid] = useState(null);
  const [valuecategory, setValueCategoty] = useState({});
  const [categorystatus, setCategoryStatus] = useState(false);
  const [z, setZ] = useState(null);
  console.log('zzzzzzzzzzz', z);

  const handleChangeCategoty = (value) => {
    console.log('@@@@@#33333', value);
    const categoryname = categories && categories.filter((i) => i.id === value);
    setValueCategoty({...categoryname.name});
    setValueCategotyid(value);
    setCategoryStatus(true);
  };

  useEffect(() => {
    let z = [];
    if (dataForLinkedCategories) {
      let v = dataForLinkedCategories.filterJson;
      for (let i = 0; i < v.length; i++) {
        z.push({value: v[i].id, label: v[i].category_Name});
      }
      setZ(z);
      form.setFieldsValue({
        id: categorydata && categorydata.id ? categorydata.id : null,
        status: categorydata && categorydata.status === 0 ? false : true,
        level: categorydata && categorydata.level ? categorydata.level : null,
        category: z,
      });
    }
  }, [dataForLinkedCategories]);

  form.setFieldsValue({
    id: categorydata && categorydata.id ? categorydata.id : null,
    status: categorydata && categorydata.status === 0 ? false : true,
    level: categorydata && categorydata.level ? categorydata.level : null,
    category: z,
    parent_id:
      categorydata && categorydata.parent_id ? categorydata.parent_id : null,
    priority:
      categorydata && categorydata.priority ? categorydata.priority : null,
    name: categorydata && categorydata.name ? categorydata.name : null,
  });
  const [submitLoading, setSubmitLoading] = useState(false);

  const Footer = () => {
    return (
      <Button className="dashboard-addNewProduct" htmlType="submit">
        Submit
      </Button>
    );
  };
  useEffect(() => {
    setCatePosition(categorydata && categorydata.priority);
  }, [visible]);
  const onFinish = async (values) => {
    setSubmitLoading(true);
    try {
      var x = [];
      for (let i = 0; i < dataForLinkedCategories.filterJson.length; i++) {
        for (let j = 0; j < values.categories; j++) {
          if (
            values.categories[j] ==
            dataForLinkedCategories.filterJson[i].category_name
          ) {
            x.push(dataForLinkedCategories.filterJson[j].id);
          }
        }
      }
      const variables = {
        id: categorydata.id ? categorydata.id : null,
        status: values.status,
        name: values.name,
        priority: cateposition,
        categories: values.categories,
        // categories: x,
      };
      console.log('update variables', variables);
      // setSubmitLoading(true);
      // return;
      const data = await axios
        .post(`${envUrl.baseUrl}${cmsendPoint.updateIndustry}`, variables, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
        })
        .then(function (result) {
          if (result) {
            if (result.data.updateCategory === 'success') {
              setSubmitLoading(false);
              handleCancel();
              Editcategoryflag(true);
              setCatePosition(null);
            } else {
              //not deleted
            }
          } else {
            //error
          }
        })
        .catch(function (error) {
          //console.log('@@@@@@@@@@@@@@@result-1', error);
        });
    } catch (error) {
      //console.log('error signIn:', error.message);
      handleCancel();
      setSubmitLoading(false);
    }
  };

  const onChange = (value) => {
    //console.log('changed ############', value);
    setCatePosition(value);
  };

  const {confirm} = Modal;

  console.log('!!!!!!!!!!!!!! categorydata', categorydata);
  return (
    <>
      <Modal
        title="Edit Industry"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        width={1000}
        style={{top: 20}}
      >
        <Form
          key={categorydata && categorydata.id ? categorydata.id : null}
          form={form}
          labelCol={{span: 6}}
          wrapperCol={{span: 24}}
          autoComplete="off"
          initialValues={{
            id: categorydata && categorydata.id ? categorydata.id : null,
            status: categorydata && categorydata.status === 0 ? false : true,
            category: z,
            parent_id:
              categorydata && categorydata.parent_id
                ? categorydata.parent_id
                : null,
            level:
              categorydata && categorydata.level ? categorydata.level : null,
            priority:
              categorydata && categorydata.priority
                ? categorydata.priority
                : null,
            name: categorydata && categorydata.name ? categorydata.name : null,
          }}
          onFinish={(values) => onFinish(values)}
        >
          <Form.Item
            label="Enable Industry"
            labelCol={{span: 6}}
            wrapperCol={{span: 18}}
            name="status"
            value={categorydata && categorydata.status}
          >
            <Radio.Group optionType="button" buttonStyle="solid">
              <Radio.Button value={true}>Yes</Radio.Button>
              <Radio.Button value={false}>No</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="Name"
            name="name"
            rules={[{required: true, message: 'Please enter industry name'}]}
          >
            <Input
              placeholder="Enter industry name"
              value={categorydata && categorydata.name}
            />
          </Form.Item>
          <Form.Item
            label="Position"
            name="priority"
            rules={[
              {
                required: cateposition ? false : true,
                message: 'Please enter industry position',
              },
            ]}
          >
            <InputNumber
              type="number"
              style={{width: '100%'}}
              min={1}
              onChange={onChange}
              defaultValue={cateposition}
              max={100}
              placeholder="Enter industry position"
            />
          </Form.Item>

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
              // defaultValue={dataForLinkedCategories?.category_name}
              // defaultValue={z}
              defaultValue={
                dataForLinkedCategories && dataForLinkedCategories.filterJson
                  ? dataForLinkedCategories.filterJson.map((item) => item.id)
                  : []
              }
              // value={z}
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
              Update
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default EditCategoryModal;
