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
  const [fileLoading, setFileLoading] = useState(false);
  const [fileUrl, setFileURL] = useState(null);
  const [fileError, setFileError] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [progress, setProgress] = useState(0);

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
    } else if (fileUrl === null) {
      setFileError(true);
    } else {
      setImageError(false);
      setFileError(false);
      setSubmitLoading(true);
      try {
        const variables = {
          id: values.id,
          status: valueed,
          name: values.name,
          priority: values.position,
          imageUrl: imageUrl,
          fileUrl: fileUrl,
        };

        const data = await axios
          .post(`${envUrl.baseUrl}${cmsendPoint.saveCatalogue}`, variables, {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
          })
          .then(function (result) {
            if (result) {
              if (result.data.saveCatalogue === 'success') {
                setSubmitLoading(false);
                setImageURL(null);
                setFileURL(null);
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

  const saveImage = ({file, onSuccess, onProgress, onError}) => {
    setImageError(false);
    setLoading(true);
    console.log('e.target.value :', file);
    uploadFileToBlob(file, onSuccess, onProgress, onError);
  };

  const savePdf = ({file, onSuccess, onProgress, onError}) => {
    setFileLoading(true);
    setFileError(false);
    console.log('&&&&&&&&&&&&&&&&&&&&&&& e.target.value :', file);
    uploadFileToBlob(file, onSuccess, onProgress, onError);
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
    return isJpgOrPng && isLt2M;
  }

  function beforeUploadPdf(file) {
    console.log('&&&&&&&&&&&&&&&222 file = ', file);
    const isPdf = file.type === 'application/pdf';
    if (!isPdf) {
      message.error('You can only upload Pdf file!');
    }
    return isPdf;
  }

  // new for node
  const uploadFileToBlob = async (file, onSuccess, onProgress, onError) => {
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
        onUploadProgress: (event) => {
          const percent = Math.floor((event.loaded / event.total) * 100);
          setProgress(percent);
          if (percent === 100) {
            setTimeout(() => setProgress(0), 1000);
          }
          onProgress({percent: (event.loaded / event.total) * 100});
        },
      })
      .then((response) => {
        if (response.status == 200) {
          if (file.type == 'application/pdf') {
            onSuccess(file);
            setFileURL('/' + response.data.data);
            setFileLoading(false);
          } else {
            onSuccess(file);
            setImageURL('/' + response.data.data);
            setLoading(false);
          }
        } else {
          throw new ERROR('Error in File Upload');
        }
      })
      .catch((error) => {
        // inform the user
        console.log('error in Uploading File', error);
        onError({error});
      });
  };

  // new for node
  const removeFileToBlob = async (file, fileType) => {
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
          if (fileType == 'pdf') {
            setFileURL(null);
            setFileLoading(false);
          } else {
            setImageURL(null);
            setLoading(false);
          }
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
        removeFileToBlob(imageUrl, 'image');
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  function removePdfFile() {
    confirm({
      title: 'Do you Want to delete this file?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        removeFileToBlob(fileUrl, 'pdf');
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  const handleChange = (info) => {
    let newFileList = [...info.fileList];

    // 1. Limit the number of uploaded files
    // Only to show the recent uploaded files, and old ones will be replaced by the new
    newFileList = newFileList.slice(-1);

    // 2. Read from response and show file link
    newFileList = newFileList.map((file) => {
      // Component will show file.url as link
      if (file.response) {
        file.url = process.env.BRAND_CDN_URL + fileUrl;
      }
      return file;
    });
    setFileList(newFileList);
  };

  return (
    <>
      <Modal
        title="Add Catalogue"
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
            label="Enable Catalogue"
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
            rules={[{required: true, message: 'Please enter catalogue name'}]}
          >
            <Input placeholder="Enter catalogue name" />
          </Form.Item>
          <Form.Item
            label="Position"
            name="position"
            rules={[
              {required: true, message: 'Please enter catalogue position'},
            ]}
          >
            <InputNumber
              type="number"
              style={{width: '100%'}}
              min={1}
              max={100}
              placeholder="Enter catalogue position"
            />
          </Form.Item>

          <Form.Item label="Cover Image" name="image" className={styles.label}>
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
                  <div style={{marginTop: 8}}>Upload Cover Image</div>
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
          {/* i1 */}
          <Form.Item label="PDF File" name="pdf_file" className={styles.label}>
            <div className={styles.ImageSection}>
              <Upload
                listType="text"
                customRequest={savePdf}
                className="avatar-uploader"
                // showUploadList={false}
                beforeUpload={beforeUploadPdf}
                onRemove={removePdfFile}
                // onPreview={handlePreview}
                fileList={fileList}
                onChange={handleChange}
              >
                <div>
                  {loading ? <LoadingOutlined /> : <UploadOutlined />}
                  <div style={{marginTop: 8}}>Upload Pdf File</div>
                </div>
              </Upload>
            </div>

            {fileError && (
              <div
                class="invalid-feedback"
                style={{
                  display: 'block',
                  marginTop: '-5px',
                  height: '100px',
                }}
              >
                Please upload Pdf file
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
