import React, {useState, useEffect} from 'react';
import {Row} from 'antd';
import Header from './Header/Header';
import {useDispatch} from 'react-redux';
import {
  setLocation,
  setLocationLink,
} from '../../store/actions/locationUpdateAction';
import TableUi from './ContentTable/ContentTable';
import DeletePopup from './ContentTable/components/DeletePopup';
//import EditContentModal from './ContentTable/EditContentModal/EditContentModal';
// import AddProductFaqModal from './ProductFaqTable/AddProductFaqModal/AddProductFaqModal';
// import EditProductFaqModal from './ProductFaqTable/EditProductFaqModal/EditProductFaqModal';

const contentpage = () => {
  const dispatch = useDispatch();
  dispatch(setLocation('Manage Content'));
  dispatch(setLocationLink('/manage/'));

  const [publishVisible, setPublishVisible] = useState(false);
  const [hideVisible, setHideVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [deletecontentflag, setDeleteContentflag] = useState(false);

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
    setDeleteContentflag(false);
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

  const DeleteContentflag = (e) => {
    setDeleteContentflag(true);
  };

  return (
    <>
      <Row>
        <div className="card-body">
          <Header showModal={showModal} />
          <TableUi
            pageSize={10}
            showModal3={showDeleteModal}
            showModal4={showEditModal}
            deletecontentflag={deletecontentflag}
          />
          {/* <EditContentModal
            handleOk={editHandleOk}
            handleCancel={editHandleCancel}
            visible={editVisible}
          /> */}
          <DeletePopup
            handleOk={deleteHandleOk}
            handleCancel={deleteHandleCancel}
            visible={deleteVisible}
            DeleteContentflag={DeleteContentflag}
          />
        </div>
      </Row>
    </>
  );
};

export default contentpage;
