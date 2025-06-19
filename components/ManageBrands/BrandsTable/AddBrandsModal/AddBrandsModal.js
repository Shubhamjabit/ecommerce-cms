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
  const [imageUrl, setImageURL] = useState(null);
  const [imageerror, setImageError] = useState(false);
  const [removeimage, setRemoveImage] = useState(true);

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
    if (imageUrl === null) {
      setImageError(true);
    } else {
      setImageError(false);
      setSubmitLoading(true);
      try {
        const variables = {
          id: values.id,
          status: valueed,
          name: values.name,
          priority: values.position,
          imageUrl: imageUrl,
        };

        const data = await axios
          .post(`${envUrl.baseUrl}${cmsendPoint.saveBrand}`, variables, {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
          })
          .then(function (result) {
            if (result) {
              if (result.data.saveBrand === 'success') {
                setSubmitLoading(false);
                setImageURL(null);
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
    }
  };

  function onChangeED(e) {
    console.log('radio checked', e.target.value);
    setValueED(e.target.value);
  }

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

  return (
    <>
      <Modal
        title="Add Brand"
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
          <Form.Item
            label="Enable Brand"
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
            label="Name"
            name="name"
            rules={[{required: true, message: 'Please enter brand name'}]}
          >
            <Input placeholder="Enter brand name" />
          </Form.Item>
          <Form.Item
            label="Position"
            name="position"
            rules={[{required: true, message: 'Please enter brand position'}]}
          >
            <InputNumber
              type="number"
              style={{width: '100%'}}
              min={1}
              max={100}
              placeholder="Enter brand position"
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
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddCategoryModal;
