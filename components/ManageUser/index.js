import React, {useState, useEffect} from 'react';
import {Row} from 'antd';
import Header from './Header/Header';
import TableUi from './ManageUserTable/manageuserTable';
import PublishPopup from './ManageUserTable/PublishOrHidePopup/PublishPopup';
import HidePopup from './ManageUserTable/PublishOrHidePopup/HidePopup';
import {cmsendPoint, envUrl} from '../../utils/factory';
import axios from 'axios';
import CreateVoucherModal from './ManageUserTable/CreateVoucherModal/CreateVoucherModal';
import CreateDiscountModel from './ManageUserTable/CreateDiscountModel/CreateDiscountModel';
import VoucherListModal from './ManageUserTable/VoucherListModal/VoucherListModal';
import DiscountListModal from './ManageUserTable/DiscountListModal/DiscountListModal';
const ManageUser = () => {
  const [publishVisible, setPublishVisible] = useState(false);
  const [hideVisible, setHideVisible] = useState(false);
  const [createVoucherVisible, setCreateVoucherVisible] = useState(false);
  const [createDiscountVisible, setCreateDiscountVisible] = useState(false);
  const [inactiveflag, setInactiveFlag] = useState(false);
  const [activeflag, setAvtiveFlag] = useState(false);
  const [isVLModalOpen, setIsVLModalOpen] = useState(false);
  const [isDLModalOpen, setIsDLModalOpen] = useState(false);
  const [rs, setRs] = useState(0);

  const showDLModal = () => {
    setIsDLModalOpen(true);
  };
  const showVLModal = () => {
    setIsVLModalOpen(true);
  };
  // const handleVLOk = () => {
  //   setIsVLModalOpen(false);
  // };
  const handleVLCancel = () => {
    setIsVLModalOpen(false);
  };

  const handleDLCancel = () => {
    setIsDLModalOpen(false);
  };

  const showCreateVoucher = () => {
    setCreateVoucherVisible(true);
  };

  const createVoucherHandleOk = (e) => {
    setCreateVoucherVisible(false);
  };

  const createVoucherHandleCancel = (e) => {
    setCreateVoucherVisible(false);
    setAvtiveFlag(false);
  };

  const showCreateDiscount = (e) => {
    setCreateDiscountVisible(true);
  };

  const createDiscountHandleOk = (e) => {
    setCreateDiscountVisible(false);
  };

  const createDiscoutHandleCancel = (e) => {
    setCreateDiscountVisible(false);
    // setAvtiveFlag(false)
  };

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

  return (
    <>
      <Row>
        <div className="card-body">
          <Header />
          <TableUi
            pageSize={10}
            showModal1={showPublishModal}
            showModal2={showHideModal}
            showCreateVoucher={showCreateVoucher}
            showVLModal={showVLModal}
            inactiveflag={inactiveflag}
            activeflag={activeflag}
            showCreateDiscount={showCreateDiscount}
            showDLModal={showDLModal}
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

          <CreateVoucherModal
            handleOk={createVoucherHandleOk}
            handleCancel={createVoucherHandleCancel}
            visible={createVoucherVisible}
            // handleInactive={createVoucherhandleInactive}
            rs={rs}
            setRs={setRs}
          />

          <VoucherListModal
            handleOk={showVLModal}
            handleCancel={handleVLCancel}
            isModalOpen={isVLModalOpen}
            rs={rs}
            setRs={setRs}
          />

          <CreateDiscountModel
            handleOk={createDiscountHandleOk}
            handleCancel={createDiscoutHandleCancel}
            visible={createDiscountVisible}
            rs={rs}
            setRs={setRs}
          />

          <DiscountListModal
            isModalOpen={isDLModalOpen}
            handleOk={showDLModal}
            handleCancel={handleDLCancel}
            rs={rs}
            setRs={setRs}
          />
        </div>
      </Row>
    </>
  );
};

export default ManageUser;
