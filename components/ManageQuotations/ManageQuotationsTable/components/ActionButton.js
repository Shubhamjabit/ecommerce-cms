import React, {Component, useEffect, useRef, useState} from 'react';
import {Row, Col} from 'antd';
import {Button, Tooltip} from 'antd';
import styles from './styles.module.scss';
import {
  EyeFilled,
  EyeInvisibleFilled,
  SendOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import {useDispatch} from 'react-redux';
import {setCategory} from '../../../../store/actions/categoryActions';
import QuotePdf from './QuotePdf';
import ReactToPrint from 'react-to-print';
import {cmsendPoint, envUrl} from '../../../../utils/factory';
import axios from 'axios';

const ActionButton = ({quoteId, handleMoreClick}) => {
  const dispatch = useDispatch();
  const componentRef = useRef();
  const [quoteData, setQuoteData] = useState([]);
  console.log('quoteDataaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', quoteData);
  //console.log('@@@@@@@@@@@@@category', category);

  useEffect(() => {
    getQuoteData();
  }, []);

  const getQuoteData = async () => {
    try {
      const jsonToPost = {
        quoteId: quoteId,
      };
      axios
        .post(`${envUrl.baseUrl}${cmsendPoint.getQuoteData}`, jsonToPost, {})
        .then(function (response) {
          console.log('rrrrrrrrrrr', response);
          if ((response.status = 200)) {
            setQuoteData(response.data.data);
          } else console.log('Request unsuccessful - ', response.data.msg);
        })
        .catch((error) => {
          console.log('API error - ', error);
        });
    } catch (error) {
      console.log('Error - ', error);
    } finally {
    }
  };

  return (
    <>
      <div className={styles.dashboardProductTableAction}>
        {/* <span onClick={() => getQuoteData()}> */}
        <ReactToPrint
          documentTitle={`Quotation-${quoteId}`}
          trigger={() => (
            <Button className={styles.dashboardProductTableActionButtonPublish}>
              <EyeOutlined style={{fontSize: '14px'}} />
              View
            </Button>
          )}
          content={() => componentRef.current}
          onBeforeGetContent={getQuoteData}
        />
        {/* </span> */}
      </div>
      {/* {quoteData ? ( */}
      <div style={{display: 'none'}}>
        <div
          className="Wrapper"
          style={{
            width: '100%',
            margin: 'auto',
            height: 'auto',
            fontSize: 14,
          }}
          id="head-div"
          ref={componentRef}
        >
          <QuotePdf cartData={quoteData} quoteId={quoteId} />
        </div>
      </div>
      {/* ) : null} */}
    </>
  );
};

export default ActionButton;
