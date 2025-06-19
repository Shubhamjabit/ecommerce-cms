import React, {useState, useEffect} from 'react';
// import { getCustomerReviews } from "../DummyDatas/customerReviews";
import TableUi from './BannerTable/bannerTable';
import Header from './Header/Header';
import SelectionBar from './SelectionBar/SelectionBar';
import {Row} from 'antd';
import PublishPopup from './BannerTable/PublishOrHidePopup/PublishPopup';
import HidePopup from './BannerTable/PublishOrHidePopup/HidePopup';
import DeletePopup from './BannerTable/PublishOrHidePopup/DeletePopup';
import AddBannerModal from "./BannerTable/AddBannerModal/AddBannerModal";
import EditBannerModal from "./BannerTable/EditBannerModal/EditBannerModal";
import {useDispatch} from 'react-redux';
import {
  setLocation,
  setLocationLink,
} from '../../../../../store/actions/locationUpdateAction';


const Banner = () => {
  const dispatch = useDispatch();
  dispatch(setLocation("Banners"));
  dispatch(setLocationLink('/manage/'));

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
        <div className="card-body" style={{padding: '0px'}}>
        <Header showModal={showModal} />
          {/* <SelectionBar /> */}
          <TableUi
            pageSize={10}
            showModal1={showPublishModal}
            showModal2={showHideModal}
            showModal3={showDeleteModal}
            showModal4={showEditModal}
          />
        </div>
      </Row>
       <PublishPopup
        handleOk={publishHandleOk}
        handleCancel={publishHandleCancel}
        visible={publishVisible}
      />
     <HidePopup
        handleOk={hideHandleOk}
        handleCancel={hideHandleCancel}
        visible={hideVisible}
      />
       <DeletePopup
        handleOk={deleteHandleOk}
        handleCancel={deleteHandleCancel}
        visible={deleteVisible}
      />
      <AddBannerModal
         handleOk={handleOk}
         handleCancel={handleCancel}
         visible={visible}
      /> 
      <EditBannerModal
       handleOk={editHandleOk}
       handleCancel={editHandleCancel}
       visible={editVisible}
      />
    </>
  );
};

export default Banner;
