import React, { useState } from "react";
import { Form, Input, Button, Radio } from "antd";

const PublishStatus = () => {
  return (
    <>
      <Radio.Group name="radiogroup" defaultValue={true}>

        <Radio value={true}>Publish</Radio>
        <Radio value={false}>Unpublish</Radio>

      </Radio.Group>
    </>
  );
};

export default PublishStatus;
