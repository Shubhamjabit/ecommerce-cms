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
  setIsModalCloseable,
}) => {
  const [form] = Form.useForm();
  const categorydata = useSelector((status) => status.categoryReducer.category);
  const [cateposition, setCatePosition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageURL] = useState('');
  const [imageerror, setImageError] = useState(false);
  const [removeimage, setRemoveImage] = useState(true);

  const [submitLoading, setSubmitLoading] = useState(false);

  const Footer = () => {
    return (
      <Button className="dashboard-addNewProduct" htmlType="submit">
        Submit
      </Button>
    );
  };
  useEffect(() => {
    form.setFieldsValue({
      id: categorydata && categorydata.id ? categorydata.id : null,
      status: categorydata && categorydata.status === 0 ? false : true,
      level: categorydata && categorydata.level ? categorydata.level : null,
      parent_id:
        categorydata && categorydata.parent_id ? categorydata.parent_id : null,
      priority:
        categorydata && categorydata.priority ? categorydata.priority : null,
      name: categorydata && categorydata.name ? categorydata.name : null,
    });
  }, [visible]);

  useEffect(() => {
    setCatePosition(categorydata && categorydata.priority);
    setImageURL(categorydata && categorydata.image_url);
  }, [visible]);

  // to disable modal close if image url is null
  useEffect(() => {
    if (imageUrl === null) {
      setIsModalCloseable(false);
      // setImageError(true);
    } else {
      setIsModalCloseable(true);
    }
  }, [imageUrl]);

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
          imageUrl: imageUrl,
        };

        const data = await axios
          .post(`${envUrl.baseUrl}${cmsendPoint.updateBrand}`, variables, {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
          })
          .then(function (result) {
            if (result) {
              if (result.data.updateCategory === 'success') {
                setSubmitLoading(false);
                setIsModalCloseable(true);
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

  // new for node
  const uploadFileToBlob = async (file) => {
    if (!file) return [];
    // upload file to server
    const formData = new FormData();
    formData.append('new_file', file);
    formData.append('type', 'brandimages');
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
    formData.append('type', 'brandimages');
    console.log('@@@@@ delete', file);
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
      title: 'Do you Want to delete these image?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        removeFileToBlob(imageUrl);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  console.log('!!!!!!!!!!!!!! categorydata', categorydata);
  return (
    <>
      <Modal
        title="Edit Brand"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        width={1000}
        style={{top: 20}}
        // maskClosable={false}
        // closable={false}
        // keyboard={false}
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
            label="Enable Brand"
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
            rules={[{required: true, message: 'Please enter brand name'}]}
          >
            <Input
              placeholder="Enter brand name"
              value={categorydata && categorydata.name}
            />
          </Form.Item>
          <Form.Item
            label="Position"
            name="priority"
            rules={[
              {
                required: cateposition ? false : true,
                message: 'Please enter brand position',
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
              placeholder="Enter category position"
            />
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
                        src={process.env.BRAND_CDN_URL + imageUrl}
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
                  display: 'block',
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
