import React, { useState } from "react";
import { Form, Input, Button, Radio } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
const { TextArea } = Input;

const URLSection = () => {
  return (
    <>
      <Input placeholder="Add URL" />
      <Button icon={<DeleteOutlined />}></Button>
    </>
  );
};

export default URLSection;
