import React, { useState, useEffect } from "react";
//import { CRow } from "@coreui/react";
import TableUi from "./DiscountsTable/discountTable";
import Header from "./Header/Header";
import SelectionBar from './SelectionBar/SelectionBar';
import { Row, Col } from 'antd';
import AddDiscountsModal from "./DiscountsTable/AddDiscountsModal/AddDiscountsModal";

const Discounts = () => {
  const [visible, setVisible] = useState(false);


  const showModal = () => {
    setVisible(true);
  };

  const handleOk = (e) => {
    setVisible(false);
  };

  const handleCancel = (e) => {
    setVisible(false);
  };

  return (
    <>
      <Row>
        <div className="card-body">
          <Header showModal={showModal} />
          <SelectionBar />
          <TableUi />
        </div>
      </Row>
      <AddDiscountsModal
        handleOk={handleOk}
        handleCancel={handleCancel}
        visible={visible}
      />
    </>
  );
};

export default Discounts;
