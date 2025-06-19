import React, {useState, useEffect} from 'react';
import {Row} from 'antd';
import Header from './Header/Header';
import TableUi from './BannerTable/BannerTable';
import EditBannerModal from './BannerTable/EditBannerModal/EditBannerModal';
import AddBannerModal from './BannerTable/AddBannerModal/AddBannerModal';
import axios from 'axios';
const CategoryPage = () => {
  const [visible, setVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [editbannerflag, setEditBannerflag] = useState(false);
  const [addbannerflag, setAddBannerflag] = useState(false);

  const showModal = () => {
    setVisible(true);
    setAddBannerflag(false);
  };

  const handleOk = (e) => {
    setVisible(false);
  };

  const handleCancel = (e) => {
    setVisible(false);
  };
  const showEditModal = () => {
    setEditVisible(true);
    setEditBannerflag(false);
  };
  const editHandleOk = (e) => {
    setEditVisible(false);
  };

  const editHandleCancel = (e) => {
    setEditVisible(false);
  };

  const EditBannerflag = (e) => {
    setEditBannerflag(true);
  };
  const AddBannerflag = (e) => {
    setAddBannerflag(true);
  };

  return (
    <>
      <Row>
        <div className="card-body">
          <Header showModal={showModal} />
          <TableUi
            pageSize={10}
            showModal4={showEditModal}
            editbannerflag={editbannerflag}
            addbannerflag={addbannerflag}
          />
          {/* <AddBannerModal
            handleOk={handleOk}
            handleCancel={handleCancel}
            visible={visible}
          /> */}
          <EditBannerModal
            handleOk={editHandleOk}
            handleCancel={editHandleCancel}
            visible={editVisible}
            EditBannerflag={EditBannerflag}
          />
          <AddBannerModal
            handleOk={handleOk}
            handleCancel={handleCancel}
            visible={visible}
            AddBannerflag={AddBannerflag}
          />
        </div>
      </Row>
    </>
  );
};

export default CategoryPage;
