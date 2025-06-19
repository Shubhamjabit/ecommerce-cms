import React, {useState, useEffect} from 'react';
import {Row} from 'antd';
import Header from './Header/Header';
import TableUi from './ManageStockTable/managestockTable';
import DataModal from './ManageStockTable/DataModal/DataModal';
import {cmsendPoint, envUrl} from '../../utils/factory';
import axios from 'axios';
const ManageStock = () => {
  const [visible, setVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [categories, setCategories] = useState(null);
  const [editcategoryflag, setEditcategoryflag] = useState(false);
  const [addcategoryflag, setAddcategoryflag] = useState(false);
  const [stockdata, setStockData] = useState(null);

  // useEffect(() => {
  //   if (data) {
  //     setCategories(data.getCategoryMenuHierachyCMS);
  //   }
  // }, [data]);
  const showModal = (data) => {
    setVisible(true);
    setStockData(data);
    setAddcategoryflag(false);
  };

  const handleOk = (e) => {
    setStockData(null);
    setVisible(false);
  };

  const handleCancel = (e) => {
    setStockData(null);
    setVisible(false);
  };
  const showEditModal = () => {
    setEditVisible(true);
    setEditcategoryflag(false);
  };
  const editHandleOk = (e) => {
    setEditVisible(false);
  };

  const editHandleCancel = (e) => {
    setEditVisible(false);
  };

  const Editcategoryflag = (e) => {
    setEditcategoryflag(true);
  };
  const Addcategoryflag = (e) => {
    setAddcategoryflag(true);
  };

  return (
    <>
      <Row>
        <div className="card-body">
          <Header showModal={showModal} />
          <TableUi
            pageSize={10}
            showModal4={showEditModal}
            editcategoryflag={editcategoryflag}
            addcategoryflag={addcategoryflag}
          />
          <DataModal
            stockdata={stockdata}
            handleOk={handleOk}
            handleCancel={handleCancel}
            visible={visible}
            Addcategoryflag={Addcategoryflag}
          />
        </div>
      </Row>
    </>
  );
};

export default ManageStock;
