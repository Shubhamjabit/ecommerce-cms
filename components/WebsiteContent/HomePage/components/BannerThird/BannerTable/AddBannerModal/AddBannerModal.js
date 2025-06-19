import React, {useState} from 'react';
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

const AddBannerModal = ({visible, handleOk, handleCancel}) => {
  const [form] = Form.useForm();
  const [imageUrl, setImageURL] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageerror, setImageError] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [randid, setRandId] = useState(0);

  const Footer = () => {
    return (
      <Button className="dashboard-addNewProduct" htmlType="submit">
        Submit
      </Button>
    );
  };

  // const onFinish = async (values) => {
  //   try {
  //     const discountValues = {
  //       id: values.id,
  //       discount_code: values.discountname,
  //       discount_percentage: values.discountamount,
  //     };

  //     const res = await AddDisBack({
  //       variables: discountValues,
  //     });
  //   } catch (error) {
  //     console.log('error', error);
  //   }
  //   if (result) {
  //     if (result.data.addDiscountCoupons === 'Success') {
  //       handleCancel();
  //     } else {
  //       //not deleted
  //     }
  //   } else {
  //     //error
  //   }
  //   console.log(result);
  // };

  const onFinish = async (values) => {
    if (imageUrl === null) {
      setImageError(true);
    } else {
      setImageError(false);
      setSubmitLoading(true);

      try {
        const variables = {
          id: values.id,
          title: values.bannertitle,
          button_name: values.buttonname,
          button_url: values.url,
          url: imageUrl,
          status: values.status,
        };

        const data = await axios.post(
          `${envUrl.baseUrl}${cmsendPoint.addThirdBanner}`,
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
    }
  };

  const saveImage = ({file, onSuccess}) => {
    setLoading(true);
    console.log('e.target.value :', file);
    sendImage(file, onSuccess);
  };
  const sendImage = async (file, onSuccess) => {
    const rnd = Math.floor(3246786515 + Math.random() * 213248465);

    setRandId(rnd);
    try {
      const formData = new FormData();
      formData.append('bannerSection', 1);
      formData.append('bannerSubSection', 1);
      formData.append('total', 1);
      formData.append('file', file);
      formData.append('prodId', randid);
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
    setImageError(false);
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
        title="Add Banner"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => onFinish(values)}
        >
          <Form.Item label="Banner Title" name="bannertitle" required>
            <Input placeholder="Enter Banner Title" required />
          </Form.Item>
          <Form.Item label="Button Name" name="buttonname" required>
            <Input placeholder="Enter Button Name" required />
          </Form.Item>
          <Form.Item label="URL" name="url" required>
            <Input placeholder="Enter URL" required />
          </Form.Item>
          <Form.Item
            name="status"
            label="Banner Status"
            rules={[{required: true}]}
          >
            <Select
              placeholder="Select a banner status"
              allowClear
              name="status"
            >
              <Option value="Publish">Publish</Option>
              <Option value="Unpublish">Unpublish</Option>
            </Select>
          </Form.Item>
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
                alt="avatar"
                style={{width: '45px'}}
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
              style={{display: 'block', marginTop: '-5px'}}
            >
              Required
            </div>
          )}

          <Form.Item>
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
