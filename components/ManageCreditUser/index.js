import React, {useState, useEffect} from 'react';
import {Row} from 'antd';
import Header from './Header/Header';
import TableUi from './ManageUserTable/manageuserTable';
import ApprovedPopup from './ManageUserTable/PublishOrHidePopup/ApprovedPopup';
import PendingPopup from './ManageUserTable/PublishOrHidePopup/PendingPopup';
import ProcessingPopup from './ManageUserTable/PublishOrHidePopup/ProcessingPopup';
import RejectedPopup from './ManageUserTable/PublishOrHidePopup/RejectedPopup';
import {cmsendPoint, envUrl} from '../../utils/factory';
import axios from 'axios';
const ManageCreditUser = () => {
  const [processingVisible, setProcessingVisible] = useState(false);
  const [approvedVisible, setApprovedVisible] = useState(false);
  const [rejectedVisible, setRejectedVisible] = useState(false);
  const [pendingVisible, setPendingVisible] = useState(false);
  const [processingflag, setProcessingFlag] = useState(false);
  const [approvedflag, setApprovedFlag] = useState(false);
  const [rejectedflag, setRejectedFlag] = useState(false);
  const [pendingflag, setPendingFlag] = useState(false);
  const [status, setStatus] = useState(null);

  const showProcessingModal = (e) => {
    setProcessingVisible(true);
    setStatus(e);
  };

  const processingHandleOk = (e) => {
    setProcessingVisible(false);
    setProcessingFlag(false);
  };

  const processingHandleCancel = (e) => {
    setProcessingVisible(false);
    setProcessingFlag(false);
  };

  const showApprovedModal = (e) => {
    setApprovedVisible(true);
    setStatus(e);
  };

  const approvedHandleOk = (e) => {
    setApprovedVisible(false);
    setApprovedFlag(false);
  };

  const approvedHandleCancel = (e) => {
    setApprovedVisible(false);
    setApprovedFlag(false);
  };

  const showPendingModal = (e) => {
    setPendingVisible(true);
    setStatus(e);
  };

  const pendingHandleOk = (e) => {
    setPendingVisible(false);
    setPendingFlag(false);
  };

  const pendingHandleCancel = (e) => {
    setPendingVisible(false);
    setPendingFlag(false);
  };

  const showRejectedModal = (e) => {
    setRejectedVisible(true);
    setStatus(e);
  };

  const rejectedHandleOk = (e) => {
    setRejectedVisible(false);
    setRejectedFlag(false);
  };

  const rejectedHandleCancel = (e) => {
    setRejectedVisible(false);
    setRejectedFlag(false);
  };

  const handlePending = (e) => {
    setPendingFlag(true);
  };

  const handleProcessing = (e) => {
    setProcessingFlag(true);
  };
  const handleApproved = (e) => {
    setApprovedFlag(true);
  };

  const handleRejected = (e) => {
    setRejectedFlag(true);
  };

  return (
    <>
      <Row>
        <div className="card-body">
          <Header />
          <TableUi
            pageSize={10}
            showModal1={showProcessingModal}
            showModal2={showApprovedModal}
            showModal3={showPendingModal}
            showModal4={showRejectedModal}
            processingflag={processingflag}
            approvedflag={approvedflag}
            rejectedflag={rejectedflag}
            pendingflag={pendingflag}
          />

          <ProcessingPopup
            handleOk={processingHandleOk}
            handleCancel={processingHandleCancel}
            visible={processingVisible}
            handleProcessing={handleProcessing}
            status={status}
          />
          <ApprovedPopup
            handleOk={approvedHandleOk}
            handleCancel={approvedHandleCancel}
            visible={approvedVisible}
            handleApproved={handleApproved}
            status={status}
          />
          <PendingPopup
            handleOk={pendingHandleOk}
            handleCancel={pendingHandleCancel}
            visible={pendingVisible}
            handlePending={handlePending}
            status={status}
          />
          <RejectedPopup
            handleOk={rejectedHandleOk}
            handleCancel={rejectedHandleCancel}
            visible={rejectedVisible}
            handleRejected={handleRejected}
            status={status}
          />
        </div>
      </Row>
    </>
  );
};

export default ManageCreditUser;
