import React, {useState, useEffect} from 'react';
import {Row} from 'antd';
import Header from './Header/Header';
import TableUi from './ManageUserTable/manageuserTable';
import PublishPopup from './ManageUserTable/PublishOrHidePopup/PublishPopup';
import HidePopup from './ManageUserTable/PublishOrHidePopup/HidePopup';
import {cmsendPoint, envUrl} from '../../utils/factory';
import axios from 'axios';
import AddCmsUserModal from './ManageUserTable/AddCmsUserModal/AddCmsUserModal';
import DeletePopup from './ManageUserTable/components/DeletePopup';

const ManageCmsUser = () => {
  const [publishVisible, setPublishVisible] = useState(false);
  const [hideVisible, setHideVisible] = useState(false);
  const [inactiveflag, setInactiveFlag] = useState(false);
  const [activeflag, setAvtiveFlag] = useState(false);
  const [visible, setVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [categories, setCategories] = useState(null);
  const [editcategoryflag, setEditcategoryflag] = useState(false);
  const [addcategoryflag, setAddcategoryflag] = useState(false);
  const [deletebannerflag, setDeleteBannerflag] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [rs, setRs] = useState(0);

  const showPublishModal = () => {
    setPublishVisible(true);
  };

  const publishHandleOk = (e) => {
    setPublishVisible(false);
  };

  const publishHandleCancel = (e) => {
    setPublishVisible(false);
    setAvtiveFlag(false);
  };

  const showHideModal = () => {
    setHideVisible(true);
  };

  const hideHandleOk = (e) => {
    setHideVisible(false);
  };

  const hideHandleCancel = (e) => {
    setHideVisible(false);
    setInactiveFlag(false);
  };

  const handleInactive = (e) => {
    setInactiveFlag(true);
  };

  const handleActive = (e) => {
    setAvtiveFlag(true);
  };

  const showModal = () => {
    setVisible(true);
    setAddcategoryflag(false);
  };

  const handleOk = (e) => {
    setVisible(false);
  };

  const handleCancel = (e) => {
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
  const showDeleteModal = () => {
    setDeleteVisible(true);
  };
  const deleteHandleOk = (e) => {
    setDeleteVisible(false);
  };

  const deleteHandleCancel = (e) => {
    setDeleteVisible(false);
    setDeleteBannerflag(false);
  };
  const DeleteBannerflag = (e) => {
    setDeleteBannerflag(true);
  };

  return (
    <>
      <Row>
        <div className="card-body">
          <Header showModal={showModal} />
          <TableUi
            pageSize={10}
            showModal1={showPublishModal}
            showModal2={showHideModal}
            showDeleteModal={showDeleteModal}
            inactiveflag={inactiveflag}
            activeflag={activeflag}
            rs={rs}
            setRs={setRs}
          />
          <AddCmsUserModal
            handleOk={handleOk}
            handleCancel={handleCancel}
            visible={visible}
            setVisible={setVisible}
            categories={categories}
            Addcategoryflag={Addcategoryflag}
            rs={rs}
            setRs={setRs}
          />
          <PublishPopup
            handleOk={publishHandleOk}
            handleCancel={publishHandleCancel}
            visible={publishVisible}
            handleActive={handleActive}
          />
          <HidePopup
            handleOk={hideHandleOk}
            handleCancel={hideHandleCancel}
            visible={hideVisible}
            handleInactive={handleInactive}
          />
          <DeletePopup
            handleOk={deleteHandleOk}
            handleCancel={deleteHandleCancel}
            visible={deleteVisible}
            DeleteBannerflag={DeleteBannerflag}
            rs={rs}
            setRs={setRs}
          />
        </div>
      </Row>
    </>
  );
};

export default ManageCmsUser;
