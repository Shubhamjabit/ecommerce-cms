import React, { useState } from "react";
import { Form, Input, Button, Radio } from "antd";

const { TextArea } = Input;

const DescriptionSection = () => {
  return (
    <>
      <div className="row homePage-tableRow-lable">
        <p>Description (60-70 characters max)</p>
      </div>
      <div className="row homePage-tableRow-text">
        <TextArea rows={4} placeholder="Add your text"/>
      </div>
    </>
  );
};

export default DescriptionSection;
