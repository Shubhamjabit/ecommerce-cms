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
import {BlobServiceClient, ContainerClient} from '@azure/storage-blob';
import {cmsendPoint, envUrl} from '../../../../utils/factory';
import moment from 'moment-timezone';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);
const {TextArea} = Input;
const {RangePicker} = DatePicker;
const EditBannerModal = ({visible, handleOk, handleCancel, EditBannerflag}) => {
  const [form] = Form.useForm();
  const bannerdata = useSelector((status) => status.bannerReducer.banner);

  const [imageUrl, setImageURL] = useState(null);
  const [imageerror, setImageError] = useState(false);
  const [removeimage, setRemoveImage] = useState(true);
  const [loading, setLoading] = useState(false);
  const [fromdate, setFromdate] = useState(null);
  const [todate, setTodate] = useState(null);
  form.setFieldsValue({
    id: bannerdata && bannerdata.id ? bannerdata.id : null,
    status: bannerdata && parseInt(bannerdata.status) === 0 ? false : true,
    priority: bannerdata && bannerdata.position ? bannerdata.position : null,
    title: bannerdata && bannerdata.title ? bannerdata.title : null,
    image_url: bannerdata && bannerdata.image ? bannerdata.image : null,
  });
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    setImageURL(bannerdata && bannerdata.image);
  }, [visible]);

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
      setSubmitLoading(true);
      try {
        const variables = {
          id: bannerdata.id ? bannerdata.id : null,
          status: values.status,
          position: values.priority,
          title: values.title,
          image_url: imageUrl
            ? imageUrl
            : removeimage === true
            ? imageUrl
            : null,
          from_date: fromdate
            ? fromdate
            : dayjs(bannerdata && bannerdata.from_date).format(
                'YYYY-MM-DD HH:mm:ss'
              ),
          to_date: todate
            ? todate
            : dayjs(bannerdata && bannerdata.to_date).format(
                'YYYY-MM-DD HH:mm:ss'
              ),
        };

        const data = await axios
          .post(`${envUrl.baseUrl}${cmsendPoint.updateMainBanner}`, variables, {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
          })
          .then(function (result) {
            if (result) {
              if (result.data.updateMainBanner === 'success') {
                setSubmitLoading(false);
                handleCancel();
                EditBannerflag(true);
                setImageURL(null);
                setFromdate(null);
                setTodate(null);
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
        setSubmitLoading(false);
      }
    }
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
      message.error('You can only upload JPG/PNG/GIF file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 1;
    if (isJpgOrPng && !isLt2M) {
      message.error('Image must smaller than 1MB!');
    }
    // setImageError(false);
    return isJpgOrPng && isLt2M;
  }

  const containerName = `categoryimages`;
  const sasToken = process.env.REACT_APP_STORAGESASTOKEN;
  const storageAccountName = process.env.REACT_APP_STORAGERESOURCENAME;

  console.log('calling uploadFileToBlob -------', storageAccountName);

  // new for node
  const uploadFileToBlob = async (file) => {
    if (!file) return [];
    // upload file to server
    const formData = new FormData();
    formData.append('new_file', file);
    formData.append('type', 'bannerimages');
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
    formData.append('type', 'bannerimages');
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
    setFromdate(dayjs(dateString[0]).format('YYYY-DD-MM HH:mm:ss'));
    setTodate(dayjs(dateString[1]).format('YYYY-DD-MM HH:mm:ss'));
  }
  return (
    <>
      <Modal
        title="Edit Main Banner"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        width={1000}
        style={{top: 20}}
      >
        <Form
          key={bannerdata && bannerdata.id ? bannerdata.id : null}
          form={form}
          labelCol={{span: 6}}
          wrapperCol={{span: 24}}
          autoComplete="off"
          initialValues={{
            id: bannerdata && bannerdata.id ? bannerdata.id : null,
            status: bannerdata && bannerdata.status === 0 ? false : true,
            priority:
              bannerdata && bannerdata.position ? bannerdata.position : null,
            title: bannerdata && bannerdata.title ? bannerdata.title : null,
            image: bannerdata && bannerdata.image ? bannerdata.image : null,
          }}
          onFinish={(values) => onFinish(values)}
        >
          <Form.Item
            label="Enable Banner"
            labelCol={{span: 6}}
            wrapperCol={{span: 18}}
            name="status"
            value={bannerdata && bannerdata.status}
          >
            <Radio.Group optionType="button" buttonStyle="solid">
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
            name="priority"
            rules={[
              {
                required: true,
                message: 'Please enter banner position',
              },
            ]}
          >
            <InputNumber
              type="number"
              style={{width: '100%'}}
              min={1}
              defaultValue={bannerdata && bannerdata.position}
              max={100}
              placeholder="Enter banner position"
            />
          </Form.Item>
          <Form.Item label="Schedule Date" name="discountamount">
            <RangePicker
              showTime={{format: 'HH:mm:ss'}}
              format="DD-MM-YYYY HH:mm:ss"
              onChange={onChange}
              onOk={onOk}
              // disabledDate={disabledDate}
              defaultValue={[
                dayjs(bannerdata && bannerdata.from_date).utcOffset('+00:00'),
                dayjs(bannerdata && bannerdata.to_date).utcOffset('+00:00'),
              ]}
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
            <Button type="primary" htmlType="submit" loading={submitLoading}>
              Update
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default EditBannerModal;
