import React, { useState } from "react";
import { Form, Input, Button, Radio } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
const { TextArea } = Input;

const UrlSection = () => {
  return (
    <>
      <div className="row homePage-tableRow-lable">
        <p>URL</p>
      </div>
      <div className="row">
        <div className="col-8">
          <Input placeholder="Add your text" />
        </div>
        <div className="col-4">
          <Button icon={<DeleteOutlined />}></Button>
        </div>
      </div>
    </>
  );
};

export default UrlSection;
