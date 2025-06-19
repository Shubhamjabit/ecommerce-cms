import React, {useState, useEffect} from 'react';
import {Row} from 'antd';
import Header from './Header/Header';
import TableUi from './HeaderTable/HeaderTable';
// import AddBannerModal from './BannerTable/AddBannerModal/AddBannerModal';
import EditHeaderModal from './HeaderTable/EditHeaderModal/EditHeaderModal';
import AddHeaderModal from './HeaderTable/AddBannerModal/AddHeaderModal';

const CategoryPage = () => {
  const [publishVisible, setPublishVisible] = useState(false);
  const [hideVisible, setHideVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);

  const showPublishModal = () => {
    setPublishVisible(true);
  };

  const publishHandleOk = (e) => {
    setPublishVisible(false);
  };

  const publishHandleCancel = (e) => {
    setPublishVisible(false);
  };

  const showHideModal = () => {
    setHideVisible(true);
  };

  const hideHandleOk = (e) => {
    setHideVisible(false);
  };

  const hideHandleCancel = (e) => {
    setHideVisible(false);
  };
  const showDeleteModal = () => {
    setDeleteVisible(true);
  };
  const deleteHandleOk = (e) => {
    setDeleteVisible(false);
  };

  const deleteHandleCancel = (e) => {
    setDeleteVisible(false);
  };
  const showModal = () => {
    setVisible(true);
  };

  const handleOk = (e) => {
    setVisible(false);
  };

  const handleCancel = (e) => {
    setVisible(false);
  };
  const showEditModal = () => {
    setEditVisible(true);
  };
  const editHandleOk = (e) => {
    setEditVisible(false);
  };

  const editHandleCancel = (e) => {
    setEditVisible(false);
  };
  return (
    <>
      <Row>
        <div className="card-body">
          <Header showModal={showModal} />
          <TableUi pageSize={10} showModal4={showEditModal} />
          <AddHeaderModal
            handleOk={handleOk}
            handleCancel={handleCancel}
            visible={visible}
          />
          <EditHeaderModal
            handleOk={editHandleOk}
            handleCancel={editHandleCancel}
            visible={editVisible}
          />
        </div>
      </Row>
    </>
  );
};

export default CategoryPage;
