import React, { useState } from "react";
import { Form, Input, Button, Radio, Modal } from "antd";
import { CRow } from "@coreui/react";
import ImagePicker from "./ImagePicker";
import AddRelatedProducts from "./AddRelatedProducts";

const EditProductModal = ({ visible, handleOk, handleCancel }) => {
  const [form] = Form.useForm();
  const [requiredMark, setRequiredMarkType] = useState("optional" > "optional");

  const onRequiredTypeChange = ({ requiredMark }) => {
    setRequiredMarkType(requiredMark);
  };

  const Footer = () => {
    return <Button className="dashboard-addNewProduct">Submit</Button>;
  };

  return (
    <>
      <Modal
        title="Edit Product"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={<Footer />}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ requiredMark }}
          onValuesChange={onRequiredTypeChange}
          requiredMark={requiredMark}
        >
          <Form.Item label="Product ID" required>
            <Input placeholder="producrt id" />
          </Form.Item>

          <Form.Item label="Product name">
            <Input placeholder="product name" />
          </Form.Item>

          <Form.Item label="Images">
            <ImagePicker />
          </Form.Item>

          <Form.Item label="View at Home (URL)">
            <Input placeholder="View at Home (URL)" />
          </Form.Item>

          <Form.Item label="Product Descriptions">
            <Input.TextArea rows={4} placeholder="Product Descriptions" />
          </Form.Item>

          <Form.Item>
            <AddRelatedProducts />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default EditProductModal;
