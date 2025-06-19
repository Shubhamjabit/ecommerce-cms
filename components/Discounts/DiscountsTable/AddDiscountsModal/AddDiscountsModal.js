import React, { useState } from "react";
import { Form, Input, Button, Radio, Modal, Row,Col } from "antd";
//import { CRow } from "@coreui/react";
import ImagePicker from "./ImagePicker";
import AddRelatedProducts from "./AddRelatedProducts";
import RelatedProductsTable from "./RelatedProductTable";

const AddDiscountsModal = ({ visible, handleOk, handleCancel }) => {
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
        title="Add Discount"
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
          <Form.Item label="Discount Name" required>
            <Input placeholder="Enter Discount Name" />
          </Form.Item>
          <Row>
            <Col span ={11}>
          <Form.Item label="Choose Precentage">
            <Input placeholder="Add precentage amount" />
          </Form.Item>
          </Col>
          <Col span ={11} offset={2}>
          <Form.Item label="Expire Date">
            <Input type= "date" placeholder="Select Date" />
          </Form.Item>
          </Col>
          </Row>
         
          <Form.Item>
            <AddRelatedProducts />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddDiscountsModal;
