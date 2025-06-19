import React, {useEffect, useState} from 'react';
import {Button, Modal, Avatar, List, Skeleton, Divider, Row, Col} from 'antd';
import {
  DollarCircleFilled,
  DollarCircleTwoTone,
  DollarOutlined,
  LikeOutlined,
  MessageOutlined,
  StarOutlined,
} from '@ant-design/icons';
import {useSelector} from 'react-redux';
import {cmsendPoint, envUrl} from '../../../../utils/factory';
import axios from 'axios';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroll-component';

const VoucherListModal = ({isModalOpen, handleOk, handleCancel, rs, setRs}) => {
  const [loading, setLoading] = useState(true);
  const [listData, setListData] = useState([]);
  const user = useSelector((state) => state.userReducer.user);

  useEffect(() => {
    if (user) {
      getVoucherList();
    }
  }, [user]);

  const getVoucherList = () => {
    // if (listData.length > 1) {
    //   return listData;
    // }
    setLoading(true);
    const variables = {
      email: user.email,
      crudMethod: 'read',
    };
    console.log('!variables: ', variables);
    axios
      .post(`${envUrl.baseUrl}${cmsendPoint.crudVoucher}`, variables, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      })
      .then(function (response) {
        console.log('!!! response', response.data.data);
        setListData(response.data.data);
        // if (response.data.data.message === 'Data upload!') {
        //   setUploadResponse(response.data.data);
        //   setFileName(null);
        //   setUploadData(false);
        //   showModal(response.data.data);
        // } else {
        //   setUploadData(false);
        //   setFileName(null);
        //   showModal(response.data.data);
        //   //console.log("error FROM RESPONSE AddFilterModal::::: ");
        // }
      })
      .catch((error) => {
        console.log('API error in getVoucherList :::::', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  function handleDelete(id) {
    setLoading(true);
    const variables = {
      id,
      crudMethod: 'delete',
    };

    axios
      .post(`${envUrl.baseUrl}${cmsendPoint.crudVoucher}`, variables, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      })
      .then(function (response) {
        console.log('!!! response', response);
      })
      .catch((error) => {
        console.log('API error in getVoucherList :::::', error);
      })
      .finally(() => {
        setLoading(false);
        getVoucherList();
      });
  }

  return (
    <>
      {/* <Button type="primary" onClick={showModal}>
        Open Modal
      </Button> */}
      <Modal
        title={`Voucher List of ${user?.email}`}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        width={1000}
        // bodyStyle={{width: '1000px'}}
      >
        {/* <div
          id="scrollableDiv"
          style={{
            height: 400,
            // height: 50,
            overflow: 'auto',
            padding: '0 16px',
            border: '1px solid rgba(140, 140, 140, 0.35)',
          }}
        > */}
        {/* <InfiniteScroll
            dataLength={listData.length}
            next={getVoucherList}
            // hasMore={listData.length < 50}
            hasMore={true}
            loader={
              <Skeleton
                // avatar
                paragraph={{
                  rows: 1,
                }}
                active
              />
            }
            endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
            scrollableTarget="scrollableDiv"
          > */}
        <List
          //   style={{paddingTop:"1%"}}
          header={
            <Row
              gutter={{
                xs: 8,
                sm: 16,
                md: 24,
                lg: 32,
              }}
            >
              <Col className="gutter-row" span={10}>
                Voucher Details
              </Col>{' '}
              <Col className="gutter-row" span={5}>
                Start Date and Time
              </Col>
              <Col className="gutter-row" span={6}>
                <span style={{paddingLeft: '0%'}}>Expiry Date and Time</span>
              </Col>
              <Col className="gutter-row" span={3}>
                <span style={{paddingLeft: '0%'}}>Actions</span>
              </Col>
            </Row>
          }
          bordered
          dataSource={listData}
          renderItem={(item) => (
            <List.Item key={item.id}>
              <List.Item.Meta
                // avatar={<Avatar src={item.picture.large} />}
                // avatar={
                //   <Avatar
                //     size="large"
                //     icon={<DollarCircleTwoTone style={{fontSize: '20px'}} />}
                //   />
                // }
                avatar={<DollarCircleTwoTone style={{fontSize: '200%'}} />}
                title={item.voucherName}
                description={
                  <>
                    <>
                      {' '}
                      Minimum Cart Amount to Apply Voucher - $
                      {parseFloat(item.minCartAmount).toFixed(2)}
                    </>
                    <br />
                    {item.amountType == 0 ? (
                      <>
                        {' '}
                        Flat Amount - ${parseFloat(item.flatAmount).toFixed(
                          2
                        )}{' '}
                      </>
                    ) : (
                      <>
                        Discount -{' '}
                        {parseFloat(item.discountPercentage).toFixed(0)}%
                        <br />
                        Max Amount off - $
                        {parseFloat(item.maxAmountIfPercentage).toFixed(2)}
                      </>
                    )}
                    <br />
                    {item.isMultiple == 0 ? (
                      <> Single Use</>
                    ) : (
                      <> Multiple Use ({item.maxNumberUsage} times)</>
                    )}
                  </>
                }
              />
              <div style={{paddingRight: '5%'}}>
                {moment(item.startDateTime).format('Do MMM YYYY HH:mm:ss')}
              </div>
              <div>
                {moment(item.expiryDateTime).format('Do MMM YYYY HH:mm:ss')}
              </div>
              <Skeleton
                loading={loading}
                active
                avatar
                paragraph={{
                  rows: 1,
                }}
              />
              <List.Item
                actions={[
                  <Button onClick={() => handleDelete(item.id)}>Delete</Button>,
                ]}
              ></List.Item>
            </List.Item>
          )}
        />
        {/* </InfiniteScroll> */}
        {/* </div> */}
      </Modal>
    </>
  );
};
export default VoucherListModal;
