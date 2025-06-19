import React, {useState, useEffect} from 'react';
import {cmsendPoint, envUrl} from '../../../../utils/factory';
import axios from 'axios';
import {Grid} from '@mui/material';
import {Button, Space, Input, Col, Row, Spin, InputNumber, Tooltip} from 'antd';
import {Container} from 'react-bootstrap';
import styles from './OrderDetails.module.scss';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DoneIcon from '@mui/icons-material/Done';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import RedeemIcon from '@mui/icons-material/Redeem';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Alerts from './Alerts';
import EditIcon from '@mui/icons-material/Edit';
import {EditTwoTone} from '@ant-design/icons';
import {textAlign} from '@mui/system';
import {useDispatch} from 'react-redux';
import {setOrderDetailsAction} from '../../../../store/actions/orderActions';
import {setItemDetailsAction} from '../../../../store/actions/orderActions';
// import parseHtml from 'react-pdf-html/dist/parse';

function OrderDetails({
  orderId,
  setOrderId,
  isOrdersList,
  setIsOrdersList,
  refreshOrdersList,
  setRefreshOrdersList,
}) {
  const handleBackButton = () => {
    setIsOrdersList(!isOrdersList);
    setOrderId(null);
    // console.log(
    //   'handleBackButton *************************',
    //   orderId,
    //   isOrdersList
    // );
  };

  const dispatch = useDispatch();
  const [orderDetails, setOrderDetails] = useState([]);
  console.log('********** orderDetails', orderDetails);
  const [itemDetails, setItemDetails] = useState([]);
  console.log('**********99999 itemDetails', itemDetails[0]?.qtyShipped);
  const [paymentDetails, setPaymentDetails] = useState([]);
  console.log('**********22222 paymentDetails', paymentDetails);
  const [orderLogsArray, setOrderLogsArray] = useState([]);
  const [date, setDate] = useState();
  console.log('ddddddddd2222', date);
  const [dateForTLMString, setDateForTLMString] = useState(null);
  console.log('ddddddddd', dateForTLMString);
  const [time, setTime] = useState();
  const [orderLogsdate, setOrderLogsDate] = useState();
  const [orderLogstime, setOrderLogsTime] = useState();
  const [status, setStatus] = useState('Pending');
  console.log('status', status);
  const [comment, setComment] = useState('');
  const [isNotifyCustomer, setIsNotifyCustomer] = useState(0);
  const [isVisibleFrontend, setIsVisibleFrontend] = useState(0);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [refreshState, setRefreshState] = useState(0);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [successAlert, setSuccessAlert] = useState('');
  const [errorAlert, setErrorAlert] = useState('');
  const [erpNumber, setErpNumber] = useState('');
  const [isErpDisabled, setIsErpDisabled] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isOrderLogsLoading, setIsOrderLogsLoading] = useState(false);
  const [isDisableSubmit, setIsDisableSubmit] = useState(false);
  const [disableSubmitType, setDisableSubmitType] = useState('');
  const [qtyRS, setQtyRS] = useState(0); // Quantity Refresh State
  // const [orderLogsListFocus, setOrderLogsListFocus] = useState(0);
  // console.log('&&&&&&&&&&&&', isNotifyCustomer);

  useEffect(() => {
    for (let i = 0; i < itemDetails.length; i++) {
      console.log(
        '*************99999 llllllllllllllll',
        itemDetails[i].qtyAlreadyShipped,
        itemDetails[i].qtyShipped,
        itemDetails[i].quantity,
        i
      );
      console.log(
        '*************99999 CONDITION',
        itemDetails[i].qtyAlreadyShipped + itemDetails[i].qtyShipped >=
          itemDetails[i].quantity
      );
      if (
        itemDetails[i].qtyAlreadyShipped + itemDetails[i].qtyShipped >=
        itemDetails[i].quantity
      ) {
        //START => to enable submit if order is complete but still need to submit comment other than shipped
        if (itemDetails[i].qtyAlreadyShipped == itemDetails[i].quantity) {
          // START => IF ALL ITEMS SHIPPED, STATUS CANNOT BE LIKE SHIPPED
          if (status == 'Shipped' || status == 'Partially Shipped') {
            setIsDisableSubmit(true);
            setDisableSubmitType(
              'All Items shipped! Status cannot be shipped!'
            );
            return;
          }
          // END => IF ALL ITEMS SHIPPED, STATUS CANNOT BE LIKE SHIPPED
          else {
            setIsDisableSubmit(false);
            return;
          }
        }
        //END => to enable submit if order is complete but still need to submit comment
        else {
          // setIsDisableSubmit(true);
          setIsDisableSubmit(false);
          // setDisableSubmitType('Quantity Pending cannot be negative');
          return;
        }
      } else if (i == itemDetails.length - 1) {
        setIsDisableSubmit(false);
      } else {
        setIsDisableSubmit(false);
        return;
      }
    }
  }, [itemDetails, qtyRS]);

  function getMonthName(monthNumber) {
    const date = new Date();
    date.setMonth(monthNumber - 1);

    return date.toLocaleString('en-US', {
      month: 'short',
    });
  }

  const getOrderDetails = async () => {
    const json = {
      orderId: orderId,
    };
    try {
      setIsDataLoading(true);
      await axios
        .post(`${envUrl.baseUrl}${cmsendPoint.getOrderDetails}`, json, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
        })
        .then(function (response) {
          if (response && response.status == 200) {
            setOrderDetails(response.data[0]);
            setItemDetails(response.data[1]);
            setPaymentDetails(response.data[2]);
            // dispatch(setOrderDetails(response.data[0]));
            // dispatch(setItemDetails(response.data[1]));
            setIsDataLoading(false);
          } else if ((response.status = 204)) {
            console.log('EMPTY DATA!');
          }
        })
        .catch(function (error) {
          console.log(error.message);
          return {state: false, message: error.message};
        });
    } catch (error) {
      console.log('error signIn:', error.message);
      return {state: false, message: error.message};
    }
  };

  const getOrderLogsArray = async () => {
    const json = {
      orderId: orderId,
    };
    try {
      // setIsOrderLogsLoading(true);
      await axios
        .post(`${envUrl.baseUrl}${cmsendPoint.getOrderLogs}`, json, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
        })
        .then(function (response) {
          if (response && response.status == 200) {
            setOrderLogsArray(response.data);
            // setIsOrderLogsLoading(false);
            // console.log('^^^^^^^^^^^^^^^ orderLogsArray', orderLogsArray);
          } else if ((response.status = 204)) {
            // console.log('EMPTY DATA!');
          }
        })
        .catch(function (error) {
          console.log(error.message);
          // setInitLoading(false);
          return {state: false, message: error.message};
        });
    } catch (error) {
      console.log('error signIn:', error.message);
      // setInitLoading(false);
      return {state: false, message: error.message};
    }
  };

  // use effect for fetching data
  useEffect(() => {
    getOrderDetails();
    getOrderLogsArray();
    // start - converting Date into desired format
    if (Object.keys(orderDetails).length > 0) {
      let createdDate = orderDetails.createdDate;

      let t = createdDate.split(/[- : T .]/);

      let dateString = getMonthName(t[1]) + ' ' + t[2] + ',' + t[0];
      let timeString = t[3] + ':' + t[4] + ':' + t[5];
      let dateForTLMString = t[0] + '-' + t[1] + '-' + t[2] + ' ' + timeString;
      setDate(dateString);
      setTime(timeString);
      setDateForTLMString(dateForTLMString);
    }
    if (orderLogsArray.length > 0) {
      orderLogsArray.forEach((obj) => {
        let createdDate = obj.createdAt;

        let t = createdDate.split(/[- : T .]/);

        let dateString = getMonthName(t[1]) + ' ' + t[2] + ',' + t[0];
        let timeString = t[3] + ':' + t[4] + ':' + t[5];
        obj.date = dateString;
        obj.time = timeString;
      });
    }
    // end
  }, [refreshState]);

  // use effect for converting date into desired format
  useEffect(() => {
    // start - converting Date into desired format
    if (Object.keys(orderDetails).length > 0) {
      let createdDate = orderDetails.createdDate;

      let t = createdDate.split(/[- : T .]/);

      let dateString = getMonthName(t[1]) + ' ' + t[2] + ',' + t[0];
      let timeString = t[3] + ':' + t[4] + ':' + t[5];
      let dateForTLMString = t[0] + '-' + t[1] + '-' + t[2] + ' ' + timeString;
      setDate(dateString);
      setTime(timeString);
      setDateForTLMString(dateForTLMString);
      dispatch(setOrderDetailsAction(orderDetails));
      dispatch(setItemDetailsAction(itemDetails));
    }
    if (orderLogsArray.length > 0) {
      orderLogsArray.forEach((obj) => {
        let createdDate = obj.createdAt;

        let t = createdDate.split(/[- : T .]/);

        let dateString = getMonthName(t[1]) + ' ' + t[2] + ',' + t[0];
        let timeString = t[3] + ':' + t[4] + ':' + t[5];
        obj.date = dateString;
        obj.time = timeString;
      });
    }
    // end
    setErpNumber(orderDetails.erpNumber);
  }, [orderDetails, orderLogsArray, itemDetails]);

  // // use effect for refreshing orders logs
  // useEffect(() => {
  //   getOrderLogsArray();
  // }, [refreshState]);

  const sendShippingEmail = async () => {
    const emailJson = {
      email: orderDetails.customerEmail,
      orderitems: itemDetails,
      customer_name:
        orderDetails.customerFName + ' ' + orderDetails.customerLName,
      // order_date: moment().tz("Australia/Sydney").format("DD/MM/YYYY"),
      // order_date: orderDetails.createdDate,
      order_date: `${date} ${time}`,
      order_id: orderDetails.externalReference,
      customer_mobile: orderDetails.customerMobile,
      sub_total: orderDetails.totalAmount,
      shipping_total: orderDetails.deliveryCharge,
      total: orderDetails.grandTotal,
      customer_address:
        orderDetails.deliveryAddressStreet +
        ' ' +
        orderDetails.deliveryAddressSuburb +
        ' ' +
        orderDetails.deliveryAddressState +
        ' ' +
        orderDetails.deliveryAddressCountry +
        ' ' +
        orderDetails.deliveryAddressPostcode,
      tracking_number: trackingNumber,
      status: status,
      comment: comment,
    };
    console.log('[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[', emailJson);
    if (status == 'Shipped' || status == 'Partially Shipped') {
      try {
        await axios
          .post(
            `${envUrl.baseUrl}${cmsendPoint.sendShippingEmail}`,
            emailJson,
            {
              headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
              },
            }
          )
          .then(function (response) {
            console.log(
              '==========================response in send email',
              response
            );
            //   return;
            if (response && response.status == 200) {
              setSuccessAlert('Email sent!');
            }
          })
          .catch(function (error) {
            setErrorAlert(error.message);
            return {state: false, message: error.message};
          });
      } catch (error) {
        setErrorAlert('error signIn:', error.message);
        setSubmitLoading(false);
        return {state: false, message: error.message};
      }
    } else {
      console.log('EMAIL NOT SENT SINCE STATUS IS NOT SHIPPED');
    }
  };

  const handleSubmitComment = async () => {
    const json = {
      orderId: orderId,
      externalReference: orderDetails.externalReference,
      userName: 'admin',
      status: status,
      comment: comment,
      isNotifyCustomer: isNotifyCustomer,
      isVisibleFrontend: isVisibleFrontend,
      itemDetails: itemDetails,
      trackingNumber: trackingNumber,
    };

    console.log('JSONNNNNNNNNNNNNNNNNNNNNNNNNNN', json);
    // return;
    try {
      setSubmitLoading(true);
      await axios
        .post(`${envUrl.baseUrl}${cmsendPoint.saveOrdersLogs}`, json, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
        })
        .then(function (response) {
          if (response && response.status == 200) {
            console.log('successfully submitted');
            if (isNotifyCustomer) {
              console.log('email sent true');
              sendShippingEmail();
            }
            getOrderLogsArray();
            setSubmitLoading(false);
            // setRefreshState(refreshState + 1);
            setRefreshOrdersList(refreshOrdersList + 1);
            const element = document.getElementById('orderLogsList');
            if (element) {
              // 👇 Will scroll smoothly to the top of the next section
              // console.log('SCROLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL');
              element.scrollIntoView({behavior: 'smooth'});
            }
          } else if ((response.status = 204)) {
            console.log('EMPTY DATA!');
            setSubmitLoading(false);
          }
        })
        .catch(function (error) {
          console.log(error.message);
          setSubmitLoading(false);
          return {state: false, message: error.message};
        });
    } catch (error) {
      console.log('error signIn:', error.message);
      setSubmitLoading(false);
      return {state: false, message: error.message};
    } finally {
      setTrackingNumber('');
      setComment('');
      setStatus('Pending');
      setQtyRS((prev) => prev + 1);
      setRefreshState((prev) => prev + 1);
      setSubmitLoading(false);
    }
  };

  const handleErpNumberChange = (e) => {
    setErpNumber(e.target.value);
  };

  const handleStatusChange = (e) => {
    if (
      e.target.value !== 'Shipped' &&
      e.target.value !== 'Partially Shipped'
    ) {
      // set tracking number to empty if status != shipped
      setTrackingNumber('');
    }
    setStatus(e.target.value);
    setQtyRS((prev) => prev + 1);
  };

  const handleCommentChange = (e) => {
    // console.log(
    //   'TARGET VALUEEEEEEEEEEEEEEEEEEEEEEEEEEEE handleCommentChange',
    //   e.target.value
    // );
    setComment(e.target.value);
  };

  const handleTrackingNumberChange = (e) => {
    setTrackingNumber(e.target.value);
  };

  const toggleIsNotifyCustomerChange = (e) => {
    let v = e.target.checked ? 1 : 0;
    setIsNotifyCustomer(v);
  };

  const toggleIsVisibleFrontendChange = (e) => {
    let v = e.target.checked ? 1 : 0;
    setIsVisibleFrontend(v);
  };

  const updateErpNumber = async () => {
    const json = {
      erpNumber: erpNumber,
      orderId: orderId,
    };
    // console.log('JSONNNNNNNNNNNNNNNNNNNNNNNNNNN', json);
    try {
      setSubmitLoading(true);
      await axios
        .post(`${envUrl.baseUrl}${cmsendPoint.updateErpNumber}`, json, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
        })
        .then(function (response) {
          if (response && response.status == 200) {
            console.log('ERP Number updated!');
            setSuccessAlert('ERP Number updated!');
            setSubmitLoading(false);
            setIsErpDisabled(true);
            // setRefreshState(refreshState + 1);
            setRefreshOrdersList(refreshOrdersList + 1);
          } else if ((response.status = 204)) {
            console.log('ERP Number Empty!');
            setErrorAlert('ERP Number Empty!');
            setSubmitLoading(false);
          }
        })
        .catch(function (error) {
          console.log(error.message);
          setErrorAlert(error.message);
          setSubmitLoading(false);
          return {state: false, message: error.message};
        });
    } catch (error) {
      console.log('error signIn:', error.message);
      setErrorAlert('error signIn:', error.message);
      setSubmitLoading(false);
      return {state: false, message: error.message};
    }
  };
  console.log('@@@@@@@@@@@@ orderDetails', orderDetails);
  console.log('^^^^^^^^^^^^^^ itemDetails', itemDetails);
  // console.log('!!!!!!!!!!!!!! orderLogsArray', orderLogsArray);
  // console.log('(((((((((((((((((()))))))))))))))))) erpNumber', erpNumber);

  const handleqtyShippedChange = (e, id) => {
    if (e == null) {
      e = 0;
    }
    console.log('eeeeeeeeeeeeeeeeeeee', e);
    var result = [...itemDetails]; //<- copy itemDetails into result
    result = result.map((x) => {
      //<- use map on result to find element to update using id
      if (x.id === id) {
        x.qtyShipped = e;
        return x;
      } else return x;
    });
    setItemDetails(result); //<- update itemDetails with value edited
    // setQtyRS(qtyRS + 1);
  };

  const handleBlurShippedChange = () => {
    console.log('handleBlurShippedChange');
    setQtyRS(qtyRS + 1);
  };

  const createOrderInTLM = () => {
    const data = {
      saviy_client: 'SPARKYW',
      saviy_token:
        '4=Waon1sWaTHoI87ib/6Jwz3B-EEwlAw8IW0TniHfe58BSf7k1OwYo4-vOwT5g-k3qhy7vy?X5bczIFO1v?xObBpG=hz6t9jhrIvJyM=ZvbVNFM?pymlXxOE7DYUZMhxQBGB1xY3Q4zwJxNcweZdzPyprGUroDQfvNXIkCw7p4!BQfPmSCeA71F?DpW9z3Id0W5h7kQ3P4B3R-qY7YipJ-!NlHviqjzl/FPoerTKtrbpV-pXafC-Hn1H/xdFKCO3',
      orderId: orderDetails.externalReference, // 230914544831
      items: orderDetails.total_items, // 2
      orderTotal: orderDetails.grandTotal, //450.27
      orderLineDetails: itemDetails.map((i) => {
        return {
          price: i.itemOriginalPrice,
          qty: i.quantity,
          weight: i.weight,
          pallets: i.pallets,
          descriptionOfGoods: i.productName,
          length: i.length,
          width: i.width,
          height: i.height,
          totalCubic: i.cbm,
        };
      }),
      //  [
      //   {
      //     price: 150.15,
      //     qty: 3,
      //     weight: 1,
      //     pallets: 0,
      //     descriptionOfGoods:
      //       'Insulated Bootlace / Ferrule, Single 100mm x 25mm2',
      //     length: 2,
      //     width: 2,
      //     height: 2,
      //     totalCubic: 8,
      //   },
      //   {
      //     price: 300.12,
      //     qty: 3,
      //     weight: 0.5,
      //     pallets: 1,
      //     descriptionOfGoods: 'B05-AMXX/8H4 ',
      //     length: 2,
      //     width: 1,
      //     height: 2,
      //     totalCubic: 4,
      //   },
      // ],
      customerDetails: {
        name: orderDetails.customerFName + orderDetails.customerLName, // 'Customer',
        email: orderDetails.customerEmail, //'customer@gmail.com',
        phoneNumber: orderDetails.customerPhone, //'0888888888',
        address1: 'LEVEL 1',
        address2: orderDetails.deliveryAddressStreet.split(',')[0], //'123 Eagle St',
        suburb: orderDetails.deliveryAddressSuburb, //'Brisbane City',
        state: orderDetails.deliveryAddressState, //'QLD',
        postcode: orderDetails.deliveryAddressPostcode, //4000,
      },
      variousReferenceNumbers: {
        sender: 'null',
        customer: 'null',
      },
      additionalSenderDetails: {
        name: 'Sparky Warehouse Australia Pty Ltd',
        address1: 'LEVEL 1',
        address2: '57-61 Freight Drive',
        suburb: 'SOMERTON',
        state: 'VIC',
        postcode: 3062,
        email: 'sales@sparkywarehouse.com.au',
      },
      additionalCustomerDetails: null,
      specialInstructions: 'Wait until all items are in stock (1 shipment)',
      bookingDateTime: dateForTLMString, //'2023-09-14 10:23:00',
      despatchDateTime: dateForTLMString, //'2023-09-15 12:30:00',
      dangerousGoods: 'NA',
      orderUuid: orderDetails.id,
      updatedBy: JSON.parse(localStorage.getItem('user')).sub,
    };
    console.log('dddddd3333333', data);
    // return;
    axios
      .post(`${envUrl.baseUrl}${cmsendPoint.createOrderInTLM}`, data, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
          'Content-Type': 'application/json',
        },
      })
      .then(function (response) {
        console.log('!!! response', response.data.data);
        // const p = JSON.parse(response.data.data);
        const p = response.data.data;
        alert(
          `CARRIER - ${p.CARRIER} | CN_NUMBER - ${p.CN_NUMBER} | CUSTOMER_REFERENCE - ${p.CUSTOMER_REFERENCE} | STATUS - ${p.STATUS} `
        );
      })
      .catch((error) => {
        console.log('API error in createOrderInTLM :::::', error);
        // setLoader(false);
      })
      .finally(() => {});
  };
  // body starts here
  return (
    <>
      {isDataLoading ? (
        <div className={styles.spinner}>
          {' '}
          <Spin />{' '}
        </div>
      ) : (
        <Container fluid className={styles.ManageOrderWrapper}>
          <Alerts successAlert={successAlert} errorAlert={errorAlert} />
          <div className={styles.OrderTopHeader}>
            <div className={styles.OrderTextArea}>
              <span>
                <AddShoppingCartIcon
                  style={{fontSize: '15px', marginTop: '-4px'}}
                />{' '}
                Order # {orderDetails.externalReference}
              </span>{' '}
              <div className={styles.VrLine}></div>{' '}
              <span>
                <CalendarMonthIcon
                  style={{fontSize: '15px', marginTop: '-4px'}}
                />{' '}
                {date} {time}
              </span>
            </div>
            <div className={styles.OrderButtonsArea}>
              <Space style={{display: 'flex', gap: '4px'}}>
                <button
                  className={styles.BackButton}
                  onClick={handleBackButton}
                >
                  <ArrowBackIcon
                    style={{fontSize: '15px', marginTop: '-4px'}}
                  />{' '}
                  Back
                </button>
                {/* <button className={styles.Buttons}>
                  <ForwardToInboxIcon
                    style={{fontSize: '15px', marginTop: '-4px'}}
                  />{' '}
                  Send Email
                </button> */}
                <button className={styles.Buttons}>
                  <RedeemIcon style={{fontSize: '15px', marginTop: '-4px'}} />{' '}
                  Credit Memo
                </button>
                <button className={styles.Buttons}>
                  <ShoppingCartCheckoutIcon
                    style={{fontSize: '15px', marginTop: '-4px'}}
                  />{' '}
                  Re-Order
                </button>
                <button className={styles.Buttons} onClick={createOrderInTLM}>
                  Create Order in TLM
                </button>
              </Space>
            </div>
          </div>
          <div className={styles.OrderContainerBox}>
            <Grid container display={'row'} spacing={3}>
              <Grid item xs={12} md={6} lg={6}>
                <div className={styles.ItemBoxes}>
                  <div className={styles.Header}>
                    Order # {orderDetails.externalReference}
                  </div>
                  <div className={styles.ContentBody}>
                    <div className={styles.ListItem}>
                      <div className={styles.ItemLabel}>
                        <span>Order Date</span>
                      </div>
                      <div className={styles.ItemValue}>
                        <strong>
                          {date} {time}
                        </strong>
                      </div>
                    </div>
                    <div className={styles.ListItem}>
                      <div className={styles.ItemLabel}>
                        <span>Order Status</span>
                      </div>
                      <div className={styles.ItemValue}>
                        <strong>{orderDetails.status}</strong>
                      </div>
                    </div>
                    <div className={styles.ListItem}>
                      <div className={styles.ItemLabel}>
                        <span>Purchase From</span>
                      </div>
                      <div className={styles.ItemValue}>
                        <strong>Abc, VVFFG, JKHKJHKJHKJ,KLJLJ</strong>
                      </div>
                    </div>
                    <div className={styles.ListItem}>
                      <div className={styles.ItemLabel}>
                        <span>Placed From IP</span>
                      </div>
                      <div className={styles.ItemValue}>
                        <strong>48.155.4555.04</strong>
                      </div>
                    </div>
                    <div className={styles.ListItem}>
                      <div className={styles.ItemLabel}>
                        <span>ERP Number</span>
                      </div>
                      <Row
                        gutter={{
                          xs: 8,
                          sm: 16,
                          md: 24,
                          lg: 32,
                        }}
                      >
                        {/* zxc */}
                        <Col className="gutter-row" span={12}>
                          <Input
                            placeholder="ERP number"
                            type="text"
                            value={erpNumber}
                            onChange={handleErpNumberChange}
                            allowClear
                            required
                            disabled={isErpDisabled}
                          />
                        </Col>
                        <Col className="gutter-row">
                          <Button onClick={() => setIsErpDisabled(false)}>
                            <EditTwoTone />
                          </Button>
                        </Col>
                        <Col className="gutter-row">
                          <Button
                            onClick={updateErpNumber}
                            loading={submitLoading}
                          >
                            Update
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <div className={styles.ItemBoxes}>
                  <div className={styles.Header}>Account Information</div>
                  <div className={styles.ContentBody}>
                    <div className={styles.ListItem}>
                      <div className={styles.ItemLabel}>
                        <span>Customer Name</span>
                      </div>
                      <div
                        className={styles.ItemValue}
                        style={{color: '#f6870e'}}
                      >
                        <strong>
                          {orderDetails.customerFName}{' '}
                          {orderDetails.customerLName}
                        </strong>
                      </div>
                    </div>
                    <div className={styles.ListItem}>
                      <div className={styles.ItemLabel}>
                        <span>Email</span>
                      </div>
                      <div
                        className={styles.ItemValue}
                        style={{color: '#f6870e'}}
                      >
                        <strong>{orderDetails.customerEmail}</strong>
                      </div>
                    </div>
                    <div className={styles.ListItem}>
                      <div className={styles.ItemLabel}>
                        <span>Phone Number</span>
                      </div>
                      <div
                        className={styles.ItemValue}
                        style={{color: '#f6870e'}}
                      >
                        <strong>{orderDetails.customerPhone}</strong>
                      </div>
                    </div>
                    <div className={styles.ListItem}>
                      <div className={styles.ItemLabel}>
                        <span>Customer Group</span>
                      </div>
                      <div
                        className={styles.ItemValue}
                        style={{color: 'black'}}
                      >
                        <strong>General</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <div className={styles.ItemBoxes}>
                  <div
                    className={styles.Header}
                    style={{display: 'flex', justifyContent: 'space-between'}}
                  >
                    <span>Billing Address</span>{' '}
                    <span style={{cursor: 'pointer'}}>Edit</span>
                  </div>
                  <div className={styles.ContentBody}>
                    <p>
                      {orderDetails.billingAddressStreet}{' '}
                      {/* {orderDetails.deliveryAddressSuburb},{' '}
                      {orderDetails.deliveryAddressState},{' '}
                      {orderDetails.deliveryAddressCountry},{' '}
                      {orderDetails.deliveryAddressPostcode} */}
                    </p>
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <div className={styles.ItemBoxes}>
                  <div
                    className={styles.Header}
                    style={{display: 'flex', justifyContent: 'space-between'}}
                  >
                    <span>Shipping Address</span>{' '}
                    <span style={{cursor: 'pointer'}}>Edit</span>
                  </div>
                  <div className={styles.ContentBody}>
                    <p>{orderDetails.deliveryAddressStreet}</p>
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <div className={styles.ItemBoxes}>
                  <div className={styles.Header}>Payment Information</div>
                  <div className={styles.ContentBody}>
                    <p>
                      Voucher Name:{' '}
                      {orderDetails.voucherName
                        ? orderDetails.voucherName
                        : 'NA'}
                      <br />
                      Voucher Amount :
                      {orderDetails.voucherDiscountAmount
                        ? orderDetails.voucherDiscountAmount
                        : 'NA'}
                      <br />
                      Credit Amount:{' '}
                      {orderDetails.creditAmount
                        ? orderDetails.creditAmount
                        : 'NA'}
                      <br />
                      Payment Method: {paymentDetails.map((pd) => pd.method)}
                      {/* {orderDetails.deliveryAddressStreet} */}
                    </p>
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <div className={styles.ItemBoxes}>
                  <div className={styles.Header}>
                    Shipping & Heading Information
                  </div>
                  <div className={styles.ContentBody}>
                    <p>
                      <strong> Shipping ETA: </strong>
                      {orderDetails.shippingOption.eta}
                      <br />
                      <strong>Shipping Cost: </strong>$
                      {orderDetails.shippingOption.cost}
                      <br />
                      <strong>Shipping Carrier: </strong>
                      {orderDetails.shippingOption.carrier}
                      <br />
                      <strong>Shipping Service: </strong>
                      {orderDetails.shippingOption.service}
                      <br />
                      <strong>Shipping Fuel Levy: </strong>
                      {orderDetails.shippingOption.fuel_levy}
                    </p>
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} md={12} lg={12}>
                <div className={styles.ItemBoxes}>
                  <div className={styles.Header}>Items Ordered</div>
                  <div className={styles.ContentBody}>
                    <TableContainer>
                      <Table
                        sx={{minWidth: 650}}
                        size="small"
                        aria-label="a dense table"
                      >
                        <TableHead
                          style={{
                            background: '#d3d3d361',
                          }}
                        >
                          <TableRow>
                            <TableCell component={'th'}>Product</TableCell>
                            <TableCell component={'th'} align="center">
                              Status
                            </TableCell>
                            <TableCell component={'th'} align="right">
                              Original Price
                            </TableCell>
                            <TableCell component={'th'} align="right">
                              Price
                            </TableCell>
                            <TableCell component={'th'} align="right">
                              Qty
                            </TableCell>
                            <TableCell component={'th'} align="left">
                              Qty Already Shipped
                            </TableCell>
                            <TableCell component={'th'} align="left">
                              Qty Shipped
                            </TableCell>
                            <TableCell component={'th'} align="left">
                              Qty Pending
                            </TableCell>
                            <TableCell component={'th'} align="right">
                              Subtotal
                            </TableCell>
                            <TableCell component={'th'} align="left">
                              Tax Amount
                            </TableCell>
                            <TableCell component={'th'} align="left">
                              Tax Percent
                            </TableCell>
                            <TableCell component={'th'} align="left">
                              Discount Amount
                            </TableCell>
                            <TableCell component={'th'} align="right">
                              Row Total
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {itemDetails.map((item, index) => (
                            <TableRow
                              sx={{
                                '&:last-child td, &:last-child th': {border: 0},
                              }}
                              key={index}
                            >
                              <TableCell component="th" scope="row">
                                {item.productName == 'Custom Lead'
                                  ? `${item.productName} ( ${item.productID})`
                                  : item.productName}
                              </TableCell>
                              <TableCell align="right">
                                {orderDetails.status}
                              </TableCell>
                              <TableCell align="right">
                                ${item.itemOriginalPrice.toFixed(2)}
                              </TableCell>
                              <TableCell align="right">
                                ${item.itemPrice.toFixed(2)}
                              </TableCell>
                              <TableCell align="right">
                                {item.quantity}
                              </TableCell>
                              <TableCell align="right">
                                <InputNumber
                                  disabled
                                  value={
                                    item.qtyAlreadyShipped
                                      ? item.qtyAlreadyShipped
                                      : 0
                                  }
                                ></InputNumber>
                              </TableCell>
                              {/* i2 bookmark */}
                              <TableCell align="center">
                                <div>(Stock = {item.stock})</div>
                                <InputNumber
                                  disabled={
                                    item.quantity - item.qtyAlreadyShipped ==
                                      0 || item.stock == 0
                                  }
                                  name={item.id}
                                  min={0}
                                  // max={item.quantity - item.qtyAlreadyShipped}
                                  max={
                                    item.stock <
                                    item.quantity - item.qtyAlreadyShipped
                                      ? item.stock
                                      : item.quantity - item.qtyAlreadyShipped
                                  }
                                  value={item.qtyShipped ? item.qtyShipped : 0}
                                  // value={
                                  //   item.qtyAlreadyShipped == item.quantity
                                  //     ? 0
                                  //     : item.qtyShipped
                                  // }
                                  // value={item.qtyShipped}
                                  // value={0}
                                  onChange={(e) =>
                                    handleqtyShippedChange(e, item.id)
                                  }
                                  size="small"
                                  onBlur={handleBlurShippedChange}
                                  // addonAfter={'Stock =' + item.stock}
                                ></InputNumber>
                              </TableCell>
                              <TableCell align="center">
                                <InputNumber
                                  disabled
                                  value={
                                    item.quantity -
                                      (item.qtyAlreadyShipped +
                                        item.qtyShipped) <
                                    0
                                      ? 0
                                      : item.quantity -
                                        (item.qtyAlreadyShipped +
                                          item.qtyShipped)
                                  }
                                ></InputNumber>
                              </TableCell>
                              <TableCell align="right">
                                ${item.lineItemTotalPrice.toFixed(2)}
                              </TableCell>
                              <TableCell align="right">
                                ${item.discountAmount}
                              </TableCell>
                              <TableCell align="right">
                                {item.discountPercentage}%
                              </TableCell>
                              <TableCell align="right">
                                ${item.discountAmount}
                              </TableCell>
                              <TableCell align="right">
                                ${item.lineItemTotalPrice.toFixed(2)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <div className={styles.ItemBoxes}>
                  <div className={styles.Header}>Comment History</div>
                  <div className={styles.ContentBody}>
                    <p>Add Order Comments</p>
                    <Grid container direction={'row'}>
                      <Grid item sm={6}>
                        <div className={styles.Label}>Status</div>
                        <select
                          onChange={handleStatusChange}
                          defaultValue={'Pending'}
                          style={{padding: '4px'}}
                        >
                          <option value={'Pending'}>Pending</option>
                          <option value={'Awaiting Payment'}>
                            Awaiting Payment
                          </option>
                          <option value={'Awaiting Fulfillment'}>
                            Awaiting Fulfillment
                          </option>
                          <option value={'Awaiting Shipment'}>
                            Awaiting Shipment
                          </option>
                          <option value={'Awaiting Pickup'}>
                            Awaiting Pickup
                          </option>
                          <option value={'Partially Shipped'}>
                            Partially Shipped
                          </option>
                          <option value={'Completed'}>Completed</option>
                          <option value={'Shipped'}>Shipped</option>
                          <option value={'Cancelled'}>Cancelled</option>
                          <option value={'Declined'}>Declined</option>
                          <option value={'Refunded'}>Refunded</option>
                          <option value={'Disputed'}>Disputed</option>
                          <option value={'Manual Verification Required'}>
                            Manual Verification Required
                          </option>
                          <option value={'Partially Refunded'}>
                            Partially Refunded
                          </option>
                          <option value={'Customer Pickup'}>
                            Customer Pickup
                          </option>
                        </select>
                      </Grid>
                      <Grid item sm={6}>
                        <div className={styles.Label} style={{padding: '3px'}}>
                          <span> Tracking Number</span>
                          <br />
                          {status === 'Shipped' ||
                          status === 'Partially Shipped' ? (
                            <div>
                              <input
                                type="text"
                                className={styles.trackingNumberInput}
                                style={{border: 'solid 1px #747171'}}
                                disabled={
                                  status === 'Shipped' ||
                                  status === 'Partially Shipped'
                                    ? false
                                    : true
                                }
                                value={trackingNumber}
                                onChange={handleTrackingNumberChange}
                              />
                            </div>
                          ) : (
                            <Tooltip
                              title="Enabled when status is shipped"
                              color="green"
                            >
                              <div>
                                <input
                                  type="text"
                                  className={styles.trackingNumberInput}
                                  style={{border: 'solid 1px #747171'}}
                                  disabled={
                                    status === 'Shipped' ||
                                    status === 'Partially Shipped'
                                      ? false
                                      : true
                                  }
                                  value={trackingNumber}
                                  onChange={handleTrackingNumberChange}
                                />
                              </div>
                            </Tooltip>
                          )}
                        </div>
                      </Grid>
                    </Grid>

                    <div className={styles.StatusLabel}>Comment</div>
                    <textarea
                      rows={4}
                      style={{width: '100%'}}
                      onChange={handleCommentChange}
                    ></textarea>
                    <div className={styles.boxContainer}>
                      <span>
                        {' '}
                        <input
                          type={'checkbox'}
                          onChange={toggleIsNotifyCustomerChange}
                          defaultValue={0}
                        />{' '}
                        Notify Customer by Email
                      </span>
                      {isDisableSubmit ? (
                        <Tooltip
                          title={disableSubmitType}
                          color="red"
                          placement="right"
                        >
                          <Button
                            onClick={handleSubmitComment}
                            loading={submitLoading}
                            disabled
                          >
                            <CheckCircleOutlineIcon
                              style={{fontSize: '15px', marginTop: '-4px'}}
                            />{' '}
                            Submit Comment
                          </Button>
                        </Tooltip>
                      ) : (
                        <Button
                          onClick={handleSubmitComment}
                          loading={submitLoading}
                        >
                          <CheckCircleOutlineIcon
                            style={{fontSize: '15px', marginTop: '-4px'}}
                          />{' '}
                          Submit Comment
                        </Button>
                      )}
                      {/* <Button
                        onClick={handleSubmitComment}
                        loading={submitLoading}
                      >
                        <CheckCircleOutlineIcon
                          style={{fontSize: '15px', marginTop: '-4px'}}
                        />{' '}
                        Submit Comment
                      </Button> */}
                    </div>
                    {/* <div className={styles.box1}>
                      <span>
                        {' '}
                        <input
                          type={'checkbox'}
                          onChange={toggleIsVisibleFrontendChange}
                          defaultValue={0}
                        />{' '}
                        Visible on Frontend
                      </span>
                    </div> */}
                  </div>
                  {orderLogsArray.map((item, index) =>
                    item && index == undefined ? null : (
                      <>
                        <div
                          className={styles.OrderDetails}
                          key={index}
                          id="orderLogsList"
                          // ref={orderLogsListFocus}
                          // tabIndex={orderLogsListFocus}
                        >
                          <span>
                            <InsertDriveFileIcon className={styles.Icons} />
                          </span>
                          <div className={styles.OrderDetailsText}>
                            <span>
                              {item.date} {item.time}
                            </span>
                            | <strong>{item.status}</strong>
                            <br />
                            <label>
                              Customer{' '}
                              {item.isNotifyCustomer ? (
                                <span>
                                  {' '}
                                  Notified{' '}
                                  <DoneIcon
                                    style={{
                                      fontSize: '19px',
                                      marginTop: '-3px',
                                    }}
                                  />{' '}
                                </span>
                              ) : (
                                <span>Not Notified</span>
                              )}
                            </label>
                            <br />
                            <div
                              style={{
                                marginTop: '-12px',
                              }}
                            >
                              {' '}
                              <span
                                style={{
                                  fontSize: '19px',
                                }}
                              >
                                {'Comments =>'}
                              </span>{' '}
                              {item.comment}
                            </div>
                            <div
                              style={{
                                marginTop: '-6px',
                              }}
                            >
                              {' '}
                              <span
                                style={{
                                  fontSize: '19px',
                                }}
                              >
                                {'Tracking Number =>'}
                              </span>{' '}
                              {item.trackingNumber ? item.trackingNumber : 'NA'}
                            </div>
                          </div>
                        </div>
                      </>
                    )
                  )}
                  {/* order logs array end */}
                </div>
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <div className={styles.ItemBoxes}>
                  <div className={styles.Header}>Order Totals</div>
                  <div
                    className={styles.ContentBody}
                    style={{background: 'lightyellow'}}
                  >
                    <div className={styles.OrderTotalsBox}>
                      <div className={styles.OrderTotals}>
                        <span className={styles.TextValue}>
                          $
                          {(
                            parseFloat(orderDetails.totalAmount) +
                            parseFloat(
                              orderDetails.voucherDiscountAmount
                                ? orderDetails.voucherDiscountAmount
                                : 0
                            ) +
                            parseFloat(
                              orderDetails.creditAmount
                                ? orderDetails.creditAmount
                                : 0
                            )
                          ).toFixed(2)}
                        </span>
                        <span className={styles.TextLabel}>Subtotal</span>
                      </div>
                      <div className={styles.OrderTotals}>
                        <span className={styles.TextValue}>
                          ${parseFloat(orderDetails.deliveryCharge).toFixed(2)}
                        </span>
                        <span className={styles.TextLabel}>
                          Shipping & Handling
                        </span>
                      </div>
                      <div className={styles.OrderTotals}>
                        <span className={styles.TextValue}>
                          $
                          {parseFloat(
                            orderDetails.voucherDiscountAmount
                              ? orderDetails.voucherDiscountAmount
                              : 0
                          ).toFixed(2)}{' '}
                          -
                        </span>
                        <span className={styles.TextLabel}>
                          Voucher Discount Amount
                        </span>
                      </div>
                      <div className={styles.OrderTotals}>
                        <span className={styles.TextValue}>
                          $
                          {parseFloat(
                            orderDetails.creditAmount
                              ? orderDetails.creditAmount
                              : 0
                          ).toFixed(2)}{' '}
                          -
                        </span>
                        <span className={styles.TextLabel}>
                          Credit Amount Used (if Applicable)
                        </span>
                      </div>
                      <div className={styles.OrderTotals}>
                        <span
                          className={styles.TextValue}
                          style={{color: '#f6870e'}}
                        >
                          ${parseFloat(orderDetails.grandTotal).toFixed(2)}
                        </span>
                        <span
                          className={styles.TextLabel}
                          style={{
                            color: '#000000',
                            fontWeight: '600',
                            fontSize: '13px',
                          }}
                        >
                          Grand Total
                        </span>
                      </div>
                      <div className={styles.OrderTotals}>
                        <span
                          className={styles.TextValue}
                          style={{color: '#f6870e'}}
                        >
                          ${parseFloat(orderDetails.grandTotal).toFixed(2)}
                        </span>
                        <span
                          className={styles.TextLabel}
                          style={{
                            color: '#000000',
                            fontWeight: '600',
                            fontSize: '13px',
                          }}
                        >
                          Total Paid
                        </span>
                      </div>
                      <div className={styles.OrderTotals}>
                        <span
                          className={styles.TextValue}
                          style={{color: '#f6870e'}}
                        >
                          $0.00
                        </span>
                        <span
                          className={styles.TextLabel}
                          style={{
                            color: '#000000',
                            fontWeight: '600',
                            fontSize: '13px',
                          }}
                        >
                          Total Refunded
                        </span>
                      </div>
                      <div className={styles.OrderTotals}>
                        <span
                          className={styles.TextValue}
                          style={{color: '#f6870e'}}
                        >
                          $0.00
                        </span>
                        <span
                          className={styles.TextLabel}
                          style={{
                            color: '#000000',
                            fontWeight: '600',
                            fontSize: '13px',
                          }}
                        >
                          Total Due
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Grid>
            </Grid>
          </div>
        </Container>
      )}
    </>
  );
}

export default OrderDetails;
