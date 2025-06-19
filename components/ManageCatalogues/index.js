import React, {useState, useEffect} from 'react';
import {Row} from 'antd';
import Header from './Header/Header';
import TableUi from './CataloguesTable/CataloguesTable';
import EditCategoryModal from './CataloguesTable/EditCatalogues/Modal/EditCataloguesModal';
import AddCategoryModal from './CataloguesTable/AddCataloguesModal/AddCataloguesModal';
import {cmsendPoint, envUrl} from '../../utils/factory';
import axios from 'axios';
import DeletePopup from './CataloguesTable/components/DeletePopup';
const ManageCatalogues = () => {
  const [visible, setVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [categories, setCategories] = useState(null);
  const [editcategoryflag, setEditcategoryflag] = useState(false);
  const [addcategoryflag, setAddcategoryflag] = useState(false);
  const [deletebannerflag, setDeleteBannerflag] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [rs, setRs] = useState(0);
  const [isModalCloseable, setIsModalCloseable] = useState(true);

  // useEffect(() => {
  //   if (data) {
  //     setCategories(data.getCategoryMenuHierachyCMS);
  //   }
  // }, [data]);
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
    // if (isModalCloseable) {
    setEditVisible(false);
    // }
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
            showEditModal={showEditModal}
            editcategoryflag={editcategoryflag}
            addcategoryflag={addcategoryflag}
            showDeleteModal={showDeleteModal}
            deletebannerflag={deletebannerflag}
            rs={rs}
            setRs={setRs}
          />
          {/* <AddBannerModal
            handleOk={handleOk}
            handleCancel={handleCancel}
            visible={visible}
          /> */}
          <EditCategoryModal
            handleOk={editHandleOk}
            handleCancel={editHandleCancel}
            visible={editVisible}
            Editcategoryflag={Editcategoryflag}
            categories={categories}
            setIsModalCloseable={setIsModalCloseable}
            isModalCloseable={isModalCloseable}
          />
          <AddCategoryModal
            handleOk={handleOk}
            handleCancel={handleCancel}
            visible={visible}
            setVisible={setVisible}
            categories={categories}
            Addcategoryflag={Addcategoryflag}
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

export default ManageCatalogues;
