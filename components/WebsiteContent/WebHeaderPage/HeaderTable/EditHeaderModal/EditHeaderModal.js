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
import Router from 'next/router';
import moment from 'moment-timezone';
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
import {UPDATE_HEADER} from '../../../../../graphql/Mutations/HeaderInfoMutations';
import {useSelector, useDispatch} from 'react-redux';
import InputColor from 'react-input-color';

const {TextArea} = Input;
const EditHeaderModal = ({visible, handleOk, handleCancel}) => {
  const [form] = Form.useForm();
  const [UpateHeader, {data}] = useMutation(UPDATE_HEADER);
  const header = useSelector((status) => status.bannersecondReducer.banner);
  const [imageUrl, setImageURL] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageerror, setImageError] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [imagepath, setImagePath] = useState('');
  const [initial, setInitial] = useState('#5e72e4');
  const [color, setColor] = useState({});
  const [fontcolor, setFontColor] = useState({});
  const [fromdate, setFromdate] = useState();
  const [todate, setTodate] = useState();
  const [countdowndate, setCountdownDate] = useState();
  const [timerfontcolor, setTimerFontColor] = useState({});
  const [removeimage, setRemoveImage] = useState(true);
  const [selecttype, setSelectType] = useState(false);
  const [errorfromdate, setErrorFromdate] = useState(false);
  const [errorcountdowndate, setErrorCountdownDate] = useState(false);

  const {RangePicker} = DatePicker;

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleModal = () => {
    setIsModalVisible(false);
  };

  const handleCancelModal = () => {
    setIsModalVisible(false);
  };

  form.setFieldsValue({
    id: header && header.id ? header.id : null,
    type: header && header.type ? header.type : null,
    title: header && header.title ? header.title : null,
    bg_code: header && header.bg_code ? header.bg_code : null,
    font_color_code:
      header && header.font_color_code ? header.font_color_code : null,
    fromdate: header && header.from_date ? header.from_date : null,
    todate: header && header.to_date ? header.to_date : null,
    countdowndate: header && header.countdowndate ? header.countdowndate : null,
    timer_font_size:
      header && header.timer_font_size ? header.timer_font_size : null,
    timer_font_color:
      header && header.timer_font_color ? header.timer_font_color : null,
    link: header && header.link ? header.link : null,
  });
  const [submitLoading, setSubmitLoading] = useState(false);

  const saveImage = ({file, onSuccess}) => {
    setLoading(true);
    console.log('e.target.value :', file);
    sendImage(file, onSuccess);
  };

  const sendImage = async (file, onSuccess) => {
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
      // .post(
      //   'https://drawqis306.execute-api.ap-southeast-2.amazonaws.com/prd/media/banner/upload',
      //   {
      //     bannerSection: 1,
      //     bannerSubSection: 1,
      //     total: 1,
      //   },
      //   {
      //     headers: {
      //       'x-api-key': 'zf7nKdBlnM4COflXalYsbaGTwnumlt6H99WYrguX', //'lnF9mfXpOn8dytte0qWAu1lGYGVLAKZm1DgntoFN', //'zf7nKdBlnM4COflXalYsbaGTwnumlt6H99WYrguX', //process.env.BACKEND_MEDIA_API_KEY,
      //       'Access-Control-Allow-Origin': '*',
      //       'Content-Type': 'text/json',
      //     },
      //   }
      // )
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
        setImageURL('/' + uploadInfo.imagePath);
        onSuccess('ok');
        setLoading(false);
      })
      .catch((err) => {
        console.log('error in request', err);
        setLoading(false);
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
  React.useEffect(() => {
    // console.log('res from email :', data && data);
    // if (data) {
    //   alert.show('Program request sent !');
    // }
  }, [data]);

  function onChange(value, dateString) {
    console.log('datetime-1: ', value);
    console.log('datetime-2: ', dateString);
    setFromdate(dateString[0]);
    setTodate(dateString[1]);
  }
  function onDateOk(value) {
    console.log('datetime-3: ', value);
  }
  function onChangeDate(value, dateString) {
    console.log('datetime-1: ', value);
    console.log('datetime-2: ', dateString);
    setCountdownDate(dateString);
  }
  const {confirm} = Modal;

  function removeFile() {
    confirm({
      title: 'Do you Want to delete these items?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        setRemoveImage(false);
        setImageURL(null);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  function onOk(value) {
    console.log('datetime-3: ', value);
  }

  const Footer = () => {
    return (
      <Button className="dashboard-addNewProduct" htmlType="submit">
        Submit
      </Button>
    );
  };

  const onFinish = async (values) => {
    setSubmitLoading(true);
    UpateHeader({
      variables: {
        id: header.id ? header.id : null,
        type: values.type,
        from_date: fromdate,
        to_date: todate,
        title: values.title,
        bg_code: color.hex,
        font_color_code: fontcolor.hex,
        countdowndate: countdowndate,
        timer_font_size: values.timer_font_size,
        timer_font_color: timerfontcolor.hex,
        image_url: imageUrl ? imageUrl : removeimage === true ? imageUrl : null,
        link: values.link,
      },
    }).then(function (result) {
      if (result) {
        if (result.data.updateHeaderInfo === 'Success') {
          handleCancel();
          setSubmitLoading(false);

          // Router.reload(window.location.pathname);
        } else {
          //not deleted
        }
      } else {
        //error
      }
      console.log(result);
      Router.push(window.location.pathname);
    });
  };

  function handleChange(value) {
    //console.log('handleChange :::::::::::::::::::::::' + value);
    setSelectType(false);
    if (value === 'countdown') setSelectType(true);
  }
  // useEffect(() => {
  //   if (header && header.type === 'countdown') setSelectType(true);
  // }, [header]);

  return (
    <>
      <Modal
        title="Edit Schedule Header"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          key={header && header.id ? header.id : null}
          form={form}
          layout="vertical"
          initialValues={{
            id: header && header.id ? header.id : null,
            type: header && header.type ? header.type : null,
            title: header && header.title ? header.title : null,
            bg_code: header && header.bg_code ? header.bg_code : null,
            font_color_code:
              header && header.font_color_code ? header.font_color_code : null,
            fromdate: header && header.from_date ? header.from_date : null,
            todate: header && header.to_date ? header.to_date : null,
            countdowndate:
              header && header.countdowndate ? header.countdowndate : null,
            timer_font_size:
              header && header.timer_font_size ? header.timer_font_size : null,
            timer_font_color:
              header && header.timer_font_color
                ? header.timer_font_color
                : null,
            link: header && header.link ? header.link : null,
          }}
          onFinish={(values) => onFinish(values)}
        >
          <Form.Item name="type" label="Type" defaultValue="text">
            <Select
              placeholder="Select a type"
              allowClear
              name="type"
              defaultValue="text"
              onChange={handleChange}
              disabled
            >
              <Option value="text">Text</Option>
              <Option value="countdown">Countdown</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Schedule Date" name="scheduledate" required>
            <RangePicker
              showTime={{format: 'HH:mm:ss'}}
              format="YYYY-MM-DD HH:mm:ss"
              onChange={onChange}
              onOk={onOk}
              className={styles.DatePicker}
              defaultValue={[
                moment(header && header.from_date).utcOffset('+00:00'),
                moment(header && header.to_date).utcOffset('+00:00'),
              ]}
            />
            {errorfromdate && (
              <div
                class="invalid-feedback"
                style={{display: 'block', marginTop: '2px', marginLeft: '3px'}}
              >
                Required
              </div>
            )}
          </Form.Item>

          <Form.Item label="Header Text" name="title" required>
            <TextArea
              placeholder="Please enter header text"
              rows={3}
              required
              value={header && header.title}
            />
          </Form.Item>

          <Row>
            <Col span={11}>
              <Form.Item label="background color" name="bg_code" required>
                <InputColor
                  initialValue={header && header.bg_code}
                  onChange={setColor}
                  placement="right"
                  className={styles.InputColor}
                />
              </Form.Item>
            </Col>
            <Col span={11} offset={2}>
              <Form.Item label="Font color" name="font_color_code" required>
                <InputColor
                  initialValue={header && header.font_color_code}
                  onChange={setFontColor}
                  placement="right"
                  className={styles.InputColor}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="link" label="Link">
            <Input
              placeholder="Please enter link"
              value={header && header.link}
            />
          </Form.Item>
          {selecttype ||
            (header && header.type === 'countdown' && (
              <>
                <Form.Item label="Countdown Date">
                  <DatePicker
                    showTime
                    onChange={onChangeDate}
                    onOk={onDateOk}
                    className={styles.DatePicker}
                    defaultValue={moment(
                      header && header.countdowndate
                    ).utcOffset('+00:00')}
                  />
                  {errorcountdowndate && (
                    <div
                      class="invalid-feedback"
                      style={{
                        display: 'block',
                        marginTop: '2px',
                        marginLeft: '3px',
                      }}
                    >
                      Required
                    </div>
                  )}
                </Form.Item>
                <Row>
                  <Col span={11}>
                    <Form.Item name="timer_font_size" label="Timer Font Size">
                      <Select
                        placeholder="Select a font size"
                        allowClear
                        name="timer_font_size"
                      >
                        <Option value="8px">8px</Option>
                        <Option value="10px">10px</Option>
                        <Option value="12px">12px</Option>
                        <Option value="14px">14px</Option>
                        <Option value="16px">16px</Option>
                        <Option value="18px">18px</Option>
                        <Option value="20px">20px</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={11} offset={2}>
                    <Form.Item
                      label="Timer Font color"
                      name="timer_font_color"
                      required
                    >
                      <InputColor
                        initialValue={header && header.timer_font_color}
                        onChange={setTimerFontColor}
                        placement="right"
                        className={styles.InputColor}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={7}>
                    <Upload
                      listType="picture-card"
                      customRequest={saveImage}
                      className="avatar-uploader"
                      showUploadList={false}
                      beforeUpload={beforeUpload}
                    >
                      <div>
                        {loading ? <LoadingOutlined /> : <UploadOutlined />}
                        <div style={{marginTop: 8}}>Upload Image</div>
                      </div>
                    </Upload>
                  </Col>
                  <Col span={11}>
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
                  </Col>
                </Row>
              </>
            ))}
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

export default EditHeaderModal;
