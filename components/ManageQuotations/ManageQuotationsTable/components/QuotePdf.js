import React, {useState, useRef, useEffect} from 'react';
import moment from 'moment-timezone';
import {useSelector} from 'react-redux';

const QuotePdf = ({cartData, quoteId, orderSummary}) => {
  const componentRef = useRef();

  //   const quoteId = useSelector((state) => state.cartReducer.quoteId);
  console.log('QuoteODFFFFFFFFFFFFFFFFFFFF', quoteId);

  const printDate = () => {
    // let t = orderDetails.createdDate;
    let t = moment().format('Do MMM YYYY, hh:mm:ss');
    // console.log(t.split('T')[0]);
    return t;
  };

  const PrintTable = () => {
    const [totalPrice, setTotalPrice] = useState(0);
    useEffect(() => {
      let total = 0;
      cartData.forEach((e) => {
        let lineTotal = e.price * e.qty.toFixed(2);
        total += lineTotal;
      });
      setTotalPrice(total);
    }, []);

    return (
      <>
        {cartData.map((item, index) => (
          <tr key={index}>
            <td style={{border: 'solid 2px', textAlign: 'center'}}>
              {index + 1}
            </td>
            <td style={{border: 'solid 2px'}}>{item.name}</td>
            <td style={{border: 'solid 2px'}}>{item.name}</td>
            {/* <td style={{ border: "solid 2px" }}>{item.productName}</td> */}
            <td style={{border: 'solid 2px', textAlign: 'center'}}>
              {item.qty}
            </td>
            <td style={{border: 'solid 2px', textAlign: 'center'}}>
              {item.price}
            </td>
            <td style={{border: 'solid 2px', textAlign: 'center'}}>
              {item.price * item.qty.toFixed(2)}
            </td>
            {/* <td style={{ border: "solid 2px", textAlign: "center" }}>
              {item.quantity - (item.qtyAlreadyShipped + item.qtyShipped)}
            </td> */}
            {/* {setTotalPrice(
              (prevState) => prevState + item.price * item.qty.toFixed(2)
            )} */}
          </tr>
        ))}
        <tr>
          <td style={{border: 'solid 2px'}}></td>
          <td style={{border: 'solid 2px'}}></td>
          <td style={{border: 'solid 2px'}}>Sub Total</td>
          <td style={{border: 'solid 2px'}}></td>
          <td style={{border: 'solid 2px'}}></td>
          <td style={{border: 'solid 2px', textAlign: 'center'}}>
            {cartData[0]?.subAmount}
          </td>
        </tr>
        <tr>
          <td style={{border: 'solid 2px'}}></td>
          <td style={{border: 'solid 2px'}}></td>
          <td style={{border: 'solid 2px'}}>Freight Charges</td>
          <td style={{border: 'solid 2px'}}></td>
          <td style={{border: 'solid 2px'}}></td>
          <td style={{border: 'solid 2px', textAlign: 'center'}}>
            {cartData[0]?.shippingAmount}
          </td>
        </tr>

        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td style={{border: 'solid 2px', textAlign: 'center'}}>AUD</td>
          <td style={{border: 'solid 2px', textAlign: 'center'}}>
            {cartData[0]?.totalAmount}
          </td>
        </tr>
      </>
    );
  };

  return (
    <>
      {/* PDF STARTS */}
      {/* <div style={{ display: "none" }}> */}
      <div
        className="Wrapper-quotePdf"
        style={{
          // width: "100%",
          width: '95%',
          margin: 'auto',
          height: 'auto',
          fontSize: 14,
        }}
        id="head-div"
        ref={componentRef}
      >
        <div
          className="top-container-quotePdf"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div
            className="PickListLogo-quotePdf"
            style={{width: '50%', marginBottom: '5%'}}
          >
            <img
              src="https://tricabtstbucket.blob.core.windows.net/bannerimages/0913a7fa-7181-49c4-9b08-d1d6f10fe7df.png"
              height={150}
              width={150}
            />
          </div>
          <div className="info-quotePdf" style={{width: '100%'}}>
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
            className="order-info-quotePdf"
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
              Quotation <span id="externalReference">{quoteId}</span>
            </h4>
            <div
              className="order-box-quotePdf"
              style={{
                width: 'calc(100% - 50px)',
                border: 'solid 1px black',
                padding: '10px 25px',
              }}
            >
              <div
                className="text-info-quotePdf"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 10,
                }}
              >
                <label>Quote No.:</label>
                <span>{quoteId}</span>
              </div>
              <div
                className="text-info-quotePdf"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 10,
                }}
              >
                <label>Raised By:</label>
                <span>
                  {cartData[0]?.first_name} {cartData[0]?.last_name}
                </span>
              </div>

              <div
                className="text-info-quotePdf"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 10,
                }}
              >
                <label>Quote Date & Time:</label>
                <span id="createdDate" style={{textAlign: 'right'}}>
                  {printDate()}
                </span>
              </div>
              <div
                className="text-info-quotePdf"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 10,
                }}
              >
                <label>Entered By :</label>
                <span>
                  {cartData[0]?.first_name} {cartData[0]?.last_name}
                </span>
              </div>
              <div
                className="text-info-quotePdf"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 10,
                }}
              >
                <label>Valid Till:</label>
                <span>
                  <strong>15 Jun 2023</strong>
                </span>
              </div>
              <div
                className="text-info-quotePdf"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 10,
                }}
              >
                <label>Cust Code:</label>
                <span>RDGELE</span>
              </div>
              <div>ALL PRICES EXCLUSIVE OF GST/VAT</div>
            </div>
          </div>
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <div className="cust-details-quotePdf" style={{display: 'center'}}>
            <div style={{width: '40%'}}>
              <span style={{fontWeight: 'bold', textDecoration: 'underline'}}>
                To:
              </span>
            </div>
            <p style={{marginTop: 5, width: '100%'}}>
              <span>Attn: Sharon Malik</span>
              <br />
              <span>RDG Electrical Pvt Ltd</span>
              <br />
              <span>432 San Mateo Avenue</span>
              <br />
              <span>Mindura VIC AU 3500</span>
            </p>
          </div>
          <div className="cust-details-quotePdf" />
          <div className="cust-details-quotePdf" />
        </div>
        {/* <div className="dispatch-instruction">
          <span style={{ fontWeight: "bold" }}>Dispatch Instruction:</span>
          <div
            style={{
              border: "solid 2px lightgray",
              marginTop: 10,
              width: "100%",
            }}
          >
            <ul>
              <li style={{ listStyleType: "square", marginBottom: 8 }}>
                Wait until all items are in stock (1 shipment)
              </li>
              <li style={{ listStyleType: "square" }}>
                Use the best shipping option – Not Urgent
              </li>
            </ul>
          </div>
        </div> */}
        <div className="table-info-quotePdf" style={{marginTop: 15}}>
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
                {/* <th style={{ border: "solid 2px" }}>Product ID</th> */}
                <th style={{border: 'solid 2px'}}>Product Description</th>
                <th style={{border: 'solid 2px'}}>Quantity Requested (Pack)</th>
                <th style={{border: 'solid 2px'}}>Unit Price</th>
                <th style={{border: 'solid 2px'}}>Total</th>
                {/* <th style={{ border: "solid 2px" }}>
                  Quantity Pending (Pack)
                </th> */}
              </tr>
            </thead>
            <tbody id="table-body">
              <PrintTable />
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
          className="bottom-info-quotePdf"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '80%',
            margin: 'auto',
          }}
        >
          <div className="left-info-quotePdf">
            <strong>Terms:</strong>
            <p
              style={{
                width: '40%',
                // lineHeight: 24,
              }}
            >
              Please contact us for more information and payment options
            </p>
          </div>
          {/* <div className="right-info">
            <div style={{ marginBottom: 5 }}>
              <strong>Carrier:</strong> <span>TLOG-VFS</span>
            </div>
            <div>
              <strong>Weight:</strong> <span>10kg</span>
            </div>
          </div> */}
        </div>
        {/* <div
          className="contact-info"
          style={{ display: "flex", gap: 100, marginTop: 20 }}
        >
          <div className="left-info">
            <strong>Contact on delivery: </strong>
            <br />
            <div className="info" style={{ display: "flex", gap: 40 }}>
              <label>Name :</label>{" "}
              <span>
                {orderDetails.customerFName} {orderDetails.customerLName}
              </span>
            </div>
            <div className="info" style={{ display: "flex", gap: 40 }}>
              <label>T/M :</label> <span>{orderDetails.customerMobile} </span>
            </div>
          </div>
          <div className="right-info">
            <strong>Delivery Instruction: </strong>
            <br />
            <div className="box-info" style={{ border: "solid 2px" }}>
              <ul style={{ padding: "0 25px" }}>
                <li style={{ listStyleType: "square" }}>
                  Please delivery to Gate No. 15 at the back of the warehouse
                </li>
              </ul>
            </div>
          </div>
        </div> */}
        <div
          className="bottom-text-quotePdf"
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
            {/* <i>
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
            </i> */}
          </p>
          <div style={{marginTop: 10, textAlign: 'center'}}>
            <span style={{fontWeight: 'bold'}}>THANK YOU FOR YOUR ORDER</span>
            <br />
            <strong style={{fontWeight: 'bold', fontSize: 14}}>
              THIS ORDER IS SUBJECTED TO ALL TERMS AND CONDITIONS DISPLAYED AT:
              www.sparkywarehouse.com.au
            </strong>
          </div>
        </div>
        {/* </div> */}
      </div>
    </>
  );
};

export default QuotePdf;
