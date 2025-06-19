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
  Select,
  DatePicker,
} from 'antd';
import Router from 'next/router';
import styles from './styles.module.scss';
import AddContentHeader from '../Header/AddContentHeader';
// import CKEditor from 'ckeditor4-react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import {cmsendPoint, envUrl} from '../../../utils/factory';
import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2,
} from 'react-html-parser';
const {TextArea} = Input;
const AddContentPage = () => {
  const [form] = Form.useForm();
  //const [AddContent, {data}] = useMutation(ADD_CONTENT);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [EditorContent, SetEditorContent] = useState([]);
  const [valueed, setValueED] = useState(true);
  const importJodit = () => import('jodit-react');

  const JoditEditor = dynamic(importJodit, {
    ssr: false,
  });
  const config = {
    readonly: false,
    width: '100%',
    height: 500,
  };
  const editor = useRef(null);
  const [content, setContent] = useState('');

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
        id: values.id,
        status: valueed,
        page_title: values.pagetitle,
        page_url: values.pageurl,
        meta_title: values.metatitle,
        meta_description: values.metadescription,
        meta_keyword: values.metakeyword,
        page_content: content,
      };

      const data = await axios
        .post(`${envUrl.baseUrl}${cmsendPoint.addContentData}`, variables, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
        })
        .then(function (result) {
          if (result) {
            if (result.data.saveContent === 'success') {
              setSubmitLoading(false);
              Router.push('/manage/manage-content-page');
            } else {
              //not deleted
            }
          } else {
            //error
          }
        })
        .catch(function (error) {
          console.log('@@@@@@@@@@@@@@@result-1', error);
        });
    } catch (error) {
      console.log('error signIn:', error.message);
      setSubmitLoading(false);
    }
  };
  function onChangeED(e) {
    console.log('radio checked', e.target.value);
    setValueED(e.target.value);
  }
  // const handelchnage = (evt) => {
  //   var newContent = evt.editor.getData();
  //   SetEditorContent(newContent);
  // };
  // console.log('EditorContent ::::::::::::::::' + content);

  return (
    <>
      <Row>
        <div className="card-body">
          <AddContentHeader />
          <div className={styles.ContentPage}>
            <Col span={24}>
              <Form
                labelCol={{span: 3}}
                wrapperCol={{span: 21}}
                autoComplete="off"
                form={form}
                onFinish={(values) => onFinish(values)}
              >
                <Form.Item label="Enable" name="a">
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
                <Form.Item label="Page Name" name="pagetitle" required>
                  <Input placeholder="Enter Page Name" required />
                </Form.Item>
                <Form.Item label="Page URL" name="pageurl" required>
                  <Input placeholder="Enter Page URL" required />
                </Form.Item>
                <Form.Item label="Meta Title" name="metatitle" required>
                  <Input placeholder="Enter Meta Title" required />
                </Form.Item>
                <Form.Item label="Meta Description" name="metadescription">
                  <Input placeholder="Enter Meta Description" />
                </Form.Item>
                <Form.Item label="Meta Keyword" name="metakeyword">
                  <Input placeholder="Enter Meta Keyword" />
                </Form.Item>

                <Form.Item label="Content" name="content" required>
                  {/* <CKEditor
                    data=""
                    onChange={handelchnage}
                    onFinish={handelchnage}
                  />  */}
                  <JoditEditor
                    value={content}
                    config={config}
                    onBlur={(newContent) => setContent(newContent)}
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
                    Save
                  </Button>
                </Form.Item>
              </Form>
            </Col>
          </div>
        </div>
      </Row>
    </>
  );
};

export default AddContentPage;
