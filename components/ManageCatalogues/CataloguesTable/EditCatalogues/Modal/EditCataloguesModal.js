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
import {
  cmsendPoint,
  envUrl,
  CategoryimageUrl,
} from '../../../../../utils/factory';
const {TextArea} = Input;
const EditCategoryModal = ({
  visible,
  handleOk,
  handleCancel,
  Editcategoryflag,
  categories,
  setIsModalCloseable,
  isModalCloseable,
}) => {
  const [form] = Form.useForm();
  const categorydata = useSelector((status) => status.categoryReducer.category);
  const [cateposition, setCatePosition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageURL] = useState(null);
  const [imageerror, setImageError] = useState(false);
  const [removeimage, setRemoveImage] = useState(true);
  const [fileLoading, setFileLoading] = useState(false);
  const [fileUrl, setFileURL] = useState(null);
  const [fileError, setFileError] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [progress, setProgress] = useState(0);

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
    setImageURL(categorydata && categorydata.cover_image_url);
    if (categorydata != 'undefined' && categorydata) {
      let f = categorydata && categorydata?.file_url?.slice(1);
      setFileList([
        {
          uid: `${categorydata?.id}`,
          name: `${categorydata?.name}`,
          status: 'done',
          url: `${process.env.BRAND_CDN_URL + f}`,
        },
      ]);
      setFileURL(categorydata && categorydata.file_url);
    }
    setFileURL(categorydata && categorydata.file_url);
  }, [visible]);

  // to disable modal close if image url is null
  useEffect(() => {
    console.log('imgurl', imageUrl);
    console.log('fileUrl', fileUrl);
    if (imageUrl == null) {
      setIsModalCloseable(false);
      // setImageError(true);
    } else if (fileUrl == null) {
      setIsModalCloseable(false);
    } else {
      setIsModalCloseable(true);
    }
  }, [imageUrl, fileUrl]);

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
          id: categorydata.id ? categorydata.id : null,
          status: values.status,
          name: values.name,
          priority: cateposition,
          imageUrl: imageUrl,
          fileUrl: fileUrl,
        };

        const data = await axios
          .post(`${envUrl.baseUrl}${cmsendPoint.updateCatalogue}`, variables, {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
          })
          .then(function (result) {
            if (result) {
              if (result.data.updateCatalogue === 'success') {
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

  const saveImage = ({file, onSuccess, onProgress, onError}) => {
    setLoading(true);
    console.log('e.target.value :', file);
    uploadFileToBlob(file, onSuccess, onProgress, onError);
  };

  const savePdf = ({file, onSuccess, onProgress, onError}) => {
    setFileLoading(true);
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
    setImageError(false);
    return isJpgOrPng && isLt2M;
  }

  function beforeUploadPdf(file) {
    console.log('&&&&&&&&&&&&&&&222 file = ', file);
    const isPdf = file.type === 'application/pdf';
    if (!isPdf) {
      message.error('You can only upload Pdf file!');
    }
    setFileError(false);
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
            // So that user click update button!
            setIsModalCloseable(false);
          } else {
            onSuccess(file);
            setImageURL('/' + response.data.data);
            setLoading(false);
            // So that user click update button!
            setIsModalCloseable(false);
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
            setIsModalCloseable(false);
          } else {
            setImageURL(null);
            setLoading(false);
            setIsModalCloseable(false);
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
        // to prevent file from disappering on cancel
        let f =
          categorydata &&
          categorydata.file_url &&
          categorydata.file_url.slice(1);
        setFileList([
          {
            uid: `${categorydata.id}`,
            name: `${categorydata.name}`,
            status: 'done',
            url: `${process.env.BRAND_CDN_URL + f}`,
          },
        ]);
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

  const handleCancelValidation = () => {
    console.log('handleCancelValidation', isModalCloseable);
    if (isModalCloseable == false) {
      if (imageUrl == null) {
        setImageError(true);
      } else if (fileError == null || fileList.length == 0) {
        setFileError(true);
      }
    } else {
      handleCancel();
    }
  };

  console.log('!!!!!!!!!!!!!! categorydata', categorydata);
  console.log('!!!!!!!!!!!!!!2222 imageURL', imageUrl);
  console.log('!!!!!!!!!!!!!!3333 fileList', fileList);
  return (
    <>
      <Modal
        title="Edit Catalogue"
        visible={visible}
        onOk={handleOk}
        // onCancel={handleCancel}
        onCancel={handleCancelValidation}
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
            label="Enable Catalogue"
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
            rules={[{required: true, message: 'Please enter catalogue name'}]}
          >
            <Input
              placeholder="Enter catalogue name"
              value={categorydata && categorydata.name}
            />
          </Form.Item>
          <Form.Item
            label="Position"
            name="priority"
            rules={[
              {
                required: cateposition ? false : true,
                message: 'Please enter catalogue position',
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
              Update
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default EditCategoryModal;
