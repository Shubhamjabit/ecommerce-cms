import React, {useState, useEffect} from 'react';
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

  const [valueed, setValueED] = React.useState(null);
  const [valueshowmenu, setValueShowMenu] = React.useState(null);
  const [valuecategory, setValueCategoty] = React.useState(null);
  const [valuecategoryid, setValueCategotyid] = React.useState(null);
  const [subcate, setSubCate] = React.useState();
  const [catefilter, setCatefilter] = React.useState();
  const [subcatefilter, setSubcatefilter] = React.useState();
  const [addsubcate, setAddSubCate] = useState();
  const [cateposition, setCatePosition] = useState(null);

  form.setFieldsValue({
    id: categorydata && categorydata.id ? categorydata.id : null,
    status: categorydata && categorydata.status === 0 ? false : true,
    level: categorydata && categorydata.level ? categorydata.level : null,
    priority:
      categorydata && categorydata.priority ? categorydata.priority : null,
    name:
      categorydata && categorydata.name.split('/').pop()
        ? categorydata.name.split('/').pop()
        : null,
    subcategory:
      categorydata && categorydata.name.split('/')
        ? categorydata.name.split('/')
        : null,
  });
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    setSubcatefilter(
      categorydata &&
        categorydata.name.replace(/ /g, '-').split('/')[0].toLowerCase()
    );
    setAddSubCate(
      categorydata && categorydata.name.replace(/ /g, '-').split('/')[0]
    );
    setCatefilter(
      categorydata &&
        categorydata.name.replace(/ /g, '-').split('/').pop().toLowerCase()
    );
  });
  useEffect(() => {
    setValueED(null);
    setValueShowMenu(null);
    setValueShowMenu(parseInt(categorydata && categorydata.level));
    setValueCategoty(categorydata && categorydata.name);
    setValueCategotyid(categorydata && categorydata.parent_id);
    setCatePosition(categorydata && categorydata.priority);
  }, [visible]);

  const Footer = () => {
    return (
      <Button className="dashboard-addNewProduct" htmlType="submit">
        Submit
      </Button>
    );
  };

  const onFinish = async (values) => {
    setSubmitLoading(true);
    try {
      const variables = {
        id: categorydata.id ? categorydata.id : null,
        status: values.status,
        level: valueshowmenu
          ? valueshowmenu
          : parseInt(categorydata && categorydata.level),
        name:
          valueshowmenu === 1
            ? values.name
            : subcate === undefined
            ? addsubcate + '/' + values.name
            : subcate + '/' + values.name,
        priority: cateposition,
        parent_id: valueshowmenu === 1 ? '0' : valuecategoryid,
      };

      const data = await axios
        .post(`${envUrl.baseUrl}${cmsendPoint.updateCategory}`, variables, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
        })
        .then(function (result) {
          //console.log('@@@@@@@@@@@@@@@result', result);
          if (result) {
            if (result.data.updateCategory === 'success') {
              setSubmitLoading(false);
              handleCancel();
              Editcategoryflag(true);
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
      console.log('error signIn:', error.message);
      handleCancel();
      setSubmitLoading(false);
    }
  };

  const handleChangeCategoty = (value) => {
    console.log(`selected ${value}`);
    const categoryname =
      categories && categories.data.filter((i) => i.id === value);
    setValueCategoty(categoryname[0].name);
    setValueCategotyid(value);
    setSubCate(categoryname[0].name);
  };

  const onChange = (value) => {
    //console.log('changed ############', value);
    setCatePosition(value);
  };
  return (
    <>
      <Modal
        title="Edit Subcategory"
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
            level:
              categorydata && categorydata.level ? categorydata.level : null,
            priority:
              categorydata && categorydata.priority
                ? categorydata.priority
                : null,
            name:
              categorydata && categorydata.name.split('/').pop()
                ? categorydata.name.split('/').pop()
                : null,
            subcategory:
              categorydata && categorydata.name.split('/').pop()
                ? categorydata.name.split('/').pop()
                : null,
          }}
          onFinish={(values) => onFinish(values)}
        >
          <Form.Item
            label="Enable Category"
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

          <Form.Item name="subcate" label="Select Category">
            <Select
              placeholder="Select a category"
              onChange={handleChangeCategoty}
              defaultValue={categorydata && categorydata.name.split('/')}
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
            label="Name"
            name="name"
            rules={[
              {required: true, message: 'Please enter  subcategory name'},
            ]}
          >
            <Input
              placeholder="Enter subcategory name"
              value={categorydata && categorydata.name}
            />
          </Form.Item>

          <Form.Item
            label="Position"
            name="priority"
            rules={[
              {
                required: cateposition ? false : true,
                message: 'Please enter subcategory position',
              },
            ]}
          >
            <InputNumber
              style={{width: '100%'}}
              min={1}
              onChange={onChange}
              defaultValue={cateposition}
              max={100}
              placeholder="Enter category position"
            />
          </Form.Item>

          <Form.Item style={{textAlign: 'right'}}>
            <Button type="primary" htmlType="submit" loading={submitLoading}>
              Update
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default EditCategoryModal;
