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
  console.log('@@@valuecategoryid', valuecategoryid);
  const [valuecategory, setValueCategoty] = useState({});
  const [categorystatus, setCategoryStatus] = useState(false);
  const [z, setZ] = useState(null);
  console.log('zzzzzzzzzzz', z);
  const [imageUrl, setImageURL] = useState('');
  const [imageerror, setImageError] = useState(false);
  const [removeimage, setRemoveImage] = useState(true);
  const [loading, setLoading] = useState(false);

  const categoryID =
    dataForLinkedCategories &&
    dataForLinkedCategories.filterJson &&
    dataForLinkedCategories.filterJson.map((item) => item.id).filter(Number);

  console.log('@@categoryID', categoryID);

  const handleChangeCategoty = (value) => {
    const categoryname = categories && categories.filter((i) => i.id === value);
    setValueCategoty({...categoryname.name});
    setValueCategotyid(value);
    setCategoryStatus(true);
  };

  useEffect(() => {
    setCatePosition(categorydata && categorydata.priority);
    form.setFieldsValue({
      id: categorydata && categorydata.id ? categorydata.id : null,
      status: categorydata && categorydata.status === 0 ? false : true,
      level: categorydata && categorydata.level ? categorydata.level : null,
      categories: valuecategoryid,
    });
  }, [visible]);

  useEffect(() => {
    let z = [];
    if (dataForLinkedCategories) {
      // let v = dataForLinkedCategories.filterJson;
      // for (let i = 0; i < v.length; i++) {
      //   z.push({value: v[i].id, label: v[i].category_Name});
      // }
      // setZ(z);
      form.setFieldsValue({
        id: categorydata && categorydata.id ? categorydata.id : null,
        status: categorydata && categorydata.status === 0 ? false : true,
        level: categorydata && categorydata.level ? categorydata.level : null,
        categories: valuecategoryid,
      });
      setImageURL(dataForLinkedCategories.imgUrl);

      setValueCategotyid(categoryID);
    }
  }, [dataForLinkedCategories]);

  form.setFieldsValue({
    id: categorydata && categorydata.id ? categorydata.id : null,
    status: categorydata && categorydata.status === 0 ? false : true,
    level: categorydata && categorydata.level ? categorydata.level : null,
    categories: valuecategoryid,
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

  const onFinish = async (values) => {
    if (imageUrl === null) {
      setImageError(true);
    } else {
      setImageError(false);
      setSubmitLoading(true);
      try {
        const variables = {
          id: categorydata.id ? categorydata.id : null,
          status: values.status,
          name: values.name,
          priority: cateposition,
          // categories: values.categories,
          categories: valuecategoryid,
          imageUrl: imageUrl,
          // categories: x,
        };
        console.log('@@@@@@@update variables', variables);
        // setSubmitLoading(false);
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
                console.log('not deleted');
              }
            } else {
              console.log('no response from server');
            }
          })
          .catch(function (error) {
            console.log('@@@@@@@@@@@@@@@result-1', error);
          });
      } catch (error) {
        //console.log('error signIn:', error.message);
        handleCancel();
        setSubmitLoading(false);
      }
    }
  };

  const onChange = (value) => {
    //console.log('changed ############', value);
    setCatePosition(value);
  };

  const saveImage = ({file, onSuccess}) => {
    setLoading(true);
    setImageError(false);
    console.log('e.target.value :', file);
    uploadFileToBlob(file, onSuccess);
  };

  function beforeUpload(file) {
    const isJpgOrPng =
      file.type === 'image/jpeg' ||
      file.type === 'image/png' ||
      file.type === 'image/webp';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG/GIF/Webp file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 1;
    if (isJpgOrPng && !isLt2M) {
      message.error('Image must smaller than 1MB!');
    }
    // setImageError(false);
    return isJpgOrPng && isLt2M;
  }

  const containerName = `industryimages`;
  const sasToken = process.env.REACT_APP_STORAGESASTOKEN;
  const storageAccountName = process.env.REACT_APP_STORAGERESOURCENAME;

  console.log('calling uploadFileToBlob -------', storageAccountName);

  // new for node
  const uploadFileToBlob = async (file) => {
    if (!file) return [];
    // upload file to server
    const formData = new FormData();
    formData.append('new_file', file);
    formData.append('type', 'industryimages');
    console.log('@@@@@', file);
    console.log('!!!!!!!', formData);
    await axios
      .post(`${envUrl.baseUrl}${cmsendPoint.uploadImage}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        if (response.status == 200) {
          setImageURL('/' + response.data.data);
          setLoading(false);
        } else {
          throw new ERROR('Error in File Upload');
        }
      })
      .catch((error) => {
        // inform the user
        console.log('error in Uploading File', error);
      });
  };

  // new for node
  const removeFileToBlob = async (file) => {
    const formData = new FormData();
    formData.append('new_file', file);
    formData.append('type', 'industryimages');
    console.log('@@@@@', file);
    console.log('!!!!!!!', formData);
    await axios
      .post(`${envUrl.baseUrl}${cmsendPoint.deleteUploadImage}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        console.log('!!!!!!!!!!!!4444444 response.data', response.data);
        if (response.status == 200) {
          setImageURL(null);
          setLoading(false);
        } else {
          throw new ERROR('Error in Deleting File');
        }
      })
      .catch((error) => {
        // inform the user
        console.log('error in Deleting File', error);
      });
  };

  const {confirm} = Modal;
  function removeFile() {
    confirm({
      title: 'Do you Want to delete this image?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        removeFileToBlob(imageUrl);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  // console.log('!!!!!!!!!!!!!! categorydata', categorydata);
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
        destroyOnClose
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
            categories: valuecategoryid,
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
                required:
                  valuecategoryid && valuecategoryid.length != 0 ? false : true,
                message: 'Please select category',
                type: 'array',
              },
            ]}
          >
            <Select
              // disabled
              // required
              mode="multiple"
              placeholder="category"
              onChange={handleChangeCategoty}
              allowClear
              // name="category"
              showSearch
              optionFilterProp="children"
              // defaultValue={dataForLinkedCategories?.category_name}
              // defaultValue={z}
              // defaultValue={
              //   dataForLinkedCategories && dataForLinkedCategories.filterJson
              //     ? dataForLinkedCategories.filterJson.map((item) => item.id)
              //     : []
              // }
              defaultValue={valuecategoryid}
            >
              {categories &&
                categories.map((item, i) => {
                  return <Option value={item.id}>{item.name}</Option>;
                })}
            </Select>
          </Form.Item>
          <Form.Item label="Image" name="image" className={styles.label}>
            <div className={styles.ImageSection}>
              <Upload
                listType="picture-card"
                customRequest={saveImage}
                className="avatar-uploader"
                showUploadList={false}
                beforeUpload={beforeUpload}
                // onRemove={removeImg}
                // onPreview={handlePreview}
              >
                <div>
                  {loading ? <LoadingOutlined /> : <UploadOutlined />}
                  <div style={{marginTop: 8}}>Upload Image</div>
                </div>
              </Upload>

              {imageUrl && (
                <div className={styles.UploadFile}>
                  <div className={styles.FileView}>
                    <span className={styles.Image}>
                      <img
                        src={process.env.INDUSTRY_CDN_URL + imageUrl}
                        alt="avatar"
                      />
                    </span>
                    <span className={styles.deleteIcon}>
                      <DeleteOutlined onClick={removeFile} />
                    </span>
                  </div>
                </div>
              )}
            </div>
            {imageerror && (
              <div
                class="invalid-feedback"
                style={{
                  display: 'inline',
                  marginTop: '-5px',
                  height: '100px',
                }}
              >
                Please upload image
              </div>
            )}
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
