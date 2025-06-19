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
  DatePicker,
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
import moment from 'moment-timezone';
const {TextArea} = Input;
const AddBannerModal = ({visible, handleOk, handleCancel, AddBannerflag}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [valueed, setValueED] = React.useState(true);
  const [imageUrl, setImageURL] = useState(null);
  const [imageerror, setImageError] = useState(false);
  const [removeimage, setRemoveImage] = useState(true);
  const [fromdate, setFromdate] = useState(null);
  const [todate, setTodate] = useState(null);
  const {RangePicker} = DatePicker;
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
          title: values.title,
          priority: values.position,

          image_url: imageUrl
            ? imageUrl
            : removeimage === true
            ? imageUrl
            : null,
          from_date: fromdate ? fromdate : currentfromdate,
          to_date: todate ? todate : currenttodate,
        };

        const data = await axios
          .post(`${envUrl.baseUrl}${cmsendPoint.addMainBanner}`, variables, {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
          })
          .then(function (result) {
            if (result) {
              if (result.data.saveMainBanner === 'success') {
                setSubmitLoading(false);
                setImageURL(null);
                handleCancel();
                onReset();
                AddBannerflag(true);
                setFromdate(null);
                setTodate(null);
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
    }
  };

  function onChangeED(e) {
    console.log('radio checked', e.target.value);
    setValueED(e.target.value);
  }

  const saveImage = ({file, onSuccess}) => {
    setLoading(true);
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
    setImageError(false);
    return isJpgOrPng && isLt2M;
  }

  const containerName = `bannerimages`;
  const sasToken = process.env.REACT_APP_STORAGESASTOKEN;
  const storageAccountName = process.env.REACT_APP_STORAGERESOURCENAME;

  //console.log('calling uploadFileToBlob -------', storageAccountName);

  const uploadFileToBlob = async (file) => {
    try {
      if (!file) return [];
      //console.log('calling uploadFileToBlob -------');
      // get BlobService = notice `?` is pulled out of sasToken - if created in Azure portal
      const blobService = new BlobServiceClient(
        `https://${storageAccountName}.blob.core.windows.net/?${sasToken}`
      );
      // get Container - full public read access
      const containerClient = blobService.getContainerClient(containerName);
      await containerClient.createIfNotExists({
        access: 'container',
      });
      //console.log('calling uploadFileToBlob -------11111', containerClient);
      // upload file

      const imageID = uuidv4();
      let key = imageID + '.' + file.type.split('/').pop();
      const blobClient = containerClient.getBlockBlobClient(key);

      // console.log('calling uploadFileToBlob -------2222', blobClient);
      const options = {blobHTTPHeaders: {blobContentType: file.type}};
      //console.log('calling uploadFileToBlob -------3333', options);
      await blobClient.uploadBrowserData(file, options);
      setImageURL('/' + key);
      setLoading(false);
      setImageError(false);
    } catch (error) {
      console.log('error>>>>>>>>:', error);
      setLoading(false);
    }
    //await createBlobInContainer(containerClient, file);
    // get list of blobs in container
    //return getBlobsInContainer(containerClient);
  };

  const removeFileToBlob = async (file) => {
    const blobService = new BlobServiceClient(
      `https://${storageAccountName}.blob.core.windows.net/?${sasToken}`
    );
    const containerClient = blobService.getContainerClient(containerName);
    await containerClient.createIfNotExists({
      access: 'container',
    });
    const options = {
      deleteSnapshots: 'include', // or 'only'
    };
    // Create blob client from container client
    const blockBlobClient = await containerClient.getBlockBlobClient(
      file.split('/').pop()
    );
    await blockBlobClient.delete(options);
    setImageURL(null);
    setLoading(false);
    setRemoveImage(false);
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

  function onOk(value) {
    console.log('datetime-3: ', value);
  }

  function onChange(value, dateString) {
    console.log('datetime-1: ', value);
    console.log('datetime-2: ', dateString);
    setFromdate(moment(dateString[0]).format('YYYY-DD-MM HH:mm:ss'));
    setTodate(moment(dateString[1]).format('YYYY-DD-MM HH:mm:ss'));
    //setTodate(dateString[1]);
  }

  const currentfromdate = moment()
    .tz('Australia/Sydney')
    .format('YYYY-MM-DD HH:mm:ss');

  const currenttodate = moment()
    .tz('Australia/Sydney')
    .add(2, 'M')
    .format('YYYY-MM-DD HH:mm:ss');

  return (
    <>
      <Modal
        title="Add Banner"
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
            label="Enable Banner"
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
            label="Title"
            name="title"
            rules={[{required: true, message: 'Please enter banner title'}]}
          >
            <Input placeholder="Enter banner title" />
          </Form.Item>
          <Form.Item
            label="Position"
            name="position"
            rules={[{required: true, message: 'Please enter banner position'}]}
          >
            <InputNumber
              style={{width: '100%'}}
              min={1}
              max={100}
              placeholder="Enter banner position"
            />
          </Form.Item>
          <Form.Item label="Schedule Date" name="date">
            <RangePicker
              showTime={{format: 'HH:mm:ss'}}
              format="DD-MM-YYYY HH:mm:ss"
              defaultValue={[moment(currentfromdate), moment(currenttodate)]}
              onChange={onChange}
              onOk={onOk}
              // disabledDate={disabledDate}
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
                        src={process.env.BANNER_CDN_URL + imageUrl}
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

export default AddBannerModal;
