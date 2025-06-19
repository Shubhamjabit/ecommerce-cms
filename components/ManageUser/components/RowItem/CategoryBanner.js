import React, { useState, useCallback, useRef } from "react";
import { Form, Button, Row, Col, Table, Upload, message } from "antd";
import { InboxOutlined } from '@ant-design/icons';
import ImagePickerSection from './ImagePickerSection';
import PublishStatus from "./PublishStatus";
import DescriptionSection from './DescriptionSection';
import CategorySection from './CategorySection';
import DragIcon from "./DragIcon";
import styles from '../../styles.module.scss';
import URLSection from "./URLSection";
// import { UPDATE_HOME_BANNER } from '../../../graphql/Mutations/Banner';

const { Dragger } = Upload;
const { Column, ColumnGroup } = Table;

const props = {
  name: 'file',
  multiple: true,
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  onChange(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

const CategoryBanner = (section, subSection) => {
  const [data, setData] = useState([
    {
      key: "1",
      image: <ImagePickerSection />,
      category: <CategorySection />,
      description: <DescriptionSection />,
      url: <URLSection/>,
      dragIcon: <DragIcon />
    },
  ]);

  return (
    <Row>
      <Col span={14} >
        <ImagePickerSection bannerSection={section} bannerSubSection={subSection} />
      </Col>
      <Col span={10} >

        <Form
          name="basic"
          initialValues={{ remember: true }}
        // onFinish={onFinish}
        // onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="URL"
            name="url"
          >
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
          >
            <PublishStatus />
          </Form.Item>

          <Form.Item>
            <Button className={styles.submitButton} type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
        <CategorySection />
        <DescriptionSection />
        <DragIcon /> 
      </Col>
    </Row >
  )
};

export default CategoryBanner;
