import React, {useEffect, useState} from 'react';
import {
  Button,
  Popconfirm,
  Modal,
  Row,
  Col,
  Input,
  DatePicker,
  List,
  Skeleton,
  InputNumber,
} from 'antd';
import {useSelector} from 'react-redux';
import styles from './styles.module.scss';
import {DollarCircleTwoTone} from '@ant-design/icons';
import {cmsendPoint, envUrl} from '../../../../utils/factory';
import axios from 'axios';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroll-component';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
const {RangePicker} = DatePicker;

const DiscountListModal = ({isModalOpen, handleOk, handleCancel}) => {
  const [loading, setLoading] = useState(true);
  const [listData, setListData] = useState([]);
  const [isEdit, setIsEdit] = useState('');
  // const [data, setData] = useState({
  //   discount_name: '',
  //   discount_value: '',
  //   scheduledDateTime: '',
  // });

  function handleChange(e) {
    setData({...data, [e.target.name]: e.target.value});
  }

  function handleNumberChange(value) {
    setData({...data, ['discount_value']: value});
  }

  function handleDateTimeChange(value) {
    console.log('value date ', value);
    setData({...data, scheduledDateTime: value});
  }

  function handleUpdate(id) {
    setIsEdit(id);
    const listItem = listData.filter((item) => item.id === id)[0];
    setData({
      ...data,
      discount_name: listItem.discountName,
      discount_value: Number(listItem.discountPercentage),
      scheduledDateTime: [
        dayjs(listItem.startDateTime),
        dayjs(listItem.expiryDateTime),
      ],
    });
  }
  function handleDelete(id) {
    setLoading(true);
    const variables = {
      id,
      crudMethod: 'delete',
    };

    axios
      .post(`${envUrl.baseUrl}${cmsendPoint.crudProductDiscount}`, variables, {
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
        getProductDiscountList();
        setLoading(false);
      });
  }
  function handleSubmit(id) {
    const rangeTimeValue = data.scheduledDateTime;
    (data = {
      ...data,
      scheduledDateTime: [
        rangeTimeValue[0].format('YYYY-MM-DD HH:mm:ss'),
        rangeTimeValue[1].format('YYYY-MM-DD HH:mm:ss'),
      ],
    }),
      (data['discount_id'] = id);
    const variables = {
      ...data,
      crudMethod: 'update',
    };

    axios
      .post(`${envUrl.baseUrl}${cmsendPoint.crudProductDiscount}`, variables, {
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
        getProductDiscountList();
      });
  }

  const user = useSelector((state) => state.userReducer.user);
  useEffect(() => {
    if (user || isModalOpen) {
      getProductDiscountList();
    }
  }, [user, isModalOpen]);

  const getProductDiscountList = () => {
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
      .post(`${envUrl.baseUrl}${cmsendPoint.crudProductDiscount}`, variables, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      })
      .then(function (response) {
        console.log('!!! response', response.data.data);
        setListData(response.data.data);
      })
      .catch((error) => {
        console.log('API error in getVoucherList :::::', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Modal
      title={`Product Discount List of ${user?.email}`}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
      width={1200}
      // bodyStyle={{width: '1000px'}}
    >
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
              Discount Details
            </Col>{' '}
            {isEdit ? (
              <>
                <Col className="gutter-row" span={10}>
                  Scheduled Date
                </Col>
              </>
            ) : (
              <>
                <Col className="gutter-row" span={5}>
                  <span style={{paddingLeft: '40%'}}>Start Date and Time</span>
                </Col>
                <Col className="gutter-row" span={5}>
                  <span style={{paddingLeft: '35%'}}>Expiry Date and Time</span>
                </Col>
              </>
            )}
            <Col className="gutter-row" span={4}>
              <span style={{paddingLeft: '40%'}}>Actions</span>
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
              title={
                isEdit === item.id ? (
                  <>
                    <Input
                      style={{width: '80%'}}
                      placeholder="Discount Name"
                      name="discount_name"
                      onChange={handleChange}
                      // defaultValue={item.discountName}
                      value={data.discount_name}
                    />
                  </>
                ) : (
                  <>{item.discountName}</>
                )
              }
              description={
                <>
                  {isEdit === item.id ? (
                    <>
                      <InputNumber
                        value={data.discount_value}
                        onChange={(value) => handleNumberChange(value)}
                        addonAfter="%"
                        min={1}
                      />
                    </>
                  ) : (
                    <>
                      Discount- {parseFloat(item.discountPercentage).toFixed(0)}
                      %
                    </>
                  )}
                </>
              }
            />
            <div>
              {isEdit === item.id && (
                <RangePicker
                  showTime
                  format="DD-MM-YYYY HH:mm:ss"
                  onChange={(e, value) => handleDateTimeChange(e, value)}
                  value={data.scheduledDateTime}
                />
              )}
            </div>
            {isEdit !== item.id && (
              <div style={{paddingRight: '10%'}}>
                {moment(item.startDateTime).format('Do MMM YYYY HH:mm:ss')}
              </div>
            )}
            {isEdit !== item.id && (
              <div>
                {moment(item.expiryDateTime).format('Do MMM YYYY HH:mm:ss')}
              </div>
            )}

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
                // <Button
                //   onClick={() => {
                //     if (isEdit === item.id) {
                //       handleSubmit(item.id);
                //     } else {
                //       handleUpdate(item.id);
                //     }
                //   }}
                // >
                //   {isEdit === item.id ? <>Update</> : <>Edit</>}
                // </Button>,
                <Button
                  onClick={() => {
                    if (isEdit !== '') {
                      setIsEdit('');
                    } else {
                      handleDelete(item.id);
                    }
                  }}
                >
                  {isEdit === item.id ? <>Cancel</> : <>Delete</>}
                </Button>,
              ]}
            ></List.Item>
          </List.Item>
        )}
      />
    </Modal>
  );
};

export default DiscountListModal;

// {/* <Row className={styles.row}>
//           <Col className="gutter-row" span={8}>
//             <div className={styles.heading}>Voucher Details</div>

//             <div className={styles.details}>
//               <div className={styles.details__left}>
//                 <DollarCircleTwoTone style={{fontSize: '300%'}} />
//               </div>
//               <div className={styles.details_right}>
//                 <div>
//                   <span>Discount Name:</span>
//                   <Input value={data.name}></Input>
//                 </div>
//                 <div>
//                   <span>Discount Percentage:</span>
//                   <Input value={data.disount_percentage}></Input>
//                 </div>
//               </div>
//             </div>
//           </Col>{' '}
//           <Col className="gutter-row" span={5}>
//             <div className={styles.heading}>Scheduled Time</div>
//             <div>
//               <RangePicker></RangePicker>
//             </div>
//           </Col>
//           {/* <Col className="gutter-row" span={5}>
//           <div className={styles.heading}>Expiry</div>
//           <div><Input value={data.endtime}></Input></div>
//         </Col> */}
//           <Col className="gutter-row" span={5}>
//             <div className={styles.heading}>Actions</div>
//             <div className={styles.action_btns}>
//               <Popconfirm
//                 title="Delete the task"
//                 description="Are you sure to delete this task?"
//                 onConfirm={confirm}
//                 onCancel={cancel}
//                 okText="Yes"
//                 cancelText="No"
//               >
//                 <Button danger>Delete</Button>
//               </Popconfirm>

//               <Button className={styles.update_btn}>Update</Button>
//             </div>
//           </Col>
//         </Row> */}
