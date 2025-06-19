import React, { Component } from "react";
import { CRow, CCardHeader, CCol } from "@coreui/react";
import { Button, Tooltip } from "antd";
const ActionButton = () => {
  return (
    <CRow className="dashboard-productTable-action">
      <Button className="dashboard-productTable-action-button-edit">Edit</Button>
      <Button className="dashboard-productTable-action-button-remove">Remove</Button>
    </CRow>
  );
};

export default ActionButton;
