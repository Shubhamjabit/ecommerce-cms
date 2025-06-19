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
} from 'antd';
import {v4 as uuidv4} from 'uuid';
import moment from 'moment';
import Router from 'next/router';
import {
  PlusOutlined,
  UploadOutlined,
  LoadingOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import {cmsendPoint, envUrl} from '../../../../../../../utils/factory';

import styles from './styles.module.scss';

const AddBannerModal = ({visible, handleOk, handleCancel}) => {
  const [form] = Form.useForm();
  const [imageUrl, setImageURL] = useState(null);
  const [mobileimageUrl, setMobileImageURL] = useState(null);
  const [tabimageUrl, setTabImageURL] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mobileloading, setMobileLoading] = useState(false);
  const [tabloading, setTabLoading] = useState(false);
  const [imageerror, setImageError] = useState(false);
  const [mobileimageerror, setMobileImageError] = useState(false);
  const [tabimageerror, setTabImageError] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [fromdate, setFromdate] = useState();
  const [todate, setTodate] = useState();
  const [format, setFormat] = useState();
  const [mobileformat, setMobileFormat] = useState();
  const [tabformat, setTabFormat] = useState();
  const [randid, setRandId] = useState(0);

  const {RangePicker} = DatePicker;
  const Footer = () => {
    return (
      <Button className="dashboard-addNewProduct" htmlType="submit">
        Submit
      </Button>
    );
  };

  // var date = new Date("2016-01-04 10:34:23");
  // console.log('fromdate-new' + date);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isTabModalVisible, setIsTabModalVisible] = useState(false);
  const [isMobileModalVisible, setIsMobileModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleModal = () => {
    setIsModalVisible(false);
  };

  const handleCancelModal = () => {
    setIsModalVisible(false);
  };

  const showTabModal = () => {
    setIsTabModalVisible(true);
  };

  const handleTabModal = () => {
    setIsTabModalVisible(false);
  };

  const handleCancelTabModal = () => {
    setIsTabModalVisible(false);
  };

  const showMobileModal = () => {
    setIsMobileModalVisible(true);
  };

  const handleMobileModal = () => {
    setIsMobileModalVisible(false);
  };

  const handleCancelMobileModal = () => {
    setIsMobileModalVisible(false);
  };
  // console.log('fromdate' + fromdate);
  // console.log('todate' + todate);
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

  // const dateFormat = 'DD-MM-YYYY HH:mm:ss';

  // function onChange(value, dateString) {
  //   console.log('datetime-1: ', value);
  //   console.log('datetime-2: ', dateString);
  // }

  // function onOk(value) {
  //   console.log('datetime-3: ', value);
  // }

  // function disabledDate(current) {
  //   // Can not select days before today and today
  //   return current && current < moment().endOf('day');
  // }

  function onChange(value, dateString) {
    console.log('datetime-1: ', value);
    console.log('datetime-2: ', dateString);
    setFromdate(dateString[0]);
    setTodate(dateString[1]);
  }

  useEffect(() => {
    console.log('fromdate-new' + fromdate);
    let datenew = new Date();
    console.log(datenew);
    console.log(moment(fromdate).format('YYYY-MM-DD HH:mm:ss'));
    // console.log('fromdate-new2' + format(new Date(fromdate), 'yyyy/MM/dd kk:mm:ss'))
    //   console.log(dateFormat(fromdate ,"yyyy-MM-dd"));

    console.log('todate' + todate);
  }, [fromdate, todate, imageUrl]);

  function onOk(value) {
    console.log('datetime-3: ', value);
  }

  const onFinish = async (values) => {
    if (imageUrl === null) {
      setImageError(true);
      setTabImageError(true);
      setMobileImageError(true);
    } else {
      setImageError(false);
      setTabImageError(false);
      setMobileImageError(false);
      setSubmitLoading(true);
      // AddBanner({
      //   variables: {
      //     id: values.id,
      //     title: values.bannertitle,
      //     banner_type: values.bannertype,
      //     button_url: values.url,
      //     url: imageUrl,
      //     mobile_url: mobileimageUrl,
      //     tab_url: tabimageUrl,
      //     status: values.status,
      //     from_date: fromdate,
      //     to_date: todate,
      //     slider_time: values.slider_time,
      //     position: values.position,
      //   },
      // }).then(function (result) {
      //   if (result) {
      //     if (result.data.addBannerMain === 'Success') {
      //       handleCancel();
      //       setSubmitLoading(false);
      //     } else {
      //       //not deleted
      //     }
      //   } else {
      //     //error
      //   }
      //   console.log(result);
      //   setSubmitLoading(false);
      //   Router.push('/manage/home-page?tab=1');
      // });
      try {
        const variables = {
          id: randid,
          title: values.bannertitle,
          banner_type: values.bannertype,
          button_url: values.url,
          url: imageUrl,
          mobile_url: mobileimageUrl,
          tab_url: tabimageUrl,
          status: values.status,
          from_date: fromdate,
          to_date: todate,
          slider_time: values.slider_time,
          position: values.position,
        };

        const data = await axios.post(
          `${envUrl.baseUrl}${cmsendPoint.addMainBanner}`,
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
        Router.push('/manage/home-page?tab=1');
      } catch (error) {
        console.log('error signIn:', error.message);
        handleCancel();
        setSubmitLoading(false);
        Router.push('/manage/home-page?tab=1');
      }
    }
  };
  console.log('imageUrl' + imageUrl);

  const saveImage = ({file, onSuccess}) => {
    setLoading(true);
    console.log('e.target.value :', file.type);
    setFormat(file.type);
    sendImage(file, onSuccess);
  };

  const saveMobileImage = ({file, onSuccess}) => {
    setMobileLoading(true);
    console.log('e.target.value :', file.type);
    setMobileFormat(file.type);
    sendMobileImage(file, onSuccess);
  };

  const saveTabImage = ({file, onSuccess}) => {
    setTabLoading(true);
    console.log('e.target.value :', file.type);
    setTabFormat(file.type);
    sendTabImage(file, onSuccess);
  };

  console.log('e.target.value :', format);
  const sendImage = async (file, onSuccess) => {
    // await axios
    //   .post(
    //     process.env.BANNER_MEDIA_UPLOAD,
    //     {
    //       bannerSection: 1,
    //       bannerSubSection: 1,
    //       total: 1,
    //     },
    //     {
    //       headers: {
    //         'x-api-key': process.env.BACKEND_MEDIA_API_KEY,
    //         'Access-Control-Allow-Origin': '*',
    //         'Content-Type': 'text/json',
    //       },
    //     }
    //   )
    //   .then(async (res) => {
    //     let uploadInfo = res.data.presignedURLs[0];
    //     console.log('uploadInfo: ', uploadInfo);
    //     await axios.put(uploadInfo.presignedURL, file, {
    //       headers: {
    //         'Access-Control-Allow-Origin': '*',
    //         'Content-Type': file.type,
    //       },
    //     });

    //     console.log('uploadInfo: ', uploadInfo);
    //     console.log('uploadInfo: ', uploadInfo.imagePath);
    //     console.log('imageUrl: ', imageUrl);
    //     setImageURL('/' + uploadInfo.imagePath);
    //     onSuccess('ok');
    //     setLoading(false);
    //   })
    //   .catch((err) => {
    //     console.log('error in request', err);
    //     setLoading(false);
    //   });
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

  const sendMobileImage = async (file, onSuccess) => {
    await axios

      .post(
        process.env.BANNER_MEDIA_UPLOAD,
        {
          bannerSection: 1,
          bannerSubSection: 1,
          total: 1,
        },
        {
          headers: {
            'x-api-key': process.env.BACKEND_MEDIA_API_KEY,
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'text/json',
          },
        }
      )
      .then(async (res) => {
        let uploadInfo = res.data.presignedURLs[0];
        console.log('uploadInfo: ', uploadInfo);
        await axios.put(uploadInfo.presignedURL, file, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': file.type,
          },
        });

        console.log('uploadInfo: ', uploadInfo);
        console.log('uploadInfo: ', uploadInfo.imagePath);
        console.log('imageUrl: ', imageUrl);
        setMobileImageURL('/' + uploadInfo.imagePath);
        onSuccess('ok');
        setMobileLoading(false);
      })
      .catch((err) => {
        console.log('error in request', err);
        setMobileLoading(false);
      });
  };

  const sendTabImage = async (file, onSuccess) => {
    await axios
      .post(
        process.env.BANNER_MEDIA_UPLOAD,
        {
          bannerSection: 1,
          bannerSubSection: 1,
          total: 1,
        },
        {
          headers: {
            'x-api-key': process.env.BACKEND_MEDIA_API_KEY,
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'text/json',
          },
        }
      )
      .then(async (res) => {
        let uploadInfo = res.data.presignedURLs[0];
        console.log('uploadInfo: ', uploadInfo);
        await axios.put(uploadInfo.presignedURL, file, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': file.type,
          },
        });

        console.log('uploadInfo: ', uploadInfo);
        console.log('uploadInfo: ', uploadInfo.imagePath);
        console.log('imageUrl: ', imageUrl);
        setTabImageURL('/' + uploadInfo.imagePath);
        onSuccess('ok');
        setTabLoading(false);
      })
      .catch((err) => {
        console.log('error in request', err);
        setTabLoading(false);
      });
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
      file.type === 'video/mp4' ||
      file.type === 'image/webp';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG/GIF/MP4/Webp file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 10;
    if (!isLt2M) {
      message.error('Image must smaller than 10MB!');
    }
    setImageError(false);
    setTabImageError(false);
    setMobileImageError(false);
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
          <Form.Item label="URL" name="url" required>
            <Input placeholder="Enter URL" required />
          </Form.Item>

          <Form.Item
            name="slider_time"
            label="Slider Timer"
            rules={[{required: true, message: 'Please select slider time'}]}
          >
            <Select
              placeholder="Select a slider time"
              allowClear
              //name="type"
              //defaultValue="text"
            >
              <Option value="10000">10 Second</Option>
              <Option value="20000">20 Second</Option>
              <Option value="30000">30 Second</Option>
              <Option value="40000">40 Second</Option>
              <Option value="50000">50 Second</Option>
              <Option value="60000">60 Second</Option>
              <Option value="70000">70 Second</Option>
              <Option value="80000">80 Second</Option>
              <Option value="90000">90 Second</Option>
              <Option value="100000">100 Second</Option>
            </Select>
          </Form.Item>

          <Form.Item name="position" label="Position" required>
            <Select allowClear name="position">
              <Option value="1">1</Option>
              <Option value="2">2</Option>
              <Option value="3">3</Option>
              <Option value="4">4</Option>
              <Option value="5">5</Option>
              <Option value="6">6</Option>
              <Option value="7">7</Option>
              <Option value="8">8</Option>
              <Option value="9">9</Option>
              <Option value="10">10</Option>
            </Select>
          </Form.Item>

          <Row>
            <Col span={11}>
              <Form.Item
                name="bannertype"
                label="Banner Type"
                rules={[{required: true}]}
              >
                <Select
                  placeholder="Select a banner type"
                  allowClear
                  name="bannertype"
                >
                  <Option value="image">Image</Option>
                  <Option value="video">Video</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={11} offset={2}>
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
            </Col>
          </Row>
          <Form.Item label="Schedule Date" name="discountamount" required>
            <RangePicker
              showTime={{format: 'HH:mm:ss'}}
              format="YYYY-MM-DD HH:mm:ss"
              onChange={onChange}
              onOk={onOk}
              // disabledDate={disabledDate}
            />
          </Form.Item>

          <Row>
            <Col span={7}>
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
                  <div style={{marginTop: 8}}>Upload Web Banner Image</div>
                </div>
              </Upload>
            </Col>
            <Col span={11}>
              {imageUrl && (
                <div className={styles.UploadFile}>
                  <div className={styles.FileView}>
                    {format === 'video/mp4' && (
                      <div className={styles.videoIcon} onClick={showModal}>
                        <PlayCircleOutlined />
                      </div>
                    )}

                    {(format === 'image/jpeg' ||
                      format === 'image/gif' ||
                      format === 'image/png') && (
                      <Image
                        width={100}
                        alt={process.env.BANNER_CDN_URL + imageUrl}
                        src={process.env.BANNER_CDN_URL + imageUrl}
                      />
                    )}
                  </div>
                </div>
              )}
              <Modal
                footer={null}
                centered
                width={1000}
                title="Video Modal"
                visible={isModalVisible}
                onOk={handleModal}
                onCancel={handleCancelModal}
              >
                <video
                  className={styles.videoTag}
                  autoPlay
                  loop
                  muted
                  style={{maxWidth: '100%'}}
                >
                  <source
                    src={process.env.BANNER_CDN_URL + imageUrl}
                    type="video/mp4"
                  />
                </video>
              </Modal>
            </Col>
            {imageerror && (
              <Col span={24}>
                <div
                  class="invalid-feedback"
                  style={{display: 'block', marginTop: '-5px'}}
                >
                  Required
                </div>
              </Col>
            )}
          </Row>
          {/* <Row>
            <Col span={7}>
              <Upload
                listType="picture-card"
                customRequest={saveTabImage}
                className="avatar-uploader"
                showUploadList={false}
                beforeUpload={beforeUpload}
                // onRemove={removeImg}
                // onPreview={handlePreview}
              >
                <div>
                  {tabloading ? <LoadingOutlined /> : <UploadOutlined />}
                  <div style={{marginTop: 8}}>Upload Tab Banner Image</div>
                </div>
              </Upload>
            </Col>
            <Col span={11}>
              {tabimageUrl && (
                <div className={styles.UploadFile}>
                  <div className={styles.FileView}>
                    {tabformat === 'video/mp4' && (
                      <div className={styles.videoIcon} onClick={showTabModal}>
                        <PlayCircleOutlined />
                      </div>
                    )}

                    {(tabformat === 'image/jpeg' ||
                      tabformat === 'image/gif' ||
                      tabformat === 'image/png') && (
                      <Image
                        width={100}
                        alt={process.env.BANNER_CDN_URL + tabimageUrl}
                        src={process.env.BANNER_CDN_URL + tabimageUrl}
                      />
                    )}
                  </div>
                </div>
              )}
              <Modal
                footer={null}
                centered
                width={1000}
                title="Video Modal"
                visible={isTabModalVisible}
                onOk={handleTabModal}
                onCancel={handleCancelTabModal}
              >
                <video
                  className={styles.videoTag}
                  autoPlay
                  loop
                  muted
                  style={{maxWidth: '100%'}}
                >
                  <source
                    src={process.env.BANNER_CDN_URL + tabimageUrl}
                    type="video/mp4"
                  />
                </video>
              </Modal>
            </Col>
            {tabimageerror && (
              <Col span={24}>
                <div
                  class="invalid-feedback"
                  style={{display: 'block', marginTop: '-5px'}}
                >
                  Required
                </div>
              </Col>
            )}
          </Row>
           <Row>
            <Col span={7}>
              <Upload
                listType="picture-card"
                customRequest={saveMobileImage}
                className="avatar-uploader"
                showUploadList={false}
                beforeUpload={beforeUpload}
                // onRemove={removeImg}
                // onPreview={handlePreview}
              >
                <div>
                  {mobileloading ? <LoadingOutlined /> : <UploadOutlined />}
                  <div style={{marginTop: 8}}>Upload Mobile Banner Image</div>
                </div>
              </Upload>
            </Col>
            <Col span={11}>
              {mobileimageUrl && (
                <div className={styles.UploadFile}>
                  <div className={styles.FileView}>
                    {mobileformat === 'video/mp4' && (
                      <div
                        className={styles.videoIcon}
                        onClick={showMobileModal}
                      >
                        <PlayCircleOutlined />
                      </div>
                    )}

                    {(mobileformat === 'image/jpeg' ||
                      mobileformat === 'image/gif' ||
                      mobileformat === 'image/png') && (
                      <Image
                        width={100}
                        alt={process.env.BANNER_CDN_URL + mobileimageUrl}
                        src={process.env.BANNER_CDN_URL + mobileimageUrl}
                      />
                    )}
                  </div>
                </div>
              )}
              <Modal
                footer={null}
                centered
                width={1000}
                title="Video Modal"
                visible={isMobileModalVisible}
                onOk={handleMobileModal}
                onCancel={handleCancelMobileModal}
              >
                <video
                  className={styles.videoTag}
                  autoPlay
                  loop
                  muted
                  style={{maxWidth: '100%'}}
                >
                  <source
                    src={process.env.BANNER_CDN_URL + mobileimageUrl}
                    type="video/mp4"
                  />
                </video>
              </Modal>
            </Col>
            {mobileimageerror && (
              <Col span={24}>
                <div
                  class="invalid-feedback"
                  style={{display: 'block', marginTop: '-5px'}}
                >
                  Required
                </div>
              </Col>
            )}
          </Row> */}

          {/* <Upload
            listType="picture-card"
            customRequest={saveImage}
            className="avatar-uploader"
            showUploadList={true}
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
          </Upload> */}

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
