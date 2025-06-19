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
  Select,
} from 'antd';
import {v4 as uuidv4} from 'uuid';
import Router from 'next/router';
import {PlusOutlined, UploadOutlined, LoadingOutlined} from '@ant-design/icons';
import axios from 'axios';
import {cmsendPoint, envUrl} from '../../../../../../../utils/factory';
import {useSelector, useDispatch} from 'react-redux';

const EditBannerModal = ({visible, handleOk, handleCancel}) => {
  const [form] = Form.useForm();
  const banner = useSelector((status) => status.bannersecondReducer.banner);
  const [imageUrl, setImageURL] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageerror, setImageError] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [imagepath, setImagePath] = useState('');

  form.setFieldsValue({
    id: banner && banner.id ? banner.id : null,
    bannertitle: banner && banner.title ? banner.title : null,
    buttonname: banner && banner.button_name ? banner.button_name : null,
    url: banner && banner.button_url ? banner.button_url : null,
    status: banner && banner.status ? banner.status : null,
    image: banner && banner.url ? banner.url : null,
  });
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    setPreviewImage(banner && banner.url);
    setImagePath(process.env.BANNER_CDN_URL);
  });

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
        id: banner.id ? banner.id : null,
        title: values.bannertitle,
        button_name: values.buttonname,
        button_url: values.url,
        url: imageUrl ? imageUrl : previewImage,
        status: values.status,
      };

      const data = await axios.post(
        `${envUrl.baseUrl}${cmsendPoint.updateThirdBanner}`,
        variables,
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
        }
      );

      handleCancel();
      setSubmitLoading(false);
      Router.push('/manage/home-page?tab=3');
    } catch (error) {
      console.log('error signIn:', error.message);
      handleCancel();
      setSubmitLoading(false);
      Router.push('/manage/home-page?tab=3');
    }
  };

  const saveImage = ({file, onSuccess}) => {
    setLoading(true);
    console.log('e.target.value :', file);
    sendImage(file, onSuccess);
  };
  const sendImage = async (file, onSuccess) => {
    try {
      const formData = new FormData();
      formData.append('bannerSection', 1);
      formData.append('bannerSubSection', 1);
      formData.append('total', 1);
      formData.append('file', file);
      formData.append('prodId', banner.id ? banner.id : null);
      await axios
        .post(`${envUrl.ImageUrl}${cmsendPoint.uplaodBannerImage}`, formData, {
          headers: {
            'x-api-key': process.env.BACKEND_MEDIA_API_KEY,
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'text/json',
          },
        })
        .then((res) => {
          console.log('res:::::::::??????????????', res.data);
          let uploadInfo = res.data.presignedURLs[0];
          // console.log('uploadInfo: ', uploadInfo);
          // await axios.put(uploadInfo.presignedURL, file, {
          //   headers: {
          //     'Access-Control-Allow-Origin': '*',
          //     'Content-Type': file.type,
          //   },
          // });

          console.log('uploadInfo: ', uploadInfo);
          console.log('uploadInfo: ', uploadInfo.imagePath);
          console.log('imageUrl: ', imageUrl);
          setImageURL(uploadInfo.imagePath);
          onSuccess('ok');
          setLoading(false);
        })
        .catch((err) => {
          console.log('error in request', err);
          setLoading(false);
        });
    } catch (error) {
      console.log('error signIn:', error.message);
    }
  };
  // const beforeUpload = (file) => {
  //   const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  //   if (!isJpgOrPng) {
  //     console.log('You can only upload JPG/PNG file!');
  //     // message.error('You can only upload JPG/PNG file!');
  //     //
  //   }

  //   return isJpgOrPng;
  // };
  function beforeUpload(file) {
    const isJpgOrPng =
      file.type === 'image/jpeg' ||
      file.type === 'image/png' ||
      file.type === 'image/gif' ||
      file.type === 'image/webp';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG/GIF/Webp file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 1;
    if (!isLt2M) {
      message.error('Image must smaller than 1MB!');
    }
    return isJpgOrPng && isLt2M;
  }

  // React.useEffect(() => {
  // console.log('res from email :', data && data);
  // if (data) {
  //   alert.show('Program request sent !');
  // }
  // }, [data]);

  return (
    <>
      <Modal
        title="Edit Banner"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          key={banner && banner.id ? banner.id : null}
          form={form}
          layout="vertical"
          initialValues={{
            id: banner && banner.id ? banner.id : null,
            bannertitle: banner && banner.title ? banner.title : null,
            buttonname:
              banner && banner.button_name ? banner.button_name : null,
            url: banner && banner.button_url ? banner.button_url : null,
            status: banner && banner.status ? banner.status : null,
            image: banner && banner.url ? banner.url : null,
          }}
          onFinish={(values) => onFinish(values)}
        >
          <Form.Item label="Banner Title" name="bannertitle" required>
            <Input
              placeholder="Enter Banner Title"
              required
              value={banner && banner.title}
            />
          </Form.Item>
          <Form.Item label="Button Name" name="buttonname" required>
            <Input
              placeholder="Enter Button Name"
              required
              value={banner && banner.button_name}
            />
          </Form.Item>
          <Form.Item label="URL" name="url" required>
            <Input
              placeholder="Enter URL"
              required
              value={banner && banner.button_url}
            />
          </Form.Item>

          <Form.Item
            name="status"
            label="Banner Status"
            rules={[{required: true}]}
          >
            <Select allowClear name="status">
              <Option value="Publish">Publish</Option>
              <Option value="Unpublish">Unpublish</Option>
            </Select>
          </Form.Item>

          <Row>
            <Col span={6}>
              <Upload
                listType="picture-card"
                customRequest={saveImage}
                className="avatar-uploader"
                showUploadList={false}
                beforeUpload={beforeUpload}
                // onRemove={removeImg}
                // onPreview={handlePreview}
              >
                {imageUrl ? (
                  <img
                    src={process.env.BANNER_CDN_URL + imageUrl}
                    alt="banner"
                    style={{maxWidth: '100%', height: '-webkit-fill-available'}}
                  />
                ) : (
                  <div>
                    {loading ? <LoadingOutlined /> : <UploadOutlined />}
                    <div style={{marginTop: 8}}>Upload Image</div>
                  </div>
                )}
              </Upload>
              {imageerror && (
                <div
                  class="invalid-feedback"
                  style={{display: 'block', marginTop: '-5px', height: '100px'}}
                >
                  Required
                </div>
              )}
            </Col>
            <Col span={11}>
              {!imageUrl && (
                <img
                  src={imagepath + previewImage}
                  alt="banner"
                  style={{maxWidth: '100%', maxHeight: '100px'}}
                />
              )}
            </Col>
          </Row>
          <Form.Item>
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
