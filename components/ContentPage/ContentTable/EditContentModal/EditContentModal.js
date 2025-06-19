import React, {useState, useEffect, useRef} from 'react';
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
  Spin,
  Select,
  DatePicker,
} from 'antd';
import {v4 as uuidv4} from 'uuid';
import Router from 'next/router';
import {useRouter} from 'next/router';
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
import {useSelector, useDispatch} from 'react-redux';
import InputColor from 'react-input-color';
import CKEditor from 'ckeditor4-react';
import dynamic from 'next/dynamic';
import EditContentHeader from '../../Header/EditContentHeader';
import {initContent} from '../../../../store/actions/contentActions';
import {cmsendPoint, envUrl} from '../../../../utils/factory';
import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2,
} from 'react-html-parser';
// const initialContent =`<p>(209) 895-8060</p>`

const {TextArea} = Input;
const EditContentModal = ({visible, handleOk, handleCancel}) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  // const [Upatecontent, {data}] = useMutation(UPDATE_CONTENT_PAGE);
  const content = useSelector((status) => status.contentReducer.content);
  const [EditorContent, SetEditorContent] = useState([]);
  const importJodit = () => import('jodit-react');
  const JoditEditor = dynamic(importJodit, {
    ssr: false,
  });
  const editor = useRef(null);
  const [pagecontent, setPageContent] = useState('');
  const config = {
    readonly: false,
    width: '100%',
    height: 500,
  };
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
    id: content && content.id ? content.id : null,
    page_title: content && content.page_title ? content.page_title : null,
    status: content && content.status == 0 ? false : true,
    page_url: content && content.page_url ? content.page_url : null,
    meta_title: content && content.meta_title ? content.meta_title : null,
    meta_description:
      content && content.meta_description ? content.meta_description : null,
    meta_keyword: content && content.meta_keyword ? content.meta_keyword : null,
    page_content: content && content.bg_code ? content.page_content : null,
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  useEffect(() => {
    setPageContent(content && content.page_content);
  }, [visible]);

  useEffect(() => {
    setPageContent(content && content.page_content);
  }, [content]);

  const onFinish = async (values) => {
    setSubmitLoading(true);
    try {
      const variables = {
        id: content.id ? content.id : null,
        page_title: values.page_title,
        page_url: values.page_url,
        meta_title: values.meta_title,
        meta_description: values.meta_description,
        meta_keyword: values.meta_keyword,
        page_content: pagecontent,
        status: values.status,
      };

      const data = await axios
        .post(`${envUrl.baseUrl}${cmsendPoint.updateContent}`, variables, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
        })
        .then(function (result) {
          if (result) {
            if (result.data.updateContent === 'success') {
              setSubmitLoading(false);
              // Router.push('/manage/manage-content-page');
              // router.replace('/manage/manage-content-page');
              router.back();
            } else {
              //not deleted
            }
          } else {
            //error
          }
        })
        .catch(function (error) {
          // console.log('@@@@@@@@@@@@@@@result-1', error);
        });
    } catch (error) {
      console.log('error signIn:', error.message);
      setSubmitLoading(false);
    }
  };

  const handelchnage = (evt) => {
    var newContent = evt.editor.getData();
    SetEditorContent(newContent);
  };
  useEffect(() => {
    dispatch(initContent());
  }, []);

  return (
    <>
      {content ? (
        <Row>
          <div className="card-body">
            <EditContentHeader />
            <div className={styles.ContentPage}>
              <Col span={24}>
                <Form
                  key={content && content.id ? content.id : null}
                  form={form}
                  labelCol={{span: 3}}
                  wrapperCol={{span: 21}}
                  initialValues={{
                    id: content && content.id ? content.id : null,
                    status: content && content.status == 0 ? false : true,
                    page_title:
                      content && content.page_title ? content.page_title : null,
                    page_url:
                      content && content.page_url ? content.page_url : null,
                    meta_title:
                      content && content.meta_title ? content.meta_title : null,
                    meta_description:
                      content && content.meta_description
                        ? content.meta_description
                        : null,
                    meta_keyword:
                      content && content.meta_keyword
                        ? content.meta_keyword
                        : null,
                    page_content:
                      content && content.bg_code ? content.page_content : null,
                  }}
                  onFinish={(values) => onFinish(values)}
                >
                  <Form.Item
                    label="Enable"
                    labelCol={{span: 3}}
                    wrapperCol={{span: 21}}
                    name="status"
                    value={content && content.status}
                  >
                    <Radio.Group optionType="button" buttonStyle="solid">
                      <Radio.Button value={true}>Yes</Radio.Button>
                      <Radio.Button value={false}>No</Radio.Button>
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item label="Page Name" name="page_title" required>
                    <Input
                      placeholder="Enter Page Name"
                      required
                      value={content && content.page_title}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Page Url"
                    name="page_url"
                    required
                    value={content && content.page_url}
                  >
                    <Input placeholder="Enter Page URL" required />
                  </Form.Item>

                  <Form.Item label="Meta Title" name="meta_title" required>
                    <Input
                      placeholder="Enter Meta Title"
                      required
                      value={content && content.meta_title}
                    />
                  </Form.Item>
                  <Form.Item label="Meta Description" name="meta_description">
                    <Input
                      placeholder="Enter Meta Description"
                      value={content && content.meta_description}
                    />
                  </Form.Item>
                  <Form.Item label="Meta Keyword" name="meta_keyword">
                    <Input
                      placeholder="Enter Meta Keyword"
                      value={content && content.meta_keyword}
                    />
                  </Form.Item>

                  <Form.Item label="Content" name="content" required>
                    <CKEditor
                      data={pagecontent}
                      onChange={handelchnage}
                      style={{display: 'none'}}
                    />
                    <JoditEditor
                      ref={editor}
                      value={pagecontent}
                      config={config}
                      tabIndex={1}
                      onBlur={(newContent) => setPageContent(newContent)}
                      onChange={(newContent) => {}}
                    />
                  </Form.Item>
                  <Form.Item
                    style={{textAlign: 'right', justifyContent: 'flex-end'}}
                  >
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
              </Col>
            </div>
          </div>
        </Row>
      ) : (
        <Spin tip="Please Wait...." size="large" className={styles.Spin}>
          <div className="content" />
        </Spin>
      )}
    </>
  );
};

export default EditContentModal;
