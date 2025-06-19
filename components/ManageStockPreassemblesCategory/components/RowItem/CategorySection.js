import React, { useState } from "react";
import { Form, Input, Button, Radio } from "antd";
//import { CInputGroup } from "@coreui/react";
import styles from '../../styles.module.scss';

const CategorySection = () => {
  const [form] = Form.useForm();

  return (
    <>
      <div className="row homePage-tableRow-lable">
        <p>Main Headline (20-25 characters max)</p>
      </div>
      <div className="row homePage-tableRow-text">
        <Input placeholder="Add your text" />
      </div>
      <div className="row homePage-tableRow-lable">
        <p>Sub Headline (30-35 characters max)</p>
      </div>
      <div className="row homePage-tableRow-text">
        <Input placeholder="Add your text" />
      </div>
    </>
  );
};

export default CategorySection;
