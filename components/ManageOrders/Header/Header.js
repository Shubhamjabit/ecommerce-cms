import React, {useState, useEffect, useReducer, Component, useRef} from 'react';
import {Card, Col, Row, Input, Select, Button, Spin} from 'antd';
import {PlusOutlined, PrinterOutlined} from '@ant-design/icons';
import stlyes from './Header.module.scss';
import {cmsendPoint, envUrl} from '../../../utils/factory';
import axios from 'axios';
import Excelexport from '../ManageOrdersTable/components/Excelexport';
import {jsPDF} from 'jspdf';
import html2canvas from 'html2canvas';
import autoTable from 'jspdf-autotable';
import Pick_List_Template from './Pick_List_Template';
// import jsPDFInvoiceTemplate from 'jspdf-invoice-template';
import importScript from '../../../customHooks';
import {
  PDFViewer,
  PDFDownloadLink,
  Page,
  Text,
  View,
} from '@react-pdf/renderer';
import {useSelector} from 'react-redux';
import pickList from '../components/pickList';
import moment from 'moment-timezone';
import PrintIcon from '@mui/icons-material/Print';
import ReactToPrint from 'react-to-print';
import {Radio} from 'antd';

const Header = ({
  showModal,
  ordersList,
  setOrdersList,
  originalList,
  isOrdersList,
  setPagination,
  setOrdersListTotal,
}) => {
  console.log('sssssssss delInsvalue', delInsvalue);

  console.log('********************', ordersList);
  // console.log('$$$$$$$$$$$$$$$$$$$$$$$$ exportData', exportData);
  console.log('============================ originalList', originalList);
  // console.log('++++++++++++++111 orderDetails', orderDetails);
  // console.log('++++++++++++++222 itemDetails', itemDetails);
  // console.log('++++++++++++++333 isOrdersList', isOrdersList);
  // const input = document.getElementById('element-to-print');
  // console.log('INPUT', input);
  const [exportData, setExportData] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [delInsvalue, setDelInsValue] = useState(0);
  const reportTemplateRef = useRef(null);
  const orderDetails = useSelector((state) => state.orderReducer.orderDetails);
  const itemDetails = useSelector((state) => state.orderReducer.itemDetails);
  const componentRef = useRef();

  const getExportProductData = async () => {
    {
      try {
        const data = await axios
          .get(`${envUrl.baseUrl}${cmsendPoint.getexportOrderList}`, {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
          })
          .then((data) => {
            // setData(data);
            setExportData(data.data.data.productsexportlistdata.data);
            return {state: true, message: 'sucess'};
          });
      } catch (error) {
        console.log('error signIn:', error.message);
        return {state: false, message: error.message};
      }
    }
  };

  useEffect(() => {
    getExportProductData();
  }, []);

  const handleSearchTextChange = (e) => {
    // Access input value
    const query = e.target.value;
    // Create copy of item list
    // var updatedList = [...originalList];
    var updatedList = [...ordersList];
    // Include all elements which includes the search query
    updatedList = originalList.filter((item) => {
      return (
        item.externalReference.toLowerCase().indexOf(query.toLowerCase()) !==
          -1 || item.erpNumber.toLowerCase().indexOf(query.toLowerCase()) !== -1
      );
    });
    // Trigger render with updated values
    setOrdersList(updatedList);
    if (query == '') {
      setOrdersList(originalList);
    }
    setSearchText(query);
  };

  const handleStatusSearchChange = (value) => {};

  const handleStatusChange = (value) => {
    // Access input value
    const query = value;
    // console.log(query);
    let finalOrderList = [];
    // Create copy of item list
    var updatedList = [...originalList];
    // logic for returning list on basis of query array
    query.forEach(async (ele) => {
      // console.log(ele);
      updatedList = [...originalList];
      updatedList = updatedList.filter((item) => {
        return item.status.indexOf(ele) == 0;
      });
      // console.log('!!!', updatedList[0]);
      if (updatedList.length == 0) {
        return;
      } else {
        if (updatedList.length > 0) {
          for (let i = 0; i < updatedList.length; i++) {
            finalOrderList.push(updatedList[i]);
          }
        } else {
          finalOrderList.push(updatedList[0]);
        }
      }
    });
    // Trigger render with updated values
    setOrdersList(finalOrderList);
    if (query == '') {
      setOrdersList(originalList);
    }
  };

  const printDate = (date) => {
    if (date) {
      // let t = orderDetails.createdDate;
      let t = moment(date.split('T')[0]).format('Do MMM YYYY');
      // console.log(t.split('T')[0]);
      return t;
    }
  };
  function printTable() {
    return (
      <>
        {itemDetails.map((item, index) => (
          <tr key={index}>
            <td style={{border: 'solid 2px', textAlign: 'center'}}>
              {index + 1}
            </td>
            <td style={{border: 'solid 2px'}}>{item.productName}</td>
            <td style={{border: 'solid 2px'}}>{item.productName}</td>
            <td style={{border: 'solid 2px'}}>{item.productName}</td>
            <td style={{border: 'solid 2px', textAlign: 'center'}}>
              {item.quantity}
            </td>
            <td style={{border: 'solid 2px', textAlign: 'center'}}>
              {item.qtyAlreadyShipped ? item.qtyAlreadyShipped : '0'}
            </td>
            <td style={{border: 'solid 2px', textAlign: 'center'}}>
              {item.qtyShipped ? item.qtyShipped : '0'}
            </td>
            <td style={{border: 'solid 2px', textAlign: 'center'}}>
              {item.quantity - (item.qtyAlreadyShipped + item.qtyShipped)}
            </td>
          </tr>
        ))}
      </>
    );
  }

  const onChangeDelIns = (e) => {
    setDelInsValue(e.target.value);
    if (e.target.value != 0) {
      var newArray = originalList.filter((item) => {
        return item.delivery_instructions == e.target.value;
      });
      console.log('trigerrrrrrrr', e.target.value, newArray);

      setOrdersListTotal(newArray.length);
      setOrdersList(newArray);
    } else {
      setOrdersListTotal(originalList.length);
      setOrdersList(originalList);
    }
  };

  return (
    <>
      <Row className={stlyes.mainRow} id="header-row">
        {isOrdersList ? (
          <Col span={5}>
            <p className={stlyes.topLittle}>Manage Orders</p>
          </Col>
        ) : (
          <Col span={17}>
            <p className={stlyes.topLittle}>Manage Orders</p>
          </Col>
        )}

        {isOrdersList ? (
          <Col span={5} className={stlyes.searchInput}>
            <Input
              placeholder="Search order id or erp number"
              value={searchText}
              onChange={handleSearchTextChange}
              allowClear
            />
          </Col>
        ) : null}
        {isOrdersList ? (
          <Col span={7} className={stlyes.searchInput}>
            <Select
              mode="multiple"
              allowClear
              showSearch
              onSearch={handleStatusSearchChange}
              onChange={handleStatusChange}
              placeholder="Search status"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={[
                {
                  value: 'Pending',
                  label: 'Pending',
                },
                {
                  value: 'Awaiting Payment',
                  label: 'Awaiting Payment',
                },
                {
                  value: 'Awaiting Fulfillment',
                  label: 'Awaiting Fulfillment',
                },
                {
                  value: 'Awaiting Shipment',
                  label: 'Awaiting Shipment',
                },
                {
                  value: 'Awaiting Pickup',
                  label: 'Awaiting Pickup',
                },
                {
                  value: 'Partially Shipped',
                  label: 'Partially Shipped',
                },
                {
                  value: 'Completed',
                  label: 'Completed',
                },
                {
                  value: 'Shipped',
                  label: 'Shipped',
                },
                {
                  value: 'Cancelled',
                  label: 'Cancelled',
                },
                {
                  value: 'Declined',
                  label: 'Declined',
                },
                {
                  value: 'Refunded',
                  label: 'Refunded',
                },
                {
                  value: 'Disputed',
                  label: 'Disputed',
                },
              ]}
              style={{
                width: '100%',
              }}
            />
          </Col>
        ) : null}
        {isOrdersList ? null : (
          <Col
            span={3}
            className={stlyes.addProductButton}
            style={{display: 'flex'}}
          >
            <ReactToPrint
              documentTitle={`Pick-List-${
                orderDetails.externalReference
              }-${moment()}`}
              trigger={() => (
                <Button
                  type="submit"
                  title="Pick-List"
                  disabled={isOrdersList}
                  icon={<PrinterOutlined />}
                >
                  Print Pick List
                </Button>
              )}
              content={() => componentRef.current}
            />
          </Col>
        )}

        <Col
          span={4}
          className={stlyes.addProductButton}
          style={{display: 'flex'}}
        >
          <Excelexport
            excelData={exportData}
            fileName={'OrderListDetails'}
            stlyes={stlyes}
          />
        </Col>
        {isOrdersList ? (
          <Row style={{paddingBottom: '1%', paddingLeft: '60%'}}>
            <Radio.Group
              defaultValue={0}
              buttonStyle="solid"
              onChange={onChangeDelIns}
              value={delInsvalue}
            >
              <Radio.Button value={0}>All Orders</Radio.Button>
              <Radio.Button value={1}>Single Shipment Orders</Radio.Button>
              <Radio.Button value={2}>Multiple Shipment Orders</Radio.Button>
              {/* <Radio.Button value="d">Chengdu</Radio.Button> */}
            </Radio.Group>
          </Row>
        ) : null}
      </Row>

      {/* PDF STARTS */}
      <div style={{display: 'none'}}>
        <div
          className="Wrapper"
          style={{width: '100%', margin: 'auto', height: 'auto', fontSize: 14}}
          id="head-div"
          ref={componentRef}
        >
          <div
            className="top-container"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div
              className="PickListLogo"
              style={{width: '50%', marginBottom: '5%'}}
            >
              <img
                src="https://tricabtstbucket.blob.core.windows.net/bannerimages/0913a7fa-7181-49c4-9b08-d1d6f10fe7df.png"
                height={150}
                width={150}
              />
            </div>
            <div className="info" style={{width: '100%'}}>
              <p
                style={{
                  width: '60%',
                  textAlign: 'left',
                  marginTop: 15,
                  // lineHeight: 15,
                }}
              >
                <span>Sparky Warehouse Australia Pty Ltd </span> <br />
                <span>57-61 Freight Drive</span> <br />
                <span>SOMERTON VIC AU 3062</span> <br />
                <span>T +61</span> <br />
                <span>sales@sparkywarehouse.com.au</span> <br />
                <span>T + 61 3 9081 5202</span> <br />
                <span>ACN 636 536 082</span> <br />
                <span>ABN 50 636 536 082</span> <br />
              </p>
            </div>
            <div
              className="order-info"
              style={{width: '100%', marginTop: '5%'}}
            >
              <h4
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  marginBottom: 10,
                  textAlign: 'left',
                }}
              >
                PICK LIST{' '}
                <span id="externalReference">
                  {orderDetails.externalReference}
                </span>
              </h4>
              <div
                className="order-box"
                style={{
                  width: 'calc(100% - 50px)',
                  border: 'solid 1px black',
                  padding: '10px 25px',
                }}
              >
                <div
                  className="text-info"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 10,
                  }}
                >
                  <label>Printed :</label>
                  <span>{moment().format('Do MMM YYYY')}</span>
                </div>
                <div
                  className="text-info"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 10,
                  }}
                >
                  <label>PO Ref :</label>
                  <span></span>
                </div>
                <div
                  className="text-info"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 10,
                  }}
                >
                  <label>Cust Code :</label>
                  <span>RDGELE</span>
                </div>
                <div
                  className="text-info"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 10,
                  }}
                >
                  <label>Order Date :</label>
                  <span id="createdDate">
                    {printDate(orderDetails.createdDate)}
                  </span>
                </div>
                <div
                  className="text-info"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 10,
                  }}
                >
                  <label>Entered By :</label>
                  <span>VinodM</span>
                </div>
                <div
                  className="text-info"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 10,
                  }}
                >
                  <label>Dispatched By :</label>
                  <span>
                    <strong>15 May 2023</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <div className="cust-details" style={{display: 'center'}}>
              <div style={{width: '40%'}}>
                <span style={{fontWeight: 'bold', textDecoration: 'underline'}}>
                  Customer Details :
                </span>
              </div>
              <p style={{marginTop: 5, width: '40%'}}>
                <span>
                  Attn : {orderDetails.customerFName}{' '}
                  {orderDetails.customerLName}
                </span>
                <br />
                <span>{orderDetails.deliveryAddressStreet}</span>
              </p>
            </div>
            <div className="cust-details" />
            <div className="cust-details" />
          </div>
          <div className="dispatch-instruction">
            <span style={{fontWeight: 'bold'}}>Dispatch Instruction:</span>
            <div
              style={{
                border: 'solid 2px lightgray',
                marginTop: 10,
                width: '100%',
              }}
            >
              <ul>
                <li style={{listStyleType: 'square', marginBottom: 8}}>
                  {orderDetails.delivery_instructions == 1
                    ? 'Wait until all items are in stock (1 shipment)'
                    : 'Send items as they become available. (Multiple Shipments)'}
                </li>
                <li style={{listStyleType: 'square'}}>
                  {/* Use the best shipping option – Not Urgent */}
                  {orderDetails.shippingOption &&
                    orderDetails.shippingOption.carrier}{' '}
                  , $
                  {orderDetails.shippingOption &&
                    orderDetails.shippingOption.cost}{' '}
                  ,
                  {orderDetails.shippingOption &&
                    orderDetails.shippingOption.eta}{' '}
                  day(s)
                </li>
              </ul>
            </div>
          </div>
          <div className="table-info" style={{marginTop: 15}}>
            <table
              style={{
                border: 'solid 2px',
                borderCollapse: 'collapse',
                width: '100%',
              }}
              cellPadding={5}
              id="table"
            >
              <thead style={{background: 'lightgray'}}>
                <tr>
                  <th style={{border: 'solid 2px'}}>Item</th>
                  <th style={{border: 'solid 2px'}}>Sparky ID</th>
                  <th style={{border: 'solid 2px'}}>Product ID</th>
                  <th style={{border: 'solid 2px'}}>Product Description</th>
                  <th style={{border: 'solid 2px'}}>Quantity Ordered (Pack)</th>
                  <th style={{border: 'solid 2px'}}>
                    Quantity Already Shipped (Pack)
                  </th>
                  <th style={{border: 'solid 2px'}}>Quantity Shipped (Pack)</th>
                  <th style={{border: 'solid 2px'}}>Quantity Pending (Pack)</th>
                </tr>
              </thead>
              <tbody id="table-body">
                {printTable()}
                {/* {itemDetails.map((item, index) => (
                <tr key={index}>
                  <td style={{border: 'solid 2px'}}>{index}</td>
                  <td style={{border: 'solid 2px'}}>{item.productName}</td>
                  <td style={{border: 'solid 2px'}}>{item.productName}</td>
                  <td style={{border: 'solid 2px'}}>{item.productName}</td>
                  <td style={{border: 'solid 2px'}}>{item.quantity}</td>
                  <td style={{border: 'solid 2px'}}>
                    {item.numberFulfilled ? item.numberFulfilled : '0'}
                  </td>
                  <td style={{border: 'solid 2px'}}>
                    {item.quantity} - {item.numberFulfilled}
                  </td>
                </tr>
              ))} */}
              </tbody>
            </table>
          </div>
          <br />
          <br />
          <br />
          <br />
          <br />
          <div
            className="bottom-info"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '80%',
              margin: 'auto',
            }}
          >
            <div className="left-info">
              <strong>DELIVER TO :</strong>
              <p
                style={{
                  width: '40%',
                  // lineHeight: 24,
                }}
              >
                {orderDetails.deliveryAddressStreet}
              </p>
            </div>
            <div className="right-info">
              <div style={{marginBottom: 5}}>
                <strong>Carrier:</strong>{' '}
                <span>{orderDetails.shippingOption?.carrier}</span>
              </div>
              <div>
                <strong>Weight:</strong>{' '}
                <span>{orderDetails.total_weight}Kg</span>
              </div>
            </div>
          </div>
          <div
            className="contact-info"
            style={{display: 'flex', gap: 100, marginTop: 20}}
          >
            <div className="left-info">
              <strong>Contact on delivery: </strong>
              <br />
              <div className="info" style={{display: 'flex', gap: 40}}>
                <label>Name :</label>{' '}
                <span>
                  {orderDetails.customerFName} {orderDetails.customerLName}
                </span>
              </div>
              <div className="info" style={{display: 'flex', gap: 40}}>
                <label>T/M :</label> <span>{orderDetails.customerMobile} </span>
              </div>
            </div>
            <div className="right-info">
              <strong>Delivery Instruction: </strong>
              <br />
              <div className="box-info" style={{border: 'solid 2px'}}>
                <ul style={{padding: '0 25px'}}>
                  <li style={{listStyleType: 'square'}}>
                    Please delivery to Gate No. 15 at the back of the warehouse
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div
            className="bottom-text"
            style={{width: '85%', margin: 'auto', marginTop: 20}}
          >
            <p
              style={{
                width: '90%',
                margin: 'auto',
                borderTop: 'solid 1px',
                padding: 10,
              }}
            >
              <i>
                Certificate of Compliance- Sparky Warehouse Australia Pty Ltd
                certifies that all products shipped under this pack note were
                purchased solely from the original manufacturer or through the
                manufacturer’s authorized distribution. The original
                manufacturer warrants and certifies that the products they
                produce meet their specifications. Evidence of this warranty and
                certification is maintained at the manufacturer and/or at Sparky
                Warehouse Australia. This pack note is the Evidence of
                Conformity that this shipment meets the requirements of Sparky
                Warehouse Australia’s Quality Management System and/or Customer
                Purchase Order requirements agreed between Sparky Warehouse
                Australia and Customer.
              </i>
            </p>
            <div style={{marginTop: 10, textAlign: 'center'}}>
              <span style={{fontWeight: 'bold'}}>THANK YOU FOR YOUR ORDER</span>
              <br />
              <strong style={{fontWeight: 'bold', fontSize: 14}}>
                THIS ORDER IS SUBJECTED TO ALL TERMS AND CONDITIONS DISPLAYED
                AT: www.sparkywarehouse.com.au
              </strong>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
