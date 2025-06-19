import React, {useState, useEffect, useReducer, Component, useRef} from 'react';
import {Card, Col, Row, Input, Select, Button, Spin} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
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

const Header = ({
  showModal,
  ordersList,
  setOrdersList,
  originalList,
  isOrdersList,
}) => {
  const [exportData, setExportData] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const reportTemplateRef = useRef(null);
  const orderDetails = useSelector((state) => state.orderReducer.orderDetails);
  const itemDetails = useSelector((state) => state.orderReducer.itemDetails);
  importScript('https://unpkg.com/jspdf-invoice-template@1.4.0/dist/index.js');

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
    var updatedList = [...originalList];
    // Include all elements which includes the search query
    updatedList = updatedList.filter((item) => {
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

  let htmlString =
    '<!DOCTYPE html><html><body><p><b>This text is bold</b></p><p><i>This text is italic</i></p><p>This is<sub> subscript</sub> and <sup>superscript</sup></p></body></html>';

  const htmlStringToPdf = async (htmlString) => {
    let iframe = document.createElement('iframe');
    iframe.style.visibility = 'hidden';
    document.body.appendChild(iframe);
    let iframedoc = iframe.contentDocument || iframe.contentWindow.document;
    iframedoc.body.innerHTML = htmlString;

    let canvas = await html2canvas(iframedoc.body, {});

    // Convert the iframe into a PNG image using canvas.
    let imgData = canvas.toDataURL('image/png');

    // Create a PDF document and add the image as a page.
    const doc = new jsPDF({
      format: 'a4',
      unit: 'mm',
    });
    doc.addImage(imgData, 'PNG', 0, 0, 210, 297);

    // Get the file as blob output.
    let blob = doc.output('blob');
    doc.save('Pack_Note.pdf');

    // Remove the iframe from the document when the file is generated.
    document.body.removeChild(iframe);
  };

  const generatePDF = () => {
    let doc = new jsPDF();

    // document.getElementById('startDiv').style.display = 'block';
    // reportTemplateRef.current.style.display = 'block';
    // let doc = new jsPDF("p","pt","a4");
    // doc.html(reportTemplateRef.current, {
    //   callback: function (pdf) {
    //     pdf.save('Pick_List');
    //   },
    // });

    //////////////////////

    // let doc = new jsPDF({
    //   format: 'a4',
    //   unit: 'px',
    // });

    // doc.html(reportTemplateRef.current, {
    //   async callback(doc) {
    //     await doc.save('Pick_List');
    //   },
    // });

    // var img = new Image();
    // img.src = 'assets/img_01.png';
    // doc.addImage(img, 'png', 10, 78, 12, 15);

    let info = [];

    itemDetails.forEach((element, index, array) => {
      info.push([
        index + 1,
        // process.env.PRODUCT_CDN_URL + element.productImage,
        element.productImage,
        element.productName,
        element.quantity,
        element.quantity - element.numberFulfilled,
        element.numberFulfilled,
      ]);
    });

    doc.autoTable({
      head: [
        [
          'S/N.',
          'Image',
          'Product Description',
          'Ord Qty',
          'Back Order Qty',
          'Qty Supplied',
        ],
      ],
      body: info,
      /*
      didDrawCell: function (data) {
        if (data.column.index === 1) {
          // var td = data.cell.raw;
          // var img = td.getElementsByTagName('img')[0];
          // var dim = data.cell.height - data.cell.padding('vertical');
          // var textPos = data.cell.textPos;
          doc.addImage(
            process.env.CREDIT_FILES_CDN_URL + itemDetails.productImage
            // textPos.x,
            // textPos.y,
            // dim,
            // dim
          );
        }
      },
      */
    });

    /* sample

     let users = [
      {
        name: 'John',
        age: 25,
        country: 'New Zealand',
        col4: 'data',
        col5: 'data',
        col6: 'data',
        col7: 'data',
      },
      {
        name: 'Smith',
        age: 30,
        country: 'Australia',
        col4: 'data',
        col5: 'data',
        col6: 'data',
        col7: 'data',
      },
    ];

    users.forEach((element, index, array) => {
      info.push([
        element.name,
        element.age,
        element.country,
        element.col4,
        element.col5,
        element.col6,
        element.col7,
      ]);
    });

    doc.autoTable({
      head: [['Name', 'Age', 'Country', 'col4', 'col5', 'col6', 'col7']],
      body: info,
    });
    */

    doc.save('Pack_Note.pdf');
  };

  const generatePDUsinghtml2canvas = async () => {
    const input = document.getElementById('element-to-print');
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'JPEG', 0, 0);
      pdf.save('Pick_List.pdf');
    });
  };
  var currentDate = new Date().toLocaleString();

  var props = {
    outputType: 'save',
    returnJsPDFDocObject: true,
    fileName: `${orderDetails.externalReference} + Pack_Note`,
    orientationLandscape: false,
    compress: true,
    logo: {
      src: 'https://raw.githubusercontent.com/edisonneza/jspdf-invoice-template/demo/images/logo.png',
      width: 53.33, //aspect ratio = width/height
      height: 26.66,
      margin: {
        top: 0, //negative or positive num, from the current position
        left: 0, //negative or positive num, from the current position
      },
    },
    stamp: {
      inAllPages: true,
      src: 'https://raw.githubusercontent.com/edisonneza/jspdf-invoice-template/demo/images/qr_code.jpg',
      width: 20, //aspect ratio = width/height
      height: 20,
      margin: {
        top: 0, //negative or positive num, from the current position
        left: 0, //negative or positive num, from the current position
      },
    },
    business: {
      name: 'Tricab',
      address:
        'TriCab (Australia) Pty. Ltd. 33 Prohasky Street PORT MELBOURNE VIC AU 3207',
      phone: '+61 3 9081 5202',
      email: 'melbourne@tricab.com',
      email_1: 'info@example.al',
      website: 'www.tricab.com ',
    },
    contact: {
      label: 'Invoice issued for:',
      name: 'Client Name',
      address: 'Albania, Tirane, Astir',
      phone: '(+355) 069 22 22 222',
      email: 'client@website.al',
      otherInfo: 'www.website.al',
    },
    invoice: {
      label: 'Pack Note #: ',
      num: `${orderDetails.externalReference}`,
      invDate: `Payment Date: ${orderDetails.createdDate}`,
      invGenDate: `Invoice Date: ${currentDate}`,
      headerBorder: true,
      tableBodyBorder: true,
      header: [
        {
          title: '#',
          style: {
            width: 10,
          },
        },
        {
          title: 'Image',
          style: {
            width: 30,
          },
        },
        {
          title: 'Product Description',
          style: {
            width: 80,
          },
        },
        {title: 'Price'},
        {title: 'Quantity'},
        {title: 'Unit'},
        {title: 'Total'},
      ],
      // table: Array.from(Array(15), (item, index) => [
      //   index + 1,
      //   'There are many variations ',
      //   'Lorem Ipsum is simply dummy text dummy text ',
      //   200.5,
      //   4.5,
      //   'm2',
      //   400.5,
      // ]),
      table: Array.from(itemDetails, (item, index) => [
        index + 1,
        item.productName,
        'Lorem Ipsum is simply dummy text dummy text ',
        200.5,
        4.5,
        'm2',
        400.5,
      ]),
      additionalRows: [
        {
          col1: 'Total:',
          col2: '145,250.50',
          col3: 'ALL',
          style: {
            fontSize: 14, //optional, default 12
          },
        },
        {
          col1: 'VAT:',
          col2: '20',
          col3: '%',
          style: {
            fontSize: 10, //optional, default 12
          },
        },
        {
          col1: 'SubTotal:',
          col2: '116,199.90',
          col3: 'ALL',
          style: {
            fontSize: 10, //optional, default 12
          },
        },
      ],

      invDescLabel: 'Invoice Note',
      invDesc:
        "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary.",
    },
    footer: {
      text: 'The invoice is created on a computer and is valid without the signature and stamp.',
    },
    pageEnable: true,
    pageLabel: 'Page ',
  };

  const pdfUsingTemplate = () => {
    if (typeof window !== 'undefined') {
      const pdfObject = jsPDFInvoiceTemplate.default(props);
      // pdfObject.save('Pick_List.pdf');
    }
  };

  function printTable() {
    var str = '';
    let i = 1;
    for (let item of itemDetails) {
      let z = item.numberFulfilled ? item.numberFulfilled : 0;
      let x = item.quantity - item.numberFulfilled;
      str += ` <tr>
      <td style="border: solid 2px">${i}</td>
      <td style="border: solid 2px">${item.productName}</td>
      <td style="border: solid 2px">${item.productName}</td>
      <td style="border: solid 2px">${item.productName}</td>
      <td style="border: solid 2px">${item.quantity}</td>
      <td style="border: solid 2px">${z}</td>
      <td style="border: solid 2px">${x}</td>
    </tr>`;
      i++;
    }
    return str;
  }

  const printDate = () => {
    if (orderDetails.createdDate) {
      // let t = orderDetails.createdDate;
      let t = moment(orderDetails.createdDate.split('T')[0]).format(
        'Do MMM YYYY'
      );
      // console.log(t.split('T')[0]);
      return t;
    }
  };
  const PICKLISTHTML = `<div
  class="Wrapper"
  style="width:100%; margin: auto; height: auto; font-size: 14px;"
  id="head-div"
>
  <div
    class="top-container"
    style="
      display: flex;
      justify-content: space-between;
      align-items: center;
    "
  >
    <div class="logo" style="width: 50%">
      <img src="https://tricabtstbucket.blob.core.windows.net/bannerimages/0913a7fa-7181-49c4-9b08-d1d6f10fe7df.png" height="120" width="120" />
    </div>
    <div class="info" style="width: 100%">
      <p
        style="
          width: 60%;
          text-align: left;
          margin-top: 15px;
          line-height: 15px;
        "
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
    <div class="order-info" style="width: 100%">
      <h4
        style="
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 10px;
          text-align: left;
        "
      >
        PICK LIST <span id="externalReference">${
          orderDetails.externalReference
        }</span>
      </h4>
      <div
        class="order-box"
        style="
          width: calc(100% - 50px);
          border: solid 1px black;
          padding: 10px 25px;
        "
      >
        <div
          class="text-info"
          style="
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
          "
        >
          <label>Printed :</label>
          <span>15 May 2023</span>
        </div>
        <div
          class="text-info"
          style="
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
          "
        >
          <label>PO Ref :</label>
          <span>600000001</span>
        </div>
        <div
          class="text-info"
          style="
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
          "
        >
          <label>Cust Code :</label>
          <span>RDGELE</span>
        </div>
        <div
          class="text-info"
          style="
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
          "
        >
          <label>Order Date :</label>
          <span id="createdDate">${printDate()}</span>
        </div>
        <div
          class="text-info"
          style="
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
          "
        >
          <label>Entered By :</label>
          <span>VinodM</span>
        </div>
        <div
          class="text-info"
          style="
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
          "
        >
          <label>Dispatched By :</label>
          <span><strong>15 May 2023</strong></span>
        </div>
      </div>
    </div>
  </div>
  <div style="display: flex; justify-content: space-between">
    <div class="cust-details" style="display: center">
      <div style="width: 40%">
        <span style="font-weight: bold; text-decoration: underline"
          >Customer Datails :</span
        >
      </div>
      <p style="margin-top: 5px; width: 40%">
        <span>Attn : </span>
        Sharon Malik RDG Electrical Pty Ltd 432 San Mateo Avenue Mindura VIC
        AU 3500
      </p>
    </div>
    <div class="cust-details"></div>
    <div class="cust-details"></div>
  </div>
  <div class="dispatch-instruction">
    <span style="font-weight: bold">Dispatch Instruction:</span>
    <div style="border: solid 2px lightgray; margin-top: 10px; width: 100%">
      <ul>
        <li style="list-style-type: square; margin-bottom: 8px">
          Wait until all items are in stock (1 shipment)
        </li>
        <li style="list-style-type: square">
          Use the best shipping option – Not Urgent
        </li>
      </ul>
    </div>
  </div>
  <div class="table-info" style="margin-top: 15px">
    <table
      style="border: solid 2px; border-collapse: collapse; width: 100%"
      cellpadding="5"
      id="table"
    >
      <thead style="background: lightgray">
        <tr>
          <th style="border: solid 2px">Item</th>
          <th style="border: solid 2px">Sparky ID</th>
          <th style="border: solid 2px">Product ID</th>
          <th style="border: solid 2px">Product Description</th>
          <th style="border: solid 2px">Quantity Ordered (Pack)</th>
          <th style="border: solid 2px">Quantity Shipped (Pack)</th>
          <th style="border: solid 2px">Quantity Pending (Pack)</th>
        </tr>
      </thead>
      <tbody id="table-body">
      ${printTable()}
      </tbody>
    </table>
  </div>
  <br /><br /><br /><br /><br />
  <div
    class="bottom-info"
    style="
      display: flex;
      justify-content: space-between;
      width: 80%;
      margin: auto;
    "
  >
    <div class="left-info">
      <strong>DELIVER TO :</strong>
      <p style="width: 40%; line-height: 24px">
        RDG Electrical Pty Ltd Unit 9 32 Artisan Road Seven Hills NSW AU
        2147
      </p>
    </div>
    <div class="right-info">
      <div style="margin-bottom: 5px">
        <strong>Carrier:</strong> <span>TLOG-VFS</span>
      </div>
      <div><strong>Weight:</strong> <span>10kg</span></div>
    </div>
  </div>
  <div
    class="contact-info"
    style="display: flex; gap: 100px; margin-top: 20px"
  >
    <div class="left-info">
      <strong>Contact on delivery: </strong><br />
      <div class="info" style="display: flex; gap: 40px">
        <label>Name :</label> <span>Brade Harriis</span>
      </div>
      <div class="info" style="display: flex; gap: 40px">
        <label>T/M :</label> <span>03 963001732 </span>
      </div>
    </div>
    <div class="right-info">
      <strong>Contact on delivery: </strong><br />
      <div class="box-info" style="border: solid 2px">
        <ul style="padding: 0 25px">
          <li style="list-style-type: square">
            Please delivery to Gate No. 15 at the back of the warehouse
          </li>
        </ul>
      </div>
    </div>
  </div>
  <div
    class="bottom-text"
    style="width: 85%; margin: auto; margin-top: 20px"
  >
    <p
      style="width: 90%; margin: auto; border-top: solid 1px; padding: 10px"
    >
      <i>
        Certificate of Compliance- Sparky Warehouse Australia Pty Ltd
        certifies that all products shipped under this pack note were
        purchased solely from the original manufacturer or through the
        manufacturer’s authorized distribution. The original manufacturer
        warrants and certifies that the products they produce meet their
        specifications. Evidence of this warranty and certification is
        maintained at the manufacturer and/or at Sparky Warehouse Australia.
        This pack note is the Evidance of Conformity that this shipment
        meets the requirements of Sparky Warehouse Australia’s Quality
        Management System and/or Customer Purchase Order requirements agreed
        between Sparky Warehouse Australia and Customer.
      </i>
    </p>
    <div style="margin-top: 10px; text-align: center">
      <span style="font-weight: bold">THANK YOU FOR YOUR ORDER</span><br />
      <strong style="font-weight: bold; font-size: 14px"
        >THIS ORDER IS SUBJECTED TO ALL TERMS AND CONDITIONS DISPLAYED AT:
        www.sparkywarehouse.com.au</strong
      >
    </div>
  </div>
</div>`;

  /* NOT USED
  const openPDF = () => {
    // let aTag = (
    //   <a
    //     href={`https://erp.cyrusretail.com.au/pdf_SPARKY/PickList_${orderDetails.externalReference}.pdf`}
    //     target="_blank"
    //     rel="noopener noreferrer"
    //     // style="display:none"
    //     id="aTag"
    //   ></a>
    // );
    let a = document.createElement('a');
    a.setAttribute(
      'href',
      `https://erp.cyrusretail.com.au/pdf_SPARKY/PickList_${orderDetails.externalReference}.pdf`
    );
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
    a.setAttribute('id', 'pdfTag');
    document.getElementById('header-row').appendChild(a);
    document.getElementById('pdfTag').click();
  };
  */

  const pdfService = () => {
    console.log('^^^^^^^^^^^^^^^^^222', PICKLISTHTML);
    // return;
    setLoading(true);
    const encodedString = Buffer.from(PICKLISTHTML).toString('base64');
    // console.log('^^^^^^^^^^^^ encodedString = ', encodedString);
    axios
      .post(
        'http://pdf.cyrusretail.com.au/api/PdfGenerator/Generate',
        {
          HTML: encodedString,
          filename: `PickList_${orderDetails.externalReference}`,
          folderName: 'pdf_SPARKY',
          pagesize: 'A4',
        },
        {
          headers: {
            Authorization: 'S29hbGFQREZHZW5lcmF0b3I6UGFzc3dvcmRAMTIz',
            // Authorization: 'S29hbGFQREZHZW5lcmF0b3I6UGFzc3dvcmRAMTIz###',
          },
        }
      )
      .then((res) => {
        console.log(res);
        // openPDF();
        window.open(
          `https://erp.cyrusretail.com.au/pdf_SPARKY/PickList_${orderDetails.externalReference}.pdf`
        );
        setLoading(false);
      })
      .catch((err) => {
        console.log('pdfService Error1', err);
        setLoading(false);
      });
  };
  // console.log('********************', ordersList);
  // console.log('$$$$$$$$$$$$$$$$$$$$$$$$ exportData', exportData);
  // console.log('============================ originalList', originalList);
  console.log('++++++++++++++111 orderDetails', orderDetails);
  console.log('++++++++++++++222 itemDetails', itemDetails);
  // console.log('++++++++++++++333 isOrdersList', isOrdersList);
  const input = document.getElementById('element-to-print');
  console.log('INPUT', input);
  return (
    <>
      <Row className={stlyes.mainRow} id="header-row">
        {isOrdersList ? (
          <Col span={5}>
            <p className={stlyes.topLittle}>Manage Orders</p>
          </Col>
        ) : (
          <Col span={18}>
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
            span={2}
            className={stlyes.addProductButton}
            style={{display: 'flex'}}
          >
            <Button
              loading={loading}
              onClick={pdfService}
              disabled={isOrdersList}
            >
              Print
            </Button>
            {/* <Button onClick={pdfUsingTemplate}>Print</Button> */}
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
      </Row>
      {/* <div ref={reportTemplateRef} id="element-to-print">
        <Pick_List_Template />
      </div> */}
    </>
  );
};

export default Header;
